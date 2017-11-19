import multer from 'multer';
import hogan from 'hogan.js';
import highwayhash from 'highwayhash';
import crypto from 'crypto';

const key = crypto.randomBytes(32);
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, });

export default function(options = {}) {

  function start({ pkg, app, prepper, store, kubernetes, }, cb) {

    app.get('/api/releases', async (req, res, next) => {
      const limit = req.query.limit ? parseInt(req.query.limit, 10) : undefined;
      const offset = req.query.offset ? parseInt(req.query.offset, 10) : undefined;
      try {
        const releases = await store.listReleases(limit, offset);
        res.json(releases);
      } catch (err) {
        next(err);
      }
    });

    app.get('/api/releases/:id', async (req, res, next) => {
      try {
        const release = await store.getRelease(req.params.id);
        return release ? res.json(release) : next();
      } catch (err) {
        next(err);
      }
    });

    app.post('/api/releases', upload.single('template'), async (req, res, next) => {

      const buffer = new Buffer(req.file.buffer);
      const source = buffer.toString();
      const checksum = highwayhash.asHexString(key, buffer);

      if (!req.body.service) return res.status(400).json({ message: 'service is required', });
      if (!req.body.version) return res.status(400).json({ message: 'version is required', });

      const data = {
        service: {
          name: req.body.service,
        },
        version: req.body.version,
        template: {
          source,
          checksum,
        },
        attributes: req.body,
      };
      const meta = {
        date: new Date(),
        user: 'anonymous',
      };

      try {
        const release = await store.saveRelease(data, meta);
        const yaml = hogan.compile(source).render(req.body);
        await kubernetes.apply('test', yaml, res.locals.logger);
        res.json({ id: release.id, });
      } catch(err) {
        next(err);
      }
    });

    app.delete('/api/releases/:id', async (req, res, next) => {
      try {
        await store.deleteRelease(req.params.id, { date: new Date(), user: 'anonymous', });
        res.status(204).send();
      } catch (err) {
        next(err);
      }
    });

    cb();
  }


  return {
    start,
  };
}
