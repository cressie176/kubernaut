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

      return toAccount(account.rows[0]);
    }

    async function saveAccount(data, meta) {
      logger.debug(`Saving account: ${data.displayName}`);

      const result = await db.query(SQL.SAVE_ACCOUNT, [
        data.displayName, meta.date, meta.user,
      ]);

      const account = {
        ...data, id: result.rows[0].id, createdOn: meta.date, createdBy: meta.user,
      };

      logger.debug(`Saved account: ${account.displayName}/${account.id}`);

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
        meta.user,
      ]);
      logger.debug(`Deleted account id: ${id}`);
    }

    async function saveIdentity(id, data, meta) {
      logger.debug(`Saving identity: ${data.type}/${data.provider}/${data.name} for account ${id}`);

      const result = await db.query(SQL.SAVE_IDENTITY, [
        id, data.name, data.provider, data.type, meta.date, meta.user,
      ]);

      const identity = {
        ...data, id: result.rows[0].id, createdOn: meta.date, createdBy: meta.user,
      };

      logger.debug(`Saved identity: ${data.type}/${data.provider}/${data.name}/${result.rows[0].id} for account ${id}`);

      return identity;
    }

    async function deleteIdentity(id, meta) {
      logger.debug(`Deleting identity id: ${id}`);
      await db.query(SQL.DELETE_IDENTITY, [
        id,
        meta.date,
        meta.user,
      ]);
      logger.debug(`Deleted identity id: ${id}`);
    }

    async function grantRole(accountId, roleName, meta) {
      logger.debug(`Granting role: ${roleName} to account: ${accountId}`);

      try {
        const result = await db.query(SQL.SAVE_ACCOUNT_ROLE, [
          accountId, roleName, meta.date, meta.user,
        ]);

        const granted = {
          id: result.rows[0].id, account: accountId, name: roleName, createdOn: meta.date, createdBy: meta.user,
        };

        logger.debug(`Granted role: ${granted.name}/${granted.id} to account: ${accountId}`);

        return granted;
      } catch(err) {
        if (err.code === '23505') return logger.debug(`Ignoring duplicate role: ${roleName} for account: ${accountId}`);
        throw err;
      }
    }

    async function revokeRole(id, meta) {
      logger.debug(`Revoking role: ${id}`);

      await db.query(SQL.DELETE_ACCOUNT_ROLE, [
        id, meta.date, meta.user,
      ]);

      logger.debug(`Revoked role: ${id}`);
    }

    function toAccount(row, rolesAndPermissionsRows = []) {
      return {
        id: row.id,
        displayName: row.display_name,
        createdOn: row.created_on,
        createdBy: row.created_by,
        deletedOn: row.deleted_on,
        deletedBy: row.deleted_by,
        roles: toRolesAndPermissions(rolesAndPermissionsRows),
      };
    }

    function toRolesAndPermissions(rows) {
      return rows.reduce((roles, row) => {
        const entry = roles[row.role_name] || { name: row.role_name, permissions: [], };
        entry.permissions.push(row.permission_name);
        roles[row.role_name] = entry;
        return roles;
      }, {});
    }

    return cb(null, {
      saveAccount,
      getAccount,
      findAccount,
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