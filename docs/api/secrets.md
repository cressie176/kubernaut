## Secrets

#### GET /api/secrets/search
Search all secrets for a string (admin).

#### GET /api/secrets/:id
Get a secret version (only metadata).

#### GET /api/secrets/:id/with-data
Get a secret version with secret data.

#### GET /api/secrets/:registry/:service/:namespace
List secrets for a service in a registry for a namespace.
Supports pagination.

#### GET /api/secrets/:registry/:service/:version/:namespace/latest-deployed
Get the latest deployed secret version for a service to a namespace.

#### POST /api/secrets/:registry/:service/:namespace
Create a secret version for a service for a namespace.
