import sqb from 'sqb';
import { v4 as uuid } from 'uuid';
import Promise from 'bluebird';
import Team from '../../domain/Team';
import Service from '../../domain/Service';
import Registry from '../../domain/Registry';
import Account from '../../domain/Account';


const { Op, raw, innerJoin } = sqb;

export default function(options) {
  function start({ config, logger, db, authz }, cb) {

    async function getTeam(id) {
      logger.debug(`Getting team by id ${id}`);

      const teamBuilder = sqb
        .select('t.id', 't.name', 't.created_on', 't.created_by', 'a.display_name')
        .from('active_team__vw t', 'active_account__vw a')
        .where(Op.eq('t.created_by', raw('a.id')))
        .where(Op.eq('t.id', id));

      const attributeBuilder = sqb
        .select('ta.name', 'ta.value')
        .from('team_attribute ta', 'active_team__vw t')
        .where(Op.eq('ta.team', raw('t.id')))
        .where(Op.eq('ta.team', id));


      const servicesBuilder = sqb
        .select('s.id service_id', 's.name service_name', 'sr.id registry_id', 'sr.name registry_name')
        .from('active_team__vw t', 'team_service ts', 'active_service__vw s', 'active_registry__vw sr')
        .where(Op.eq('t.id', raw('ts.team')))
        .where(Op.eq('ts.service', raw('s.id')))
        .where(Op.eq('s.registry', raw('sr.id')))
        .where(Op.eq('t.id', id))
        .orderBy('s.name');


      return db.withTransaction(async connection => {
        const [teamResult, attrsResult, servicesResult] = await Promise.all([
          connection.query(db.serialize(teamBuilder, {}).sql),
          connection.query(db.serialize(attributeBuilder, {}).sql),
          connection.query(db.serialize(servicesBuilder, {}).sql),
        ]);

        logger.debug(`Found ${teamResult.rowCount} teams with id: ${id}`);
        return teamResult.rowCount ? toTeam(teamResult.rows[0], attrsResult.rows, servicesResult.rows) : undefined;
      });
    }

    async function _getTeamAttributes(connection, ids) {
      const teamIds = [].concat(ids);
      if (!teamIds.length) return [];

      const attributeBuilder = sqb
        .select('ta.team', 'ta.name', 'ta.value')
        .from('team_attribute ta', 'active_team__vw t')
        .where(Op.eq('ta.team', raw('t.id')))
        .where(Op.in('ta.team', teamIds));

        const results = await connection.query(db.serialize(attributeBuilder, {}).sql);
        return results.rows.reduce((acc, row) => {
          if (!acc[row.team]) acc[row.team] = [];
          acc[row.team].push(row);
          return acc;
        }, {});
    }

    async function deleteTeam(id, meta) {
      logger.debug(`Deleting teamBuilder id: ${id}`);

      const builder = sqb
        .update('team', {
          deleted_on: meta.date,
          deleted_by: meta.account.id,
        })
        .where(Op.eq('id', id))
        .where(Op.is('deleted_on', null));

      await db.query(db.serialize(builder, {}).sql);

      logger.debug(`Deleted team, id: ${id}`);
    }

    async function findTeam(criteria) {
      const list = await findTeams(criteria, 1, 0);
      if (list.count > 1) throw new Error(`Expected 0 or 1 teams but found ${list.count}}`);
      return list.count === 1 ? list.items[0] : undefined;
    }

    async function findTeams(criteria = {}, limit = 50, offset = 0) {
      logger.debug(`Listing up to ${limit} teams starting from offset: ${offset}`);

      const bindVariables = {};

      const findTeamsBuilder = sqb
        .select('t.id', 't.name', 't.created_on', 't.created_by', 'a.display_name')
        .from('active_team__vw t')
        .join(
          innerJoin('active_account__vw a').on(Op.eq('t.created_by', raw('a.id')))
        )
        .orderBy('t.name asc')
        .limit(limit)
        .offset(offset);

      const countTeamsBuilder = sqb
        .select(raw('count(*) count'))
        .from('active_team__vw s')
        .join(
          innerJoin('active_account__vw a').on(Op.eq('s.created_by', raw('a.id')))
        );

      if (criteria.filters) {
        if (criteria.filters.name) {
          db.applyFilter(criteria.filters.name, 't.name', findTeamsBuilder, countTeamsBuilder);
        }

        if (criteria.filters.createdBy) {
          db.applyFilter(criteria.filters.createdBy, 'a.display_name', findTeamsBuilder, countTeamsBuilder);
        }
      }

      // if (criteria.user) {
      //   const idsQuery = authz.querySubjectIdsWithPermission('registry', criteria.user.id, criteria.user.permission);
      //   [findTeamsBuilder, countTeamsBuilder].forEach(builder => builder.where(Op.in('sr.id', idsQuery)));
      // }

      return db.withTransaction(async connection => {
        const findStatement = db.serialize(findTeamsBuilder, bindVariables);
        const countStatement = db.serialize(countTeamsBuilder, bindVariables);

        const [findResult, countResult] = await Promise.all([
          connection.query(findStatement.sql, findStatement.values),
          connection.query(countStatement.sql, countStatement.values)
        ]);

        const attributes = await _getTeamAttributes(connection, findResult.rows.map(({ id }) => id));
        const items = findResult.rows.map(row => toTeam(row, attributes[row.id]));
        const count = parseInt(countResult.rows[0].count, 10);
        logger.debug(`Returning ${items.length} of ${count} teams`);

        return {
          limit,
          offset,
          count,
          items,
        };
      });
    }

    async function saveTeam(team, meta) {
      logger.debug(`Saving new team with name ${team.name} by account ${meta.account.id}`);

      return db.withTransaction(async connection => {
        const newTeamId = uuid();

        const teamBuilder = sqb
          .insert('team', {
            id: newTeamId,
            name: team.name,
            created_on: meta.date,
            created_by: meta.account.id,
          });

        await connection.query(db.serialize(teamBuilder, {}).sql);

        const attributes = team.attributes || {};
        const attrBuilders = Object.keys(attributes).map(name => sqb
        .insert('team_attribute', {
          team: newTeamId,
          name,
          value: attributes[name],
        }));

        await Promise.mapSeries(attrBuilders, async (builder) => {
          await connection.query(db.serialize(builder, {}).sql);
        });

        logger.debug(`Saved new team with id ${newTeamId}`);
        return newTeamId;
      });
    }

    async function associateServiceWithTeam(service, team) {
      logger.debug(`Associating service with id ${service.id} with team id ${team.id}`);

      const deleteBuilder = sqb
        .delete('team_service ts')
        .where(Op.eq('ts.service', service.id));

      const insertBuilder = sqb
        .insert('team_service', {
          team: team.id,
          service: service.id,
        });

      await db.withTransaction(async connection => {
        await connection.query(db.serialize(deleteBuilder, {}).sql);
        await connection.query(db.serialize(insertBuilder, {}).sql);
      });

      logger.debug(`Associated service ${service.id} with team ${team.id}`);
    }

    async function disassociateService(service) {
      logger.debug(`Disassociating service with id ${service.id}`);

      const deleteBuilder = sqb
        .delete('team_service ts')
        .where(Op.eq('ts.service', service.id));

      await db.query(db.serialize(deleteBuilder, {}).sql);
      logger.debug(`Disassociated service ${service.id}`);
    }

    function toTeam(row, attributes = [], services = []) {
      return new Team({
        id: row.id,
        name: row.name,
        createdOn: row.created_on,
        createdBy: new Account({
          id: row.created_by,
          displayName: row.display_name,
        }),
        attributes: attributes.reduce((attrs, row) => {
          return { ...attrs, [row.name]: row.value };
        }, {}),
        services: services.map(row => (new Service({
          id: row.service_id,
          name: row.service_name,
          registry: new Registry({
            id: row.registry_id,
            name: row.registry_name,
          })
        }))),
      });
    }

    return cb(null, {
      getTeam,
      deleteTeam,
      findTeams,
      findTeam,
      saveTeam,
      associateServiceWithTeam,
      disassociateService,
    });
  }

  return {
    start,
  };
}
