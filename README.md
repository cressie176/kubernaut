# kube-hackday
See https://github.com/tes/infra/issues/1857 for background

## Goal
Discover a kubernetes deployment pipeline

##
<pre>
┌────────────────────┬──────────────────────────────┐
│                    │ Kubernetes Manifest Template │
│                    ├──────────────────────────────┤
│                    │      Dockerfile              │
│    Hello World     ├──────────────────────────────┤
│                    │       index.js               │
│                    ├──────────────────────────────┘
│                    │
└────────────────────┘
           │
           │
           ▼
┌────────────────────┐
│                    │
│                    │
│                    │
│       GitHub       │
│                    │
│                    │
│                    │                                                                                                                     
└────────────────────┘
           │
           │
           ▼
┌────────────────────┐
│                    │
│                    │
│                    │
│      Jenkins       │──────────────────────┐
│                    │                      │
│                    │                      │
│                    │                      │
├────────────────────┤                      │
│    Release Tool    │                      │
└────────────────────┘                      │
           │                                │
           │                                │
           │                                │
           │                                │
           ▼                                ▼
┌────────────────────┐           ┌────────────────────┐
│                    │           │                    │
│                    │           │                    │
│                    │           │                    │
│  Deployment Tool   │           │  Docker Registry   │
│                    │           │                    │
│                    │           │                    │
│                    │           │                    │
└────────────────────┘           └────────────────────┘
           │                                │
           │                                │
           │                                │
           ▼                                │
┌────────────────────┐                      │
│                    │                      │
│                    │                      │
│                    │                      │
│ Kubernets Cluster  │◀─────────────────────┘
│                    │
│                    │
│                    │
└────────────────────┘
</pre>

## MVP Tasks
### Hello World
Write a hello world application including

* a Dockerfile
* Kubernetes Manifest Template

The Kubernetes template should include a placeholder for the containers image. Use a templating tool which will work nicely with both yaml and json.

The application should respond with "Hello World" over an HTTP interface. For MVP don't worry about setting up a TES style electric project. Do the simplest thing, e.g. [http-server](https://www.npmjs.com/package/http-server) serving a static page running in an ```node:8-alpine``` container .

### Jenkins Job
Create a Jenkins job to build the docker image and publish it to the repository

### Release Tool
We need to get release data (e.g. the manifest file, image name etc) from Jenkins to the Deployment Tool. Write a node module for POSTing the following information to the Deployment tool

* The Kubernets Manifest File
* SCM Details
* Image Details

### Deployment Tool
The Deployment tool needs to 
* Update the kubernetes manfest with the docker image
* Deploy the Hello World application using the Kubernetes API. It should POST the whole manifest, not patch it.

### Kubernets Cluster
We need access to a kubernetes cluster and instructions for installing / configuring CLI tools

## Next Steps
1. Add a UI to the Deployment Tool, listing releases
1. Define default, environmental and service specific settings for things like instancess, resource limits etc
1. Support promotions
1. Release Tool authentication
1. UI authentication (github)
1. Team based permissions
1. Support yaml and json manifests
1. Define service criteria (e.g. single node process, logs to stdout, responds to SIGINT and SIGTERM, exposes liveness and readiness endpoints)
1. HipChat integration
1. Audit All Releases
