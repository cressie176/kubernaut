## Index

This project was started with a basis of no comments, that the code should largely speak for itself. However - that doesn't mean some light documentation around the expectations of a few API's and where to find some key things won't help future contribution.

- [API](api/readme.md)
- [Authorisation notes](Auth model.md)
  - [Various auth related sql helpers](../server/lib/components/store/authz.js)
- [Domain objects](../server/lib/domain)
- [Database migrations](../server/lib/components/store/migrations)
- [Kubernetes API interface](../server/lib/components/kubernetes/kubernetes-cli.js)

#### The Server
Kubernaut uses dependency injection called [systemic](https://www.npmjs.com/package/systemic) to organise code. It's the spiritual successor to [electrician](https://www.npmjs.com/package/electrician). Systemic systems are started by a [runner](../server/index.js) which handles interupts and uncaught exceptions. Server side components and their dependencies are declared [here](../server/lib/components).

#### The Client
The client is a React/Redux app. Making use of (but not limited to): react-scripts, redux-form, bootstrap, ace editor (wrapped for react), reactstrap, react-router (made available to redux), sagas.

The client app has a the aim to make anything clicked naturally work with back/forward in the browser as this provides a very natural experience. This has driven a few design decisions as to how to structure page code, but ultimately has yielded very repeatable interactions that make for simple testing.
