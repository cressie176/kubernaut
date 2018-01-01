import SQL from './sql';

export default function(options = {}) {
  function start({ config, logger, postgres: db, }, cb) {

    async function getAccount(id) {
      logger.debug(`Getting account by id: ${id}`);

      return await Promise.all([
        db.query(SQL.SELECT_ACCOUNT_BY_ID, [id,]),
        db.query(SQL.LIST_ROLES_AND_PERMISSIONS_BY_ACCOUNT, [id,]),
      ]).then(([accountResult, rolesAndPermissionsResult, ]) => {
        logger.debug(`Found ${accountResult.rowCount} accounts with id: ${id}`);
        return accountResult.rowCount ? toAccount(accountResult.rows[0], rolesAndPermissionsResult.rows) : undefined;
      });
    }

    async function findAccount({ name, provider, type, }) {
      logger.debug(`Finding account by identity: ${type}/${name}/${provider}`);

      const account = await db.query(SQL.SELECT_ACCOUNT_BY_IDENTITY, [
        name, provider, type,
      ]);
      logger.debug(`Found ${account.rowCount} accounts with identity: ${type}/${name}/${provider}`);
      if (account.rowCount === 0) return;

      return await getAccount(account.rows[0].id);
    }

    async function saveAccount(data, meta) {
      return _saveAccount(db, data, meta);
    }

    async function _saveAccount(connection, data, meta) {
      logger.debug(`Saving account: ${data.displayName}`);

      const result = await connection.query(SQL.SAVE_ACCOUNT, [
        data.displayName, data.avatar, meta.date, meta.account,
      ]);

      const account = {
        ...data, id: result.rows[0].id, createdOn: meta.date, createdBy: meta.account,
      };

      logger.debug(`Saved account: ${account.displayName}/${account.id}`);

      return account;
    }

    async function ensureAccount(data, identity, meta) {

      logger.debug(`Ensuring account: ${data.displayName}`);

      const existing = await findAccount(identity);
      if (existing) return existing;

      const created = await withTransaction(async connection => {
        const saved = await _saveAccount(connection, data, meta);
        await _saveIdentity(connection, saved.id, identity, meta);
        if (await _countActiveGlobalAdminstrators(connection) === 0) {
          await _grantRole(connection, saved.id, 'admin', null, meta);
        }
        return saved;
      });

      const account = await getAccount(created.id);

      logger.debug(`Ensured account: ${account.displayName}/${account.id}`);

      return account;
    }

    async function listAccounts(limit = 50, offset = 0) {
      logger.debug(`Listing up to ${limit} accounts starting from offset: ${offset}`);

      const result = await db.query(SQL.LIST_ACCOUNTS, [
        limit, offset,
      ]);

      logger.debug(`Found ${result.rowCount} accounts`);

      return result.rows.map(row => toAccount(row));
    }

    async function deleteAccount(id, meta) {
      logger.debug(`Deleting account id: ${id}`);
      await db.query(SQL.DELETE_ACCOUNT, [
        id,
        meta.date,
        meta.account,
      ]);
      logger.debug(`Deleted account id: ${id}`);
    }

    async function saveIdentity(id, data, meta) {
      return _saveIdentity(db, id, data, meta);
    }

    async function _saveIdentity(connection, id, data, meta) {
      logger.debug(`Saving identity: ${data.type}/${data.provider}/${data.name} for account ${id}`);

      const result = await connection.query(SQL.SAVE_IDENTITY, [
        id, data.name, data.provider, data.type, meta.date, meta.account,
      ]);

      const identity = {
        ...data, id: result.rows[0].id, createdOn: meta.date, createdBy: meta.account,
      };

      logger.debug(`Saved identity: ${data.type}/${data.provider}/${data.name}/${result.rows[0].id} for account ${id}`);

      return identity;
    }

    async function deleteIdentity(id, meta) {
      logger.debug(`Deleting identity id: ${id}`);
      await db.query(SQL.DELETE_IDENTITY, [
        id,
        meta.date,
        meta.account,
      ]);
      logger.debug(`Deleted identity id: ${id}`);
    }

    async function grantRole(accountId, roleName, namespaceName, meta) {
      return withTransaction(async connection => {
        return _grantRole(connection, accountId, roleName, namespaceName, meta);
      });
    }

    async function _grantRole(connection, accountId, roleName, namespaceName, meta) {
      logger.debug(`Granting role: ${roleName} on namespace: ${namespaceName} to account: ${accountId}`);

      return await Promise.all([
        connection.query(SQL.SELECT_ACCOUNT_BY_ID, [ accountId, ]),
        connection.query(SQL.SELECT_ROLE_BY_NAME, [ roleName, ]),
        connection.query(SQL.SELECT_NAMESPACE_BY_NAME, [ namespaceName, ]),
      ]).then(([ accountResult, roleResult, namespaceResult, ]) => {
        return {
          accountId: getAccountId(accountResult, accountId),
          roleId: getRoleId(roleResult, roleName),
          namespaceId: getNamespaceId(namespaceResult, namespaceName),
        };
      }).then(async ({ accountId, roleId, namespaceId, }) => {
        const result = await connection.query(SQL.ENSURE_ACCOUNT_ROLE, [
          accountId, roleId, namespaceId, meta.date, meta.account,
        ]);
        const granted = {
          id: result.rows[0].id, account: accountId, name: roleName, createdOn: meta.date, createdBy: meta.account,
        };

        logger.debug(`Granted role: ${granted.name}/${granted.id} on namespace: ${namespaceName} to account: ${accountId}`);

        return granted;
      });
    }

    function getAccountId(result, accountId) {
      const id = result.rowCount ? result.rows[0].id : null;
      if (!id) throw new Error(`Invalid accountId: ${accountId}`);
      return id;
    }

    function getRoleId(result, name) {
      const id = result.rowCount ? result.rows[0].id : null;
      if (!id) throw new Error(`Invalid role: ${name}`);
      return id;
    }

    function getNamespaceId(result, name) {
      const id = result.rowCount ? result.rows[0].id : null;
      if (!id && name) throw new Error(`Invalid namespace: ${name}`);
      return id;
    }

    async function revokeRole(id, meta) {
      logger.debug(`Revoking role: ${id}`);

      await db.query(SQL.DELETE_ACCOUNT_ROLE, [
        id, meta.date, meta.account,
      ]);

      logger.debug(`Revoked role: ${id}`);
    }

    async function _countActiveGlobalAdminstrators(connection) {
      logger.debug('Counting active global administrators');

      const result = await connection.query(SQL.COUNT_ACTIVE_GLOBAL_ADMINISTRATORS);
      const count = parseInt(result.rows[0].active_global_administrators, 10);
      logger.debug(`Found ${count} active global administrator accounts`);

      return count;
    }

    function toAccount(row, rolesAndPermissionsRows = []) {
      const roles = toRolesAndPermissions(rolesAndPermissionsRows);
      return {
        id: row.id,
        displayName: row.display_name,
        avatar: row.avatar,
        createdOn: row.created_on,
        createdBy: row.created_by,
        deletedOn: row.deleted_on,
        deletedBy: row.deleted_by,
        roles,
        hasPermission: function(namespace, permission) {
          return Object.keys(roles).reduce((permissions, name) => {
            if (!roles[name].namespaces.includes('*') || !roles[name].namespaces.includes(namespace)) return permissions;
            return permissions.concat(roles[name].permissions);
          }, []).includes(permission);
        },
        permittedNamespaces: function(permission) {
          return Object.keys(roles).reduce((namespaces, name) => {
            if (!roles[name].permissions.includes(permission)) return namespaces;
            return namespaces.concat(roles[name].namespaces);
          }, []);
        },
      };
    }

    function toRolesAndPermissions(rows) {
      return rows.reduce((roles, row) => {
        const entry = roles[row.role_name] || { name: row.role_name, permissions: [], namespaces: [], };
        entry.permissions.push(row.permission_name);
        entry.namespaces.push(row.namespace_name || '*');
        roles[row.role_name] = entry;
        return roles;
      }, {});
    }

    async function withTransaction(operations) {
      logger.debug(`Retrieving db client from the pool`);

      const connection = await db.connect();
      try {
        await connection.query('BEGIN');
        const result = await operations(connection);
        await connection.query('COMMIT');
        return result;
      } catch (err) {
        await connection.query('ROLLBACK');
        throw err;
      } finally {
        logger.debug(`Returning db client to the pool`);
        connection.release();
      }
    }


    return cb(null, {
      getAccount,
      findAccount,
      saveAccount,
      ensureAccount,
      listAccounts,
      deleteAccount,
      saveIdentity,
      deleteIdentity,
      grantRole,
      revokeRole,
    });
  }

  return {
    start,
  };
}
