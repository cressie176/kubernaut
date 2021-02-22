# Kubernaut
> Definition of kubernaut - an expert or habitual user of the Kubernetes., a person who uses computer technology to experience containerisation.

## What
Provide an interface that makes for easy management of kubernetes resources and orchestration from an application based perspective.

To build a Kubernetes continuous delivery pipeline through discovery. See Kubernaut in action [here](http://kubernaut.tescloud.com). Want to help? Assign yourself an issue from our [backlog](https://github.com/tes/kubernaut/issues#boards?repos=105863649)

## Prerequisites
* Node.js version 14 or higher
* Docker
* Basic understanding of [Kubernetes Concepts](https://kubernetes.io/docs/concepts/)
* Bosco (or have postgres running locally in a manner the configuration will connect to).

## Getting Started
Note: requires a one time build of the client to enable serving of login assets.

```
npm ci
npm run install-client
npm run build-client
bosco run -d
npm run start
```

After a short wait, this should open a browser displaying the kubernetes application with dummy local data created.


## Kubernaut Concepts
The two most important concepts in kubernaut are **releases** and **deployments**. A release is something you build, whereas a deployment is something you ship. A release is comprised of a versioned docker image, some attributes and a Kubernetes manifest file template. A deployment is comprised of a release, generated Kubernetes manifest file and a destination [Kubernetes namespace](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/).

### Release Workflow
<pre>
┌────────────────────┬──────────────────────────────┐
│                    │ Manifest Template (optional) │
│                    ├──────────────────────────────┤
│                    │ Dockerfile                   │
│    Hello World     ├──────────────────────────────┤
│                    │ index.js                     │
│                    ├──────────────────────────────┘
│                    │
└────────────────────┘
           │
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
           │
           ▼
┌────────────────────┐
│                    │
│                    │
│                    │ Docker image
│      Jenkins       │──────────────────────┐
│                    │                      │
├────────────────────┤                      │
│   Kubernaut CLI    │                      │
└────────────────────┘                      │
          │ Manifest template               │
          │ Release attributes              │
          │                                 │
          ▼                                 ▼
┌────────────────────┐           ┌────────────────────┐
│                    │           │                    │
│                    │           │                    │
│                    │           │                    │
│     Kubernaut      │           │  Docker Registry   │
│                    │           │                    │
│                    │           │                    │
│                    │           │                    │
└────────────────────┘           └────────────────────┘
</pre>

### Deployment Workflow
<pre>
┌────────────────────┐
│                    │
│                    │
│                    │
│       Jenkins      │
│                    │
├────────────────────┤
│   Kubernaut CLI    │
└────────────────────┘
           │ Release
           │ Namespace
           │
           ▼
┌────────────────────┐           ┌────────────────────┐
│                    │           │                    │
│                    │           │                    │
│                    │           │                    │
│     Kubernaut      │           │  Docker Registry   │
│                    │           │                    │
│                    │           │                    │
│                    │           │                    │
└────────────────────┘           └────────────────────┘
           │ Manifest                       │
           │ Namespace                      │
           │                                │
           ▼                                │
┌────────────────────┐                      │
│                    │                      │
│                    │                      │
│                    │  Docker image        │
│ Kubernetes Cluster │◀─────────────────────┘
│                    │
│                    │
│                    │
└────────────────────┘
</pre>
