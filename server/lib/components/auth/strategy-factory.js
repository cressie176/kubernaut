import eachSeries from 'async/mapSeries';

export default function() {

  let components = [];

  function start(dependencies, cb) {

    const { config, app, passport, session } = dependencies;

    app.use(session);
    app.use(passport.initialize());
    app.use(passport.session());

    components = [];

    eachSeries(config, (strategyConfig, cb) => {
      const component = require(`./strategy-${strategyConfig.id}`)();
      component.start({ ...dependencies, config: strategyConfig }, (err, strategy) => {
        if (err) return cb(err);
        components.push(component);
        cb(null, strategy);
      });
    }, (err, strategies) => {
      if (err) return cb(err);

      app.post('/login', (req, res, next) => {
        if (req.isAuthenticated()) return next();
        passport.authenticate(getAuthenticationsMethods(strategies)['app'], (passportError, user, info) => {
          if (passportError) return next(passportError);
          if (!user) return res.redirect('/login');

          req.logIn(user, function(loginError) {
            if (loginError) { return next(loginError); }
            req.session.save((sessionError) => { // Thanks express session for your race conditions, forcing me to have to do this.
              if (sessionError) { return next(sessionError); }
              res.redirect(req.query.return || '/');
            });
          });
        })(req, res, next);
      });

      cb(null, middleware(getAuthenticationsMethods(strategies)));
    });

    function getAuthenticationsMethods(strategies) {
      return strategies.reduce((results, entry) => {
        if (entry.app) results.app.push(entry.name);
        if (entry.api) results.api.push(entry.name);
        return results;
      }, { app: [], api: [] });
    }

    function middleware(authenticationMethods) {
      return function(method) {
        return function(req, res, next) {
          if (req.isAuthenticated()) return next();
          if (method === 'app') return res.redirect('/login');
          if (req.headers.bearer || req.headers.authorization) return passport.authenticate(authenticationMethods[method])(req, res, next);

          return res.location('/login').sendStatus(401);
        };
      };
    }
  }

  function stop(cb) {
    eachSeries(components, (component, cb) => {
      return component.stop ? component.stop(cb) : cb();
    }, cb);
  }

  return {
    start,
    stop,
  };
}
