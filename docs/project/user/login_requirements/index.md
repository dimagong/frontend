## Login requirements

### Admin panel roles

1. admin
2. corporation_manager
3. network_manager
4. bdm

### “Prospect/Member view” roles

1. member
2. prospect
3. Invitation is required for roles

### Invitation is required for roles

| Role                | Required |
| ------------------- | -------- |
| admin               | -        |
| corporation_manager | +        |
| network_manager     | +        |
| bdm                 | +        |
| member              | +        |
| prospect            | +        |

### Organizations

- Corporations
- Networks

### Member firm

Group of users related to network

### Roles

#### Corporation / Parent organization

- Admin
- Corporation manager

#### Network / Child organization

- Network manager
- BDM
- Member
- Prospect
- Suspect
- Lead
- Archived

### Hierarchy of organization and member firms. Many to one relations

Corporation has many networks, networks have many member firms:

> Corporation &larr; Networks &larr; Member firms

### Possibilities of multiple roles for a user

|                     | Admin | Corporation manager | Network manage | BDM | Member | Prospect | Suspect | Lead |
| :------------------ | :---: | :-----------------: | :------------: | :-: | :----: | :------: | :-----: | :--: |
| Admin               |   X   |          -          |       +        |  -  |   -    |    -     |    -    |  -   |
| Corporation manager |   -   |          X          |       +        |  -  |   -    |    -     |    -    |  -   |
| Network manager     |   +   |          +          |       X        |  -  |   -    |    -     |    -    |  -   |
| BDM                 |   -   |          -          |       -        |  X  |   -    |    -     |    -    |  -   |
| Member              |   -   |          -          |       -        |  -  |   X    |    -     |    -    |  -   |
| Prospect            |   -   |          -          |       -        |  -  |   -    |    X     |    -    |  -   |
| Suspect             |   -   |          -          |       -        |  -  |   -    |    -     |    X    |  -   |
| Lead                |   -   |          -          |       -        |  -  |   -    |    -     |    -    |  X   |

### Other permissions

| Ability name | Description                                                                                                                                                         |
| :----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| manager      | Used in some parts of the application to restrict access, currently used by “bdm” role. “bdm” role is restricted to a scope of what it has access via “manage” role |
| owner        | Used in some parts of the application for detection who is owner                                                                                                    |

[Next: Permissions](./permissions/index.md)
