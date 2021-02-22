## Namespaces

#### GET /api/namespaces
List namespaces.
Supports filters: `name`, `cluster`.
Supports pagination.

#### GET /api/namespaces/:id
Get a namespace.

#### POST /api/namespaces
Create a namespace.

#### POST /api/namespaces/:id
Update a namespace.

#### DELETE /api/namespaces/:id
Delete a namespace.

#### GET /api/namespaces/can-deploy-to-for/:serviceId
Get namespaces a service can deploy to.
