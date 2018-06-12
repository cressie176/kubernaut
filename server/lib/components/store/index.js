import systemic from 'systemic';
import migrator from './migrator';
import postgres from 'systemic-pg';
import db from './db';
import registry from './registry';
import cluster from './cluster';
import namespace from './namespace';
import account from './account';
import release from './release';
import deployment from './deployment';
import store from './store';

export default () => systemic({ name: 'stores/postgres' })
  .add('migrator', migrator()).dependsOn({ component: 'config', source: 'postgres', destination: 'config' }, )
  .add('postgres', postgres()).dependsOn('config', 'logger', 'migrator')
  .add('db', db()).dependsOn('config', 'logger', 'postgres')
  .add('store.registry', registry()).dependsOn('config', 'logger', 'db')
  .add('store.cluster', cluster()).dependsOn('config', 'logger', 'db')
  .add('store.namespace', namespace()).dependsOn('config', 'logger', 'db')
  .add('store.account', account()).dependsOn('config', 'logger', 'db')
  .add('store.release', release()).dependsOn('config', 'logger', 'db')
  .add('store.deployment', deployment()).dependsOn('config', 'logger', 'db')
  .add('store', store()).dependsOn(
    'config', 'logger', 'db',
    { component: 'store.registry', destination: 'registry' },
    { component: 'store.cluster', destination: 'cluster' },
    { component: 'store.namespace', destination: 'namespace' },
    { component: 'store.account', destination: 'account' },
    { component: 'store.release', destination: 'release' },
    { component: 'store.deployment', destination: 'deployment' },
  );