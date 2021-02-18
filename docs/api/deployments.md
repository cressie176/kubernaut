## Deployments

#### GET /api/deployments
Lists deployments.
Supports filters: `registry`, `service`, `version`, `namespace`, `cluster`, `createdBy`.
Supports pagination.

#### GET /api/deployments/latest-by-namespace/:registry/:service
Returns the latest deployment information per namespace. This is also decorated with pod restarts count.

#### GET /api/deployments/namespaces-history-per-release
Returns a restricted response regarding namespaces a release has been deployed to.
Supports filters: `release`.

#### GET /api/deployments/:id
Get a deployment by id.

#### POST /api/deployments
Create a deployment.

#### POST /api/deployments/:id/note
Set a deployments note.

#### DELETE /api/deployments/:id
Delete a deployment.
