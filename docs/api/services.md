## Services

#### GET /api/services
List services.
Supports filters: `name`, `createdBy`, `registry`.
Supports pagination.

#### GET /api/services/:registry/:service
Get a service.

#### DELETE /api/services/:registry/:service
Delete a service.

#### GET /api/services-with-status-for-namespace/:namespaceId
List services and their status for ability to deploy to a specific namespace.
Supports pagination.

#### GET /api/services/:registry/:service/namespace-status
List namespaces a service can deploy to.
Supports pagination.

#### GET /api/services/:registry/:service/:namespaceId/snapshot
Retrieve pod information for a service in a namespace. Includes (but not limited to):
- pod events
- recent logs
- restarts

#### POST /api/service/:serviceId/enable-deployment/:namespaceId
Enable a service to be able to deploy to a namespace.

#### DELETE /api/service/:serviceId/disable-deployment/:namespaceId
Disable a service from being able to deploy to a namespace.

#### GET /api/service/:registry/:service/:namespace/attributes
Get attributes for a service for a namespace.

#### POST /api/service/:registry/:service/:namespace/attributes
Set attributes for a service for a namespace.

#### GET /api/services/with-no-team
List services not assigned to a team.
Supports pagination.
