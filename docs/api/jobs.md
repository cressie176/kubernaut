## Jobs

#### GET /api/jobs
List jobs.
Supports filters: `name`, `namespace`, `cluster`.
Supports pagination.

#### POST /api/jobs
Create a new job.

#### GET /api/jobs/search/:jobName
Search for a job by name.

#### GET /api/jobs/:id
Get a job.

#### DELETE /api/jobs/:id
Delete a job.

#### POST /api/jobs/:id/stop
Remove cronjob configuration from kubernetes, preventing any further automated execution.

#### GET /api/jobs/:id/snapshot
Retrieve pod information including recent logs for a cronjob.

#### GET /api/jobs/:id/versions
List versions of a cronjobs configuration.
Supports pagination.

#### GET /api/jobs/version/:id
Get a specific version of configuration of a cronjob.

#### POST /api/jobs/:id/description
Set the description of a cronjob.

#### POST /api/jobs/:id/version
Create a version of configuration for a cronjob.

#### POST /api/jobs/preview-values
Render the supplied configuration values, largely for debugging purposes.

#### POST /api/jobs/:id/execute
Using the latest applied configuration (and failing that, the latest configuration), manually create a job in kubernetes based on this configuration. Unlike applying a configuration, this is a transient execution of the job that will occur immediately. Intended for testing processes when building configurations as well as any other reason for manual execution.

#### POST /api/jobs/version/:id/apply
Apply a version of configuration for a job to the kubernetes cluster.
