## Clusters

#### GET /api/clusters
Lists clusters.
Supports pagination.

#### GET /api/clusters/:id
Get a cluster by id.

#### POST /api/clusters/:id
Create a cluster.

#### DELETE /api/clusters/:id
Delete a cluster.

#### POST /api/clusters/:id/export
Dump all namespaced data known to kubernaut for a cluster to yaml. This includes:
- The latest deployment yaml for a service. With associated:
  - secrets
  - ingress
- Cronjobs
