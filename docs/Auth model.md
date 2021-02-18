## How authorisation works

For some simplicity, there are 2 basic concepts: roles & permissions. A role is a friendly name that would like correlate to some level of seniority which has a set of permissions bundled together.
Available roles:
- Admin
- Maintainer
- Developer
- Observer

In Kubernaut there are (currently) 3 domain objects to which permissions are applicable when permitting to a user or team. These are: `namespaces`, `registries`, and `teams`. However, it is not just to these objects that permissions may apply - so to that end you can also apply a role at a `system` level (having done so, you can also add a global flag which largely does what it suggests ... it will make that role and its permissions available during any queries for applicable domain objects).

Roles can be applied to a user, as well as teams. When a user is associated with a team, the account inherits the team permissions. As accounts can be associated with multiple teams this enables a lot of flexibility.
