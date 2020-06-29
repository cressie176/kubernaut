import sqb from 'sqb';
import { v4 as uuid } from 'uuid';
import Promise from 'bluebird';
import Account from '../../domain/Account';
import Cluster from '../../domain/Cluster';
import IngressHostKey from '../../domain/IngressHostKey';
import IngressVariableKey from '../../domain/IngressVariableKey';
import ClusterIngressHost from '../../domain/ClusterIngressHost';
import ClusterIngressVariable from '../../domain/ClusterIngressVariable';
import IngressClass from '../../domain/IngressClass';
import ClusterIngressClass from '../../domain/ClusterIngressClass';
import IngressVersion from '../../domain/IngressVersion';
import IngressEntry from '../../domain/IngressEntry';
import IngressEntryRule from '../../domain/IngressEntryRule';
import IngressEntryAnnotation from '../../domain/IngressEntryAnnotation';

const { Op, raw, innerJoin } = sqb;

export default function() {

  function start({ logger, db }, cb) {

    function getIngressHostKey(id) {
      return db.withTransaction(connection => {
        return _getIngressHostKey(connection, id);
      });
    }

    async function _getIngressHostKey(connection, id) {
      const builder = sqb
        .select('ihk.id', 'ihk.name', 'ihk.created_by', 'a.display_name', 'ihk.created_on')
        .from('active_ingress_host_key__vw ihk')
        .join(
          innerJoin('account a').on(Op.eq('ihk.created_by', raw('a.id')))
        )
        .where(Op.eq('ihk.id', id));

      const result = await connection.query(db.serialize(builder, {}).sql);

      return result.rowCount ? toIngressHostKey(result.rows[0]) : undefined;
    }

    function getIngressVariableKey(id) {
      return db.withTransaction(connection => {
        return _getIngressVariableKey(connection, id);
      });
    }

    async function _getIngressVariableKey(connection, id) {
      const builder = sqb
        .select('ivk.id', 'ivk.name', 'ivk.created_by', 'a.display_name', 'ivk.created_on')
        .from('active_ingress_variable_key__vw ivk')
        .join(
          innerJoin('account a').on(Op.eq('ivk.created_by', raw('a.id')))
        )
        .where(Op.eq('ivk.id', id));

      const result = await connection.query(db.serialize(builder, {}).sql);

      return result.rowCount ? toIngressVariableKey(result.rows[0]) : undefined;
    }
    function getIngressClass(id) {
      return db.withTransaction(connection => {
        return _getIngressClass(connection, id);
      });
    }

    async function _getIngressClass(connection, id) {
      const builder = sqb
        .select('ic.id', 'ic.name', 'ic.created_by', 'a.display_name', 'ic.created_on')
        .from('active_ingress_class__vw ic')
        .join(
          innerJoin('account a').on(Op.eq('ic.created_by', raw('a.id')))
        )
        .where(Op.eq('ic.id', id));

      const result = await connection.query(db.serialize(builder, {}).sql);

      return result.rowCount ? toIngressClass(result.rows[0]) : undefined;
    }

    function getClusterIngressHost(id) {
      return db.withTransaction(connection => {
        return _getClusterIngressHost(connection, id);
      });
    }

    async function _getClusterIngressHost(connection, id) {
      const builder = sqb
        .select('cih.id', 'cih.value', 'cih.created_by', 'a.display_name', 'cih.created_on', 'c.id cluster_id', 'c.name cluster_name', 'cih.ingress_host_key', 'ihk.name ingress_host_key_name')
        .from('active_cluster_ingress_host__vw cih')
        .join(
          innerJoin('account a').on(Op.eq('cih.created_by', raw('a.id'))),
          innerJoin('active_cluster__vw c').on(Op.eq('cih.cluster', raw('c.id'))),
          innerJoin('active_ingress_host_key__vw ihk').on(Op.eq('cih.ingress_host_key', raw('ihk.id')))
        )
        .where(Op.eq('cih.id', id));

      const result = await connection.query(db.serialize(builder, {}).sql);

      return result.rowCount ? toClusterIngressHost(result.rows[0]) : undefined;
    }

    function getClusterIngressVariable(id) {
      return db.withTransaction(connection => {
        return _getClusterIngressVariable(connection, id);
      });
    }

    async function _getClusterIngressVariable(connection, id) {
      const builder = sqb
        .select('civ.id', 'civ.value', 'civ.created_by', 'a.display_name', 'civ.created_on', 'c.id cluster_id', 'c.name cluster_name', 'civ.ingress_variable_key', 'ivk.name ingress_variable_key_name')
        .from('active_cluster_ingress_variable__vw civ')
        .join(
          innerJoin('account a').on(Op.eq('civ.created_by', raw('a.id'))),
          innerJoin('active_cluster__vw c').on(Op.eq('civ.cluster', raw('c.id'))),
          innerJoin('active_ingress_variable_key__vw ivk').on(Op.eq('civ.ingress_variable_key', raw('ivk.id')))
        )
        .where(Op.eq('civ.id', id));

      const result = await connection.query(db.serialize(builder, {}).sql);

      return result.rowCount ? toClusterIngressVariable(result.rows[0]) : undefined;
    }

    function getClusterIngressClass(id) {
      return db.withTransaction(connection => {
        return _getClusterIngressClass(connection, id);
      });
    }

    async function _getClusterIngressClass(connection, id) {
      const builder = sqb
        .select('cic.id', 'cic.created_by', 'a.display_name', 'cic.created_on', 'c.id cluster_id', 'c.name cluster_name', 'cic.ingress_class', 'ic.name ingress_class_name')
        .from('active_cluster_ingress_class__vw cic')
        .join(
          innerJoin('account a').on(Op.eq('cic.created_by', raw('a.id'))),
          innerJoin('active_cluster__vw c').on(Op.eq('cic.cluster', raw('c.id'))),
          innerJoin('active_ingress_class__vw ic').on(Op.eq('cic.ingress_class', raw('ic.id')))
        )
        .where(Op.eq('cic.id', id));

      const result = await connection.query(db.serialize(builder, {}).sql);

      return result.rowCount ? toClusterIngressClass(result.rows[0]) : undefined;
    }

    function findIngressHostKeys(limit = 50, offset = 0) {
      const builder = sqb
        .select('ihk.id', 'ihk.name', 'ihk.created_by', 'a.display_name', 'ihk.created_on')
        .from('active_ingress_host_key__vw ihk')
        .join(
          innerJoin('account a').on(Op.eq('ihk.created_by', raw('a.id')))
        )
        .orderBy('ihk.name')
        .limit(limit)
        .offset(offset);

      const countBuilder = sqb
        .select(raw('count(*) count'))
        .from('active_ingress_host_key__vw');

      return db.withTransaction(async connection => {
        const [result, countResult] = await Promise.all([
          connection.query(db.serialize(builder, {}).sql),
          connection.query(db.serialize(countBuilder, {}).sql)
        ]);

        const items = result.rows.map(toIngressHostKey);
        const count = parseInt(countResult.rows[0].count, 10);
        return { limit, offset, count, items };
      });
    }

    function findIngressVariableKeys(limit = 50, offset = 0) {
      const builder = sqb
        .select('ivk.id', 'ivk.name', 'ivk.created_by', 'a.display_name', 'ivk.created_on')
        .from('active_ingress_variable_key__vw ivk')
        .join(
          innerJoin('account a').on(Op.eq('ivk.created_by', raw('a.id')))
        )
        .orderBy('ivk.name')
        .limit(limit)
        .offset(offset);

      const countBuilder = sqb
        .select(raw('count(*) count'))
        .from('active_ingress_variable_key__vw');

      return db.withTransaction(async connection => {
        const [result, countResult] = await Promise.all([
          connection.query(db.serialize(builder, {}).sql),
          connection.query(db.serialize(countBuilder, {}).sql)
        ]);

        const items = result.rows.map(toIngressHostKey);
        const count = parseInt(countResult.rows[0].count, 10);
        return { limit, offset, count, items };
      });
    }

    function findIngressClasses(limit = 50, offset = 0) {
      const builder = sqb
        .select('ic.id', 'ic.name', 'ic.created_by', 'a.display_name', 'ic.created_on')
        .from('active_ingress_class__vw ic')
        .join(
          innerJoin('account a').on(Op.eq('ic.created_by', raw('a.id')))
        )
        .orderBy('ic.name')
        .limit(limit)
        .offset(offset);

      const countBuilder = sqb
        .select(raw('count(*) count'))
        .from('active_ingress_class__vw');

      return db.withTransaction(async connection => {
        const [result, countResult] = await Promise.all([
          connection.query(db.serialize(builder, {}).sql),
          connection.query(db.serialize(countBuilder, {}).sql)
        ]);

        const items = result.rows.map(toIngressClass);
        const count = parseInt(countResult.rows[0].count, 10);
        return { limit, offset, count, items };
      });
    }

    function findClusterIngressHosts(criteria = {}, limit = 50, offset = 0) {
      const builder = sqb
        .select('cih.id', 'cih.value', 'cih.created_by', 'a.display_name', 'cih.created_on', 'c.id cluster_id', 'c.name cluster_name', 'cih.ingress_host_key', 'ihk.name ingress_host_key_name')
        .from('active_cluster_ingress_host__vw cih')
        .join(
          innerJoin('account a').on(Op.eq('cih.created_by', raw('a.id'))),
          innerJoin('active_cluster__vw c').on(Op.eq('cih.cluster', raw('c.id'))),
          innerJoin('active_ingress_host_key__vw ihk').on(Op.eq('cih.ingress_host_key', raw('ihk.id')))
        )
        .orderBy('ihk.name')
        .limit(limit)
        .offset(offset);

      const countBuilder = sqb
        .select(raw('count(*) count'))
        .from('active_cluster_ingress_host__vw cih')
        .join(
          innerJoin('active_cluster__vw c').on(Op.eq('cih.cluster', raw('c.id'))),
          innerJoin('active_ingress_host_key__vw ihk').on(Op.eq('cih.ingress_host_key', raw('ihk.id')))
        );

      if(criteria.cluster) {
        [builder, countBuilder].forEach(builder => builder.where(Op.eq('c.id', criteria.cluster)));
      }

      return db.withTransaction(async connection => {
        const [result, countResult] = await Promise.all([
          connection.query(db.serialize(builder, {}).sql),
          connection.query(db.serialize(countBuilder, {}).sql)
        ]);

        const items = result.rows.map(toClusterIngressHost);
        const count = parseInt(countResult.rows[0].count, 10);
        return { limit, offset, count, items };
      });
    }

    function findClusterIngressVariables(criteria = {}, limit = 50, offset = 0) {
      const builder = sqb
        .select('civ.id', 'civ.value', 'civ.created_by', 'a.display_name', 'civ.created_on', 'c.id cluster_id', 'c.name cluster_name', 'civ.ingress_variable_key', 'ivk.name ingress_variable_key_name')
        .from('active_cluster_ingress_variable__vw civ')
        .join(
          innerJoin('account a').on(Op.eq('civ.created_by', raw('a.id'))),
          innerJoin('active_cluster__vw c').on(Op.eq('civ.cluster', raw('c.id'))),
          innerJoin('active_ingress_variable_key__vw ivk').on(Op.eq('civ.ingress_variable_key', raw('ivk.id')))
        )
        .orderBy('ivk.name')
        .limit(limit)
        .offset(offset);

      const countBuilder = sqb
        .select(raw('count(*) count'))
        .from('active_cluster_ingress_variable__vw civ')
        .join(
          innerJoin('active_cluster__vw c').on(Op.eq('civ.cluster', raw('c.id'))),
          innerJoin('active_ingress_variable_key__vw ivk').on(Op.eq('civ.ingress_variable_key', raw('ivk.id')))
        );

      if(criteria.cluster) {
        [builder, countBuilder].forEach(builder => builder.where(Op.eq('c.id', criteria.cluster)));
      }

      return db.withTransaction(async connection => {
        const [result, countResult] = await Promise.all([
          connection.query(db.serialize(builder, {}).sql),
          connection.query(db.serialize(countBuilder, {}).sql)
        ]);

        const items = result.rows.map(toClusterIngressVariable);
        const count = parseInt(countResult.rows[0].count, 10);
        return { limit, offset, count, items };
      });
    }

    function findClusterIngressClasses(criteria = {}, limit = 50, offset = 0) {
      const builder = sqb
        .select('cic.id', 'cic.created_by', 'a.display_name', 'cic.created_on', 'c.id cluster_id', 'c.name cluster_name', 'cic.ingress_class', 'ic.name ingress_class_name')
        .from('active_cluster_ingress_class__vw cic')
        .join(
          innerJoin('account a').on(Op.eq('cic.created_by', raw('a.id'))),
          innerJoin('active_cluster__vw c').on(Op.eq('cic.cluster', raw('c.id'))),
          innerJoin('active_ingress_class__vw ic').on(Op.eq('cic.ingress_class', raw('ic.id')))
        )
        .orderBy('ic.name')
        .limit(limit)
        .offset(offset);

      const countBuilder = sqb
        .select(raw('count(*) count'))
        .from('active_cluster_ingress_class__vw cic')
        .join(
          innerJoin('active_cluster__vw c').on(Op.eq('cic.cluster', raw('c.id'))),
          innerJoin('active_ingress_class__vw ic').on(Op.eq('cic.ingress_class', raw('ic.id')))
        );

      if(criteria.cluster) {
        [builder, countBuilder].forEach(builder => builder.where(Op.eq('c.id', criteria.cluster)));
      }

      return db.withTransaction(async connection => {
        const [result, countResult] = await Promise.all([
          connection.query(db.serialize(builder, {}).sql),
          connection.query(db.serialize(countBuilder, {}).sql)
        ]);

        const items = result.rows.map(toClusterIngressClass);
        const count = parseInt(countResult.rows[0].count, 10);
        return { limit, offset, count, items };
      });
    }

    function saveIngressHostKey(name, meta) {
      return db.withTransaction(async connection => {
        const newId = uuid();

        const builder = sqb
          .insert('ingress_host_key', {
            id: newId,
            name,
            created_on: meta.date,
            created_by: meta.account.id,
          });

        await connection.query(db.serialize(builder, {}).sql);

        return newId;
      });
    }

    function saveIngressVariableKey(name, meta) {
      return db.withTransaction(async connection => {
        const newId = uuid();

        const builder = sqb
          .insert('ingress_variable_key', {
            id: newId,
            name,
            created_on: meta.date,
            created_by: meta.account.id,
          });

        await connection.query(db.serialize(builder, {}).sql);

        return newId;
      });
    }

    function saveIngressClass(name, meta) {
      return db.withTransaction(async connection => {
        const newId = uuid();

        const builder = sqb
          .insert('ingress_class', {
            id: newId,
            name,
            created_on: meta.date,
            created_by: meta.account.id,
          });

        await connection.query(db.serialize(builder, {}).sql);

        return newId;
      });
    }

    function saveClusterIngressHostValue(ingressHostKey, cluster, value, meta) {
      const newId = uuid();

      const builder = sqb
        .insert('cluster_ingress_host', {
            id: newId,
            ingress_host_key: ingressHostKey.id,
            cluster: cluster.id,
            value,
            created_on: meta.date,
            created_by: meta.account.id,
        });

      return db.withTransaction(async connection => {
        await connection.query(db.serialize(builder, {}).sql);

        return newId;
      });
    }

    function saveClusterIngressVariableValue (ingressVariableKey, cluster, value, meta) {
      const newId = uuid();

      const builder = sqb
        .insert('cluster_ingress_variable', {
            id: newId,
            ingress_variable_key: ingressVariableKey.id,
            cluster: cluster.id,
            value,
            created_on: meta.date,
            created_by: meta.account.id,
        });

      return db.withTransaction(async connection => {
        await connection.query(db.serialize(builder, {}).sql);

        return newId;
      });
    }

    function saveClusterIngressClass (ingressClass, cluster,  meta) {
      const newId = uuid();

      const builder = sqb
        .insert('cluster_ingress_class', {
            id: newId,
            ingress_class: ingressClass.id,
            cluster: cluster.id,
            created_on: meta.date,
            created_by: meta.account.id,
        });

      return db.withTransaction(async connection => {
        await connection.query(db.serialize(builder, {}).sql);

        return newId;
      });
    }

    function updateClusterIngressHostValue(clusterIngressHostValueId, value) {
      const builder = sqb
        .update('cluster_ingress_host', {
          value,
        })
        .where(Op.eq('id', clusterIngressHostValueId));

      return db.withTransaction(async connection => {
        await connection.query(db.serialize(builder, {}).sql);

        return _getClusterIngressHost(connection, clusterIngressHostValueId);
      });
    }

    function updateClusterIngressVariableValue (clusterIngressVariableValueId, value) {
      const builder = sqb
        .update('cluster_ingress_variable', {
          value,
        })
        .where(Op.eq('id', clusterIngressVariableValueId));

      return db.withTransaction(async connection => {
        await connection.query(db.serialize(builder, {}).sql);

        return _getClusterIngressVariable(connection, clusterIngressVariableValueId);
      });
    }

    function findIngressVersions(criteria = {}, limit = 50, offset = 0) {
      const builder = sqb
        .select('iv.id', 'iv.comment', 'iv.created_on', 'iv.created_by', 'a.display_name')
        .from('active_ingress_versions__vw iv')
        .join(
          innerJoin('account a').on(Op.eq('iv.created_by', raw('a.id'))),
          innerJoin('active_service__vw s').on(Op.eq('iv.service', raw('s.id')))
        )
        .orderBy('ic.name')
        .limit(limit)
        .offset(offset);

      const countBuilder = sqb
        .select(raw('count(*) count'))
        .from('active_ingress_versions__vw iv')
        .join(
          innerJoin('active_service__vw s').on(Op.eq('iv.service', raw('s.id')))
        );

      if(criteria.service) {
        [builder, countBuilder].forEach(builder => builder.where(Op.eq('s.id', criteria.service.id)));
      }

      return db.withTransaction(async connection => {
        const [result, countResult] = await Promise.all([
          connection.query(db.serialize(builder, {}).sql),
          connection.query(db.serialize(countBuilder, {}).sql)
        ]);

        const items = result.rows.map((row) => toIngressVersion(row, { service: criteria.service }));
        const count = parseInt(countResult.rows[0].count, 10);
        return { limit, offset, count, items };
      });
    }

    function getIngressVersion(id) {
      return db.withTransaction(connection => {
        return _getIngressVersion(connection, id);
      });
    }

    async function _getIngressVersion(connection, id) {
      const builder = sqb
        .select('iv.id', 'iv.comment', 'iv.created_on', 'iv.created_by', 'a.display_name')
        .from('active_ingress_versions__vw iv')
        .join(
          innerJoin('account a').on(Op.eq('iv.created_by', raw('a.id'))),
          innerJoin('active_service__vw s').on(Op.eq('iv.service', raw('s.id')))
        )
        .where(Op.eq('iv.id', id));

      const result = await connection.query(db.serialize(builder, {}).sql);

      return result.rowCount ? toIngressVersion(result.rows[0]) : undefined;
    }

    function findIngressEntries(criteria = {}, limit = 50, offset = 0) {
      const builder = sqb
        .select('ie.id', 'ie.name', 'ie.ingress_class', 'ic.name ingress_class_name')
        .from('ingress_entry ie')
        .join(
          innerJoin('active_ingress_class__vw ic').on(Op.eq('ie.ingress_class', raw('ic.id')))
        )
        .orderBy('ie.name')
        .limit(limit)
        .offset(offset);

      const countBuilder = sqb
        .select(raw('count(*) count'))
        .from('ingress_entry ie')
        .join(
          innerJoin('active_ingress_class__vw ic').on(Op.eq('ie.ingress_class', raw('ic.id')))
        );

      if(criteria.ingressVersion) {
        [builder, countBuilder].forEach(builder => builder.where(Op.eq('iv.id', criteria.ingressVersion.id)));
      }

      return db.withTransaction(async connection => {
        const [result, countResult] = await Promise.all([
          connection.query(db.serialize(builder, {}).sql),
          connection.query(db.serialize(countBuilder, {}).sql)
        ]);

        const items = result.rows.map((row) => toIngressEntry(row));
        const count = parseInt(countResult.rows[0].count, 10);
        return { limit, offset, count, items };
      });
    }

    function getIngressEntry(id) {
      return db.withTransaction(connection => {
        return _getIngressEntry(connection, id);
      });
    }

    async function _getIngressEntry(connection, id) {
      const builder = sqb
        .select('ie.id', 'ie.name', 'ie.ingress_class', 'ic.name ingress_class_name')
        .from('ingress_entry ie')
        .join(
          innerJoin('active_ingress_class__vw ic').on(Op.eq('ie.ingress_class', raw('ic.id')))
        )
        .where(Op.eq('ie.id', id));

      const annotationBuilder = sqb
        .select('iea.name', 'iea.value')
        .from('ingress_entry_annotation iea')
        .where(Op.eq('iea.ingress_entry', id));

      const result = await connection.query(db.serialize(builder, {}).sql);
      const annotationResult = await connection.query(db.serialize(annotationBuilder, {}).sql);

      return result.rowCount ? toIngressVersion(result.rows[0], annotationResult.rows) : undefined;
    }

    function findIngressRules(criteria = {}, limit = 50, offset = 0) {
      const builder = sqb
        .select('ier.id', 'ier.path', 'ier.port', 'ier.custom_host', 'ier.ingress_host_key', 'ihk.name ingress_host_key_name')
        .from('ingress_entry_rule ier')
        .join(
          innerJoin('active_ingress_host_key__vw ihk').on(Op.eq('ier.ingress_host_key', raw('ihk.id')))
        )
        .orderBy('ier.path')
        .limit(limit)
        .offset(offset);

      const countBuilder = sqb
        .select(raw('count(*) count'))
        .from('ingress_entry_rule ier')
        .join(
          innerJoin('active_ingress_host_key__vw ihk').on(Op.eq('ier.ingress_host_key', raw('ihk.id')))
        );

      if(criteria.ingressEntry) {
        [builder, countBuilder].forEach(builder => builder.where(Op.eq('ier.ingress_entry', criteria.ingressEntry.id)));
      }

      return db.withTransaction(async connection => {
        const [result, countResult] = await Promise.all([
          connection.query(db.serialize(builder, {}).sql),
          connection.query(db.serialize(countBuilder, {}).sql)
        ]);

        const items = result.rows.map((row) => toIngressEntryRule(row));
        const count = parseInt(countResult.rows[0].count, 10);
        return { limit, offset, count, items };
      });
    }

    function getIngressEntryRule(id) {
      return db.withTransaction(connection => {
        return _getIngressEntryRule(connection, id);
      });
    }

    async function _getIngressEntryRule(connection, id) {
      const builder = sqb
        .select('ier.id', 'ier.path', 'ier.port', 'ier.custom_host', 'ier.ingress_host_key', 'ihk.name ingress_host_key_name')
        .from('ingress_entry_rule ier')
        .join(
          innerJoin('active_ingress_host_key__vw ihk').on(Op.eq('ier.ingress_host_key', raw('ihk.id')))
        )
        .where(Op.eq('ier.id', id));

      const result = await connection.query(db.serialize(builder, {}).sql);

      return result.rowCount ? toIngressVersion(result.rows[0]) : undefined;
    }

    async function _saveIngressVersion(connection, serviceId, comment, meta) {
      const newId = uuid();

      const builder = sqb
        .insert('ingress_version', {
          id: newId,
          service: serviceId,
          comment,
          created_on: meta.date,
          created_by: meta.account.id,
        });

      await connection.query(db.serialize(builder, {}).sql);

      return newId;
    }

    async function _saveIngressEntry(connection, ingressVersionId, name, ingressClassId) {
      const newId = uuid();

      const builder = sqb
        .insert('ingress_entry', {
          id: newId,
          ingress_version: ingressVersionId,
          ingress_class: ingressClassId,
          name,
        });

      await connection.query(db.serialize(builder, {}).sql);

      return newId;
    }

    async function _saveIngressEntryAnnotation(connection, ingressEntryId, name, value) {
      const builder = sqb
        .insert('ingress_entry_annotation', {
          ingress_entry: ingressEntryId,
          name,
          value,
        });

      await connection.query(db.serialize(builder, {}).sql);

      return;
    }

    async function _saveIngressRule(connection, ingressEntryId, path, port, customHost, ingressHostKeyId) {
      const newId = uuid();

      const builder = sqb
        .insert('ingress_entry_rule', {
          id: newId,
          ingress_entry: ingressEntryId,
          path,
          port,
          customHost,
          ingress_host_key: ingressHostKeyId,
        });

      await connection.query(db.serialize(builder, {}).sql);

      return newId;
    }

    function saveIngressVersion(service, versionData, meta) {
      return db.withTransaction(async connection => {
        const ingressVersionId = await _saveIngressVersion(connection, service.id, versionData.comment, meta);

        for (const entryData of versionData.entries) {
          const ingressEntryId = await _saveIngressEntry(connection, ingressVersionId, entryData.name, entryData.ingressClass);

          for (const annotationData of entryData.annotations) {
            await _saveIngressEntryAnnotation(connection, ingressEntryId, annotationData.name, annotationData.value);
          }

          for (const ruleData of entryData.rules) {
            await _saveIngressRule(connection, ingressEntryId, ruleData.path, ruleData.port, ruleData.customHost, ruleData.ingressHostKey);
          }
        }

        return ingressVersionId;
      });
    }

    function toIngressHostKey(row) {
      return new IngressHostKey({
        id: row.id,
        name: row.name,
        createdOn: row.created_on,
        createdBy: new Account({
          id: row.created_by,
          displayName: row.display_name,
        }),
      });
    }

    function toIngressVariableKey(row) {
      return new IngressVariableKey({
        id: row.id,
        name: row.name,
        createdOn: row.created_on,
        createdBy: new Account({
          id: row.created_by,
          displayName: row.display_name,
        }),
      });
    }

    function toIngressClass(row) {
      return new IngressClass({
        id: row.id,
        name: row.name,
        createdOn: row.created_on,
        createdBy: new Account({
          id: row.created_by,
          displayName: row.display_name,
        }),
      });
    }

    function toClusterIngressHost(row) {
      return new ClusterIngressHost({
        id: row.id,
        value: row.value,
        createdOn: row.created_on,
        createdBy: new Account({
          id: row.created_by,
          displayName: row.display_name,
        }),
        cluster: new Cluster({
          id: row.cluster_id,
          name: row.cluster_name,
        }),
        ingressHostKey: new IngressHostKey({
          id: row.ingress_host_key,
          name: row.ingress_host_key_name,
        }),
      });
    }

    function toClusterIngressVariable(row) {
      return new ClusterIngressVariable({
        id: row.id,
        value: row.value,
        createdOn: row.created_on,
        createdBy: new Account({
          id: row.created_by,
          displayName: row.display_name,
        }),
        cluster: new Cluster({
          id: row.cluster_id,
          name: row.cluster_name,
        }),
        ingressVariableKey: new IngressVariableKey({
          id: row.ingress_variable_key,
          name: row.ingress_variable_key_name,
        }),
      });
    }

    function toClusterIngressClass(row) {
      return new ClusterIngressClass({
        id: row.id,
        createdOn: row.created_on,
        createdBy: new Account({
          id: row.created_by,
          displayName: row.display_name,
        }),
        cluster: new Cluster({
          id: row.cluster_id,
          name: row.cluster_name,
        }),
        ingressClass: new IngressClass({
          id: row.ingress_class,
          name: row.ingress_class_name,
        }),
      });
    }

    function toIngressVersion(row, { service }) {
      return new IngressVersion({
        id: row.id,
        createdOn: row.created_on,
        createdBy: new Account({
          id: row.created_by,
          displayName: row.display_name,
        }),
        comment: row.comment,
        service,
      });
    }

    function toIngressEntry(row, annotationRows) {
      const annotations = annotationRows ? annotationRows.map((row) => new IngressEntryAnnotation({
        name: row.name,
        value: row.value,
      })) : undefined;

      return new IngressEntry({
        id: row.id,
        name: row.name,
        ingressClass: new IngressClass({
          id: row.ingress_class,
          name: row.ingress_class_name,
        }),
        annotations,
      });
    }

    function toIngressEntryRule(row) {
      return new IngressEntryRule({
        id: row.id,
        path: row.path,
        port: row.port,
        customHost: row.custom_host,
        ingressHostKey: new IngressHostKey({
          id: row.ingress_host_key,
          name: row.ingress_host_key_name,
        }),
      });
    }

    cb(null, {
      getIngressHostKey,
      getIngressVariableKey,
      getIngressClass,
      getClusterIngressHost,
      getClusterIngressVariable,
      getClusterIngressClass,
      getIngressVersion,
      getIngressEntry,
      getIngressEntryRule,
      findIngressHostKeys,
      findIngressVariableKeys,
      findIngressClasses,
      findClusterIngressHosts,
      findClusterIngressVariables,
      findClusterIngressClasses,
      findIngressVersions,
      findIngressEntries,
      findIngressRules,
      saveIngressHostKey,
      saveIngressVariableKey,
      saveIngressClass,
      saveClusterIngressHostValue,
      saveClusterIngressVariableValue,
      saveClusterIngressClass,
      saveIngressVersion,
      updateClusterIngressHostValue,
      updateClusterIngressVariableValue,
    });
  }

  return {

    start,

  };

}
