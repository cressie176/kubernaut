## Releases

#### GET /api/releases
List releases.
Supports filters: `service`, `version`, `registry`, `createdBy`
Supports pagination.

#### GET /api/releases/:id
Get a release.

#### POST /api/releases
Create a release (and potentially a service if not existing beforehand)

#### DELETE /api/releases/:id
Delete a release.
