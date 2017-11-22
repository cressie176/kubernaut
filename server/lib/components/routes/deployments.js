import bodyParser from 'body-parser';
import hogan from 'hogan.js';
import { safeLoadAll as yaml2json, } from 'js-yaml';

export default function(options = {}) {

  function start({ pkg, app, prepper, store, kubernetes, }, cb) {

    app.get('/api/deployments', async (req, res, next) => {
      const limit = req.query.limit ? parseInt(req.query.limit, 10) : undefined;
      const offset = req.query.offset ? parseInt(req.query.offset, 10) : undefined;
      try {
        const deployments = await store.listDeployments(limit, offset);
        res.json(deployments);
      } catch (err) {
        next(err);
      }
    });

    app.get('/api/deployments/:id', async (req, res, next) => {
      try {
        const deployment = await store.getDeployment(req.params.id);
        return deployment ? res.json(deployment) : next();
      } catch (err) {
        next(err);
      }
    });

    app.post('/api/deployments', bodyParser.json(), async (req, res, next) => {

      if (!req.body.context) return res.status(400).json({ message: 'context is required', });
      if (!req.body.service) return res.status(400).json({ message: 'service is required', });
      if (!req.body.version) return res.status(400).json({ message: 'version is required', });

      try {
        const release = await store.findRelease({ name: req.body.service, version: req.body.version, });
        if (!release) return res.status(400).json({ message: `Release ${req.body.service}/${req.body.version} was not found`, });

        const contextOk = await kubernetes.checkContext(req.body.context, res.locals.logger);
        if (!contextOk) return res.status(400).json({ message: `Context ${req.body.context} was not found`, });

        let manifest;
        try {
          manifest = getManifest(release);
        } catch (err) {
          return next(err);
        }

        const data = {
          context: req.body.context,
          manifest,
          release,
        };
        const meta = {
          date: new Date(),
          user: 'anonymous',
        };

        const deployment = await store.saveDeployment(data, meta);
        await kubernetes.apply(deployment.context, deployment.manifest.yaml, res.locals.logger);

        if (req.query.wait === 'true') {
          res.redirect(303, `/api/deployments/${deployment.id}/status`);
        } else {
          res.status(202).json({ id: deployment.id, });
        }
      } catch (err) {
        next(err);
      }
    });

    app.get('/api/deployments/:id/status', async (req, res, next) => {
      try {
        const deployment = await store.getDeployment(req.params.id);
        if (!deployment) return next();

        const contextOk = await kubernetes.checkContext(deployment.context, res.locals.logger);
        if (!contextOk) return res.status(500).json({ message: `Context ${deployment.context} was not found`, });

        const deploymentOk = await kubernetes.checkDeployment(deployment.context, deployment.release.service.name, res.locals.logger);
        if (!deploymentOk) return res.status(500).json({ message: `Deployment ${deployment.release.service.name} was not found`, });

        const ok = await kubernetes.rolloutStatus(deployment.context, deployment.release.service.name, res.locals.logger);

        return ok ? res.status(200).json({
          id: deployment.id,
          status: 'success',
        }) : res.status(502).json({
          id: deployment.id,
          status: 'failed',
        });
      } catch (err) {
        next(err);
      }
    });

    app.delete('/api/deployments/:id', async (req, res, next) => {
      try {
        await store.deleteDeployment(req.params.id, { date: new Date(), user: 'anonymous', });
        res.status(204).send();
      } catch (err) {
        next(err);
      }
    });

    function getManifest(release) {
      const yaml = hogan.compile(release.template.source.yaml).render(release.attributes);
      const json = yaml2json(yaml);
      return { yaml, json, };
    }

    cb();
  }

  return {
    start,
  };
}
