// import bodyParser from 'body-parser';
import Boom from 'boom';
import parseFilters from './lib/parseFilters';

export default function(options = {}) {
  function start({ app, store, auth }, cb) {
    app.use('/api/teams', auth('api'));

    app.get('/api/teams', async (req, res, next) => {
      try {
        const meta = { date: new Date(), account: req.user };
        await store.audit(meta, 'viewed teams');
        const filters = parseFilters(req.query, ['name', 'createdBy']);
        const criteria = {
          user: { id: req.user.id, permission: 'teams-read' },
          filters,
        };
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : undefined;
        const offset = req.query.offset ? parseInt(req.query.offset, 10) : undefined;

        const result = await store.findTeams(criteria, limit, offset);
        res.json(result);
      } catch (err) {
        next(err);
      }
    });

    app.get('/api/teams/:id', async (req, res, next) => {
      try {
        const { id } = req.params;
        const team = await store.getTeam(id, { id: req.user.id, permission: 'registries-read'});
        if (!team) return next(Boom.notFound());
        if (! await store.hasPermissionOnTeam(req.user, team.id, 'teams-read')) return next(Boom.forbidden());

        const meta = { date: new Date(), account: req.user };
        await store.audit(meta, 'viewed team', { team });
        return res.json(team);
      } catch (err) {
        next(err);
      }
    });

    app.get('/api/teams/by-name/:name', async (req, res, next) => {
      try {
        const { name } = req.params;
        const criteria = {
          user: { id: req.user.id, permission: 'teams-read' },
          filters: parseFilters({ name }, ['name']),
        };
        const team = await store.findTeam(criteria);
        if (!team) return next(Boom.notFound());
        if (! await store.hasPermissionOnTeam(req.user, team.id, 'teams-read')) return next(Boom.forbidden());
        const teamWithServices = await store.getTeam(team.id, { id: req.user.id, permission: 'registries-read'});

        const meta = { date: new Date(), account: req.user };
        await store.audit(meta, 'viewed team', { team });
        return res.json(teamWithServices);
      } catch (err) {
        next(err);
      }
    });

    app.get('/api/teams/for/:registry/:service', async (req, res, next) => {
      try {
        const registry = await store.findRegistry({ name: req.params.registry });
        if (!registry) return next(Boom.notFound());
        if (! await store.hasPermissionOnRegistry(req.user, registry.id, 'registries-read')) return next(Boom.forbidden());

        const service = await store.findService({ filters: parseFilters(req.params, ['service', 'registry'], {
          service: 'name'
        }) });
        if (!service) return next(Boom.notFound());

        const team = await store.getTeamForService(service, { id: req.user.id, permission: 'registries-read'});
        if (!team) return next(Boom.notFound());
        if (! await store.hasPermissionOnTeam(req.user, team.id, 'teams-read')) return next(Boom.forbidden());

        const meta = { date: new Date(), account: req.user };
        await store.audit(meta, 'viewed team for service', { team, service });
        return res.json(team);
      } catch (err) {
        next(err);
      }
    });

    app.get('/api/teams/:id/namespaces', async (req, res, next) => {
      try {
        if (! await store.hasPermissionOnTeam(req.user, req.params.id, 'teams-manage')) return next(Boom.forbidden());
        const data = await store.teamRolesForNamespaces(req.params.id, req.user);
        res.json(data);
      } catch (error) {
        next(error);
      }
    });

    app.get('/api/teams/:id/registries', async (req, res, next) => {
      try {
        if (! await store.hasPermissionOnTeam(req.user, req.params.id, 'teams-manage')) return next(Boom.forbidden());
        const data = await store.teamRolesForRegistries(req.params.id, req.user);
        res.json(data);
      } catch (error) {
        next(error);
      }
    });

    app.get('/api/teams/:id/system', async (req, res, next) => {
      try {
        if (! await store.hasPermissionOnTeam(req.user, req.params.id, 'teams-manage')) return next(Boom.forbidden());
        const data = await store.teamRolesForSystem(req.params.id, req.user);
        res.json(data);
      } catch (error) {
        next(error);
      }
    });

    app.get('/api/teams/:id/teams', async (req, res, next) => {
      try {
        if (! await store.hasPermission(req.user, 'teams-manage')) return next(Boom.forbidden());
        const data = await store.teamRolesForTeams(req.params.id, req.user);
        res.json(data);
      } catch (error) {
        next(error);
      }
    });

    cb();
  }

  return {
    start,
  };
}
