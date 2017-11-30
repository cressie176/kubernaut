START TRANSACTION;

CREATE TABLE account_role (
  id TEXT PRIMARY KEY,
  account TEXT NOT NULL REFERENCES account,
  role TEXT NOT NULL REFERENCES role,
  namespace TEXT NOT NULL,
  created_on TIMESTAMP WITH TIME ZONE NOT NULL,
  created_by TEXT NOT NULL,
  deleted_on TIMESTAMP WITH TIME ZONE,
  deleted_by TEXT,
  CONSTRAINT account_role__deletion__chk CHECK ((deleted_on IS NULL AND deleted_by IS NULL) OR (deleted_on IS NOT NULL AND deleted_by IS NOT NULL))
);

CREATE UNIQUE INDEX account_role__account__role__uniq ON account_role (
  account DESC, role DESC
) WHERE deleted_on IS NULL;


CREATE INDEX account_role__account__idx ON account_role (
  account DESC
);

CREATE INDEX account_role__created_on__idx ON account_role (
  created_on DESC
);

COMMIT;
