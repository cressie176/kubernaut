import System from 'systemic';
import admin from './admin';
import profiles from './profiles';
import releases from './releases';

module.exports = new System({ name: 'routes', })
  .add('routes.admin', admin()).dependsOn('config', 'logger', 'app', { component: 'middleware.prepper', destination: 'prepper', }, 'pkg')
  .add('routes.profiles', profiles()).dependsOn('config', 'logger', 'app', { component: 'middleware.prepper', destination: 'prepper', }, 'store')
  .add('routes.releases', releases()).dependsOn('config', 'logger', 'app', { component: 'middleware.prepper', destination: 'prepper', }, 'store', 'kubernetes')
  .add('routes').dependsOn('routes.admin', 'routes.profiles', 'routes.releases');
