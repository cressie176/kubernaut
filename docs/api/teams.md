## Teams

#### GET /api/teams
Lists teams.
Supports filters: `name`, `createdBy`.
Supports pagination.

#### GET /api/teams/:id
Get a team by id.

#### GET /api/teams/:id/services
List services owned by a team.
Supports pagination.

#### GET /api/teams/:id/members
List accounts associated with a team.
Supports pagination.

#### POST /api/teams/:id/attributes
Update team attributes.

#### POST /api/teams/association/service
Associate a service with a team. (Clearing any prior association, assuming permissions allow)

#### DELETE /api/teams/association/service
Remove a service association from a team.

#### GET /api/teams/by-name/:name
Get a team by name.

#### GET /api/teams/for/:registry/:service
Get the team a service is associated with.

#### GET /api/teams/:id/namespaces
List associated roles for namespaces.

#### GET /api/teams/:id/registries
List associated roles for registries.

#### GET /api/teams/:id/system
List associated roles for system.

#### GET /api/teams/:id/teams
List associated roles for teams.

#### POST /api/teams/roles/system
Grant system roles to a team.

#### POST /api/teams/roles/global
Grant global roles to a team.

#### DELETE /api/teams/roles/system
Remove system roles from a team.

#### DELETE /api/teams/roles/global
Remove global roles from a team.

#### POST /api/teams/roles/registry
Grant roles for a registry to a team.

#### DELETE /api/teams/roles/registry
Remove roles for a registry from a team.

#### POST /api/teams/roles/namespace
Grant roles for a namespace to a team.

#### DELETE /api/teams/roles/namespace
Remove roles for a namespace from a team.

#### POST /api/teams/roles/team
Grant roles for a team to a team.

#### DELETE /api/teams/roles/team
Remove roles for a team from a team.
