import { v4 as uuid, } from 'uuid';
import Deployment from '../../../domain/Deployment';
import DeploymentLogEntry from '../../../domain/DeploymentLogEntry';


export default function(options = {}) {
  function start({ tables, releases, }, cb) {

    const { deployments, deploymentLogEntries, } = tables;
    let deploymentLogSequence = 0;

    function _getDeployment(id) {
      return deployments.find(d =>
        d.id === id &&
        !d.deletedOn &&
        !d.release.deletedOn &&
        !d.release.service.deletedOn &&
        !d.release.service.namespace.deletedOn);
    }

    function _listDeploymentLogEntries(id) {
      return deploymentLogEntries.filter(e =>
        e.deployment.id === id
      ).sort(byLeastRecent);
    }

    async function getDeployment(id) {
      const deployment = _getDeployment(id);
      const log = _listDeploymentLogEntries(id);
      return deployment ? new Deployment({ ...deployment, log, }) : undefined;
    }

    async function saveDeployment(deployment, meta) {
      reportMissingMetadata(meta);

      const release = await releases.getRelease(deployment.release.id);
      if (!release) throw Object.assign(new Error('Missing Release'), { code: '23502', });

      return append(deployments, new Deployment({
        ...deployment, release, id: uuid(), createdOn: meta.date, createdBy: meta.account,
      }));
    }

    async function saveDeploymentLogEntry(logEntry) {
      return append(deploymentLogEntries, new DeploymentLogEntry({
        ...logEntry, id: uuid(), sequence: deploymentLogSequence++,
      }));
    }

    async function deleteDeployment(id, meta) {
      reportMissingMetadata(meta);

      const deployment = _getDeployment(id);
      if (deployment) {
        deployment.deletedOn = meta.date;
        deployment.deletedBy = meta.account;
      }
    }

    async function listDeployments(limit = 50, offset = 0) {
      const active = deployments.filter(byActive).sort(byMostRecent).map(toSlimDeployment);
      const count = active.length;
      const items = active.slice(offset, offset + limit);
      return { limit, offset, count, items, };
    }

    function reportMissingMetadata(meta) {
      if (!meta.date || !meta.account) throw Object.assign(new Error('Missing Metadata'), { code: '23502', });
    }

    function byActive(d) {
      return !d.deletedOn &&
             !d.release.deletedOn &&
             !d.release.service.deletedOn &&
             !d.release.service.namespace.deletedOn;
    }

    function getTimeForSort(date) {
      return date ? date.getTime() : 0;
    }

    function byMostRecent(a, b) {
      return getTimeForSort(b.deletedOn) - getTimeForSort(a.deletedOn) ||
             getTimeForSort(b.createdOn) - getTimeForSort(a.createdOn) ||
             b.id.localeCompare(a.id);
    }

    function byLeastRecent(a, b) {
      return getTimeForSort(a.writtenOn) - getTimeForSort(b.writtenOn) ||
             a.sequence - b.sequence;
    }

    function toSlimDeployment(deployment) {
      const release = { ...deployment.release, template: undefined, attribtes: {}, };
      return { ...deployment, release, };
    }

    function append(collection, item) {
      collection.push(item);
      return item;
    }

    return cb(null, {
      saveDeployment,
      saveDeploymentLogEntry,
      getDeployment,
      listDeployments,
      deleteDeployment,
    });
  }

  return {
    start,
  };
}
