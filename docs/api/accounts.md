## Accounts

#### GET /api/account
Returns the current logged in user account.

#### GET /api/accounts
Lists accounts.
Supports filters: `name`, `createdBy`.
Supports pagination.

#### GET /api/accounts/:id
Get an account by id.

#### GET /api/accounts/with-no-membership
Lists accounts not belonging to any team.
Supports pagination.

#### GET /api/account/hasPermission/:permission
Test if the current logged in user has a permission.

#### GET /api/account/hasPermission/:permission/on/:type/:id
Test if the current logged in user has a permission against a specific resource of a type.
Types supported: `namespace`, `registry`, `team`.

#### GET /api/account/hasPermission/:permission/on-any/:type
Test if the current logged in user has a permission against a type of resource at all.
Types supported: `namespace`, `registry`, `team`.

#### GET /api/account/withPermission/:permission/on/:type
List resources of a type where a permission (provided) is granted.
Types supported: `namespace`, `registry`, `team`.

#### POST /api/accounts
Create an account.

#### DELETE /api/accounts/:id
Delete an account.

#### GET /api/accounts/:id/bearer
Retrieve a bearer token for an account for alternate authentication method.

#### POST /api/identities
Create an identity.

#### POST /api/roles/system
Grant system roles.

#### DELETE /api/roles/system
Remove system roles.

#### POST /api/roles/global
Grant global roles.

#### DELETE /api/roles/global
Remove global roles.

#### POST /api/roles/registry
Grant roles for a registry.

#### DELETE /api/roles/registry
Remove roles for a registry.

#### POST /api/roles/namespace
Grant roles for a namespace.

#### DELETE /api/roles/namespace
Remove roles for a namespace.

#### POST /api/roles/team
Grant roles for a team.

#### DELETE /api/roles/team
Remove roles for a team.

#### GET /api/accounts/:id/namespaces
List associated roles for namespaces.

#### GET /api/accounts/:id/registries
List associated roles for registries.

#### GET /api/accounts/:id/system
List associated roles for system.

#### GET /api/accounts/:id/teams
List associated roles for teams.

#### GET /api/accounts/:id/team-membership
List teams an account is a member of.

#### POST /api/roles/team-membership
Add an account to a team.

#### DELETE /api/roles/team-membership
Remove an account from a team.
