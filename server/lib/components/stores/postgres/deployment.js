import SQL from './sql';

export default function(options) {

  function start({ config, logger, postgres: db, }, cb) {

    async function getDeployment(id) {
      logger.debug(`Getting deployment by id: ${id}`);

      const deploymentResult = await db.query(SQL.SELECT_DEPLOYMENT_BY_ID, [id,]);

      logger.debug(`Found ${deploymentResult.rowCount} deployments with id: ${id}`);

      return deploymentResult.rowCount ? toDeployment(deploymentResult.rows[0]) : undefined;
    }

    async function saveDeployment(data, meta) {
      logger.debug(`Saving deployment: ${data.release.service.name}/${data.release.version}/${data.context}`);

      const result = await db.query(SQL.SAVE_DEPLOYMENT, [
        data.release.id, data.context, data.manifest.yaml, JSON.stringify(data.manifest.json), meta.date, meta.account,
      ]);

      const deployment = {
        ...data, id: result.rows[0].id, createdOn: meta.date, createdBy: meta.account,
      };

      logger.debug(`Saved deployment: ${deployment.release.service.name}/${deployment.release.version}/${deployment.context}/${deployment.id}`);

      return deployment;
    }

    async function listDeployments(limit = 50, offset = 0) {

      logger.debug(`Listing up to ${limit} deployments starting from offset: ${offset}`);

      const result = await db.query(SQL.LIST_DEPLOYMENTS, [
        limit, offset,
      ]);

      logger.debug(`Found ${result.rowCount} deployments`);

      return result.rows.map(row => toDeployment(row));
    }

    async function deleteDeployment(id, meta) {
      logger.debug(`Deleting deployment id: ${id}`);
      await db.query(SQL.DELETE_DEPLOYMENT, [
        id, meta.date, meta.account,
      ]);
    }

    function toDeployment(row) {
      return {
        id: row.id,
        context: row.context,
        manifest: {
          yaml: row.manifest_yaml,
          json: row.manifest_json,
        },
        release: {
          id: row.release_id,
          service: {
            id: row.service_id,
            name: row.service_name,
            namespace: {
              id: row.namespace_id,
              name: row.namespace_name,
            },
          },
          version: row.release_version,
        },
        createdOn: row.created_on,
        createdBy: row.created_by,
        deletedOn: row.deleted_on,
        deletedBy: row.deleted_by,
      };
    }

    return cb(null, {
      saveDeployment,
      getDeployment,
      deleteDeployment,
      listDeployments,
    });
  }

  return {
    start,
  };
}
