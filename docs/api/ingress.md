## Ingress

#### GET /api/ingress/host-keys
List ingress host keys.
Supports pagination.

#### POST /api/ingress/host-keys
Create an ingress host key.

#### GET /api/ingress/variable-keys
List ingress variable keys.
Supports pagination.

#### POST /api/ingress/variable-keys
Create an ingress variable key.

#### GET /api/ingress/classes
List ingress classes.
Supports pagination.

#### POST /api/ingress/classes
Create an ingress class.

#### GET /api/ingress/cluster/:id/hosts
List assigned host keys for a cluster.
Supports pagination.

#### POST /api/ingress/cluster/:id/hosts
Assign a host key to a cluster.

#### PUT /api/ingress/cluster/hosts/:id
Set the value for a host key assigned to a cluster.

#### GET /api/ingress/cluster/:id/variables
List assigned ingress variables for a cluster.
Supports pagination.

#### POST /api/ingress/cluster/:id/variables
Assign an ingress variable to a cluster.

#### PUT /api/ingress/cluster/variables/:id
Set the value for an ingress variable key assigned to a cluster.

#### GET /api/ingress/cluster/:id/classes
List ingress classes for a cluster.
Supports pagination.

#### POST /api/ingress/cluster/:id/classes
Assign an ingress class to a cluster.

#### GET /api/ingress/:serviceId/:version/:namespace/latest-deployed
Get the latest deployed ingress version for a service to a namespace.

#### GET /api/ingress/:serviceId/versions
List ingress versions for a service.
Supports pagination.

#### POST /api/ingress/:serviceId/versions
Create a new ingress version for a service.

#### GET /api/ingress/:serviceId/versions/:id
Get a version of ingress for a service.

#### GET /api/ingress/:serviceId/versions/:id/render/:clusterId
Renders a specific ingress version for a service given a cluster (hosts, variables and classes) to yaml. Largely for debugging purposes.

#### POST /api/ingress/validateCustomHost/:serviceId
Validates a custom host string for syntax & for available variables.
