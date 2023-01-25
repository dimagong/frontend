### Permissions

#### Roles explanation

#### Admin

- Has full access to everything related to the organizational hierarchy

#### Corporation manager

- ???

#### Corporation level (Parent level)

|                  |    Abilities     | Admin | Corporation Manager |
| :--------------- | :--------------: | :---: | :-----------------: |
| Workflows        |       get        |   +   |          +          |
|                  |      create      |   +   |          -          |
|                  |      update      |   +   |          -          |
|                  |      delete      |   +   |          -          |
| DForm Templates  |       get        |   +   |          +          |
|                  |      create      |   +   |          -          |
|                  |      update      |   +   |          -          |
|                  |      delete      |   +   |          -          |
| Surveys          |       get        |   +   |          +          |
|                  |      create      |   +   |          -          |
|                  |      update      |   +   |          -          |
|                  |      delete      |   +   |          -          |
| Resource Manager |  get hierarchy   |   +   |          +          |
|                  | create directory |   +   |          -          |
|                  |   create field   |   +   |          -          |
|                  |   delete field   |   +   |          -          |
|                  |   update field   |   +   |          -          |
|                  | delete directory |   +   |          -          |
|                  | update directory |   +   |          -          |
| Master schema    | create directory |   +   |          -          |
|                  |   create field   |   +   |          -          |
|                  |   delete field   |   +   |          -          |
|                  |   update field   |   +   |          -          |
|                  | delete directory |   +   |          -          |
|                  | update directory |   +   |          -          |
| Member Firms     |       get        |   +   |          -          |
|                  |      create      |   +   |          -          |
|                  |      update      |   +   |          -          |
|                  |      delete      |   +   |          -          |
| Users            |       get        |   +   |          +          |
|                  |      create      |   +   |          -          |
|                  |      update      |   +   |          -          |
|                  |      delete      |   +   |          -          |

### Network level (Child level)

#### Network manager access rights for network organization

Access rights that Network manager can grant to users:

- BDM
- Member
- Prospect
- Suspect
- Lead

**Action Restrictions Based on End User Roles**
| You are Network manager | Admin | Corporation manager + Network Manage | Network manager |BDM| Member| Prospect | Suspect | Lead|
| :--------------- | :-------------- | :---: | :-----------------: |:-----------------: |:-----------------: |:-----------------: |:-----------------: |:-----------------: |
|User management|Get user list| +| +| +| +| +| +| +| +|
||Edit user| -| -| -| +| +| +| +| +|
||Edit user master schema data| -| -| -| +| +| +| +| +|
||Get master schema data| -| -| -| +| +| +| +| +|
||Send invitation| -| -| -| +| +| +| +| +|
||Delete invitation| -| -| -| +| +| +| +| +|
||Assign onboarding| -| -| -| +| +| +| +| +|
||Delete onboarding| -| -| -| +| +| +| +| +|
||Edit onboarding application data| -| -| -| +| +| +| +| +|
||Get onboardings| -| -| -| +| +| +| +| +|

#### Member firm

**Corporation manager + network manager** permission for **network organization**
| Request | User roles on view | User roles on edit | User roles on delete |
| :--------------- | :-------------- | :---: | :-----------------: |
|User management users|Netwrok manager, BDM, Member, Prospect Suspect, Lead, Archived | Netwrok manager, BDM, Member, Prospect, Suspect, Lead, Archived | - |

**Corporation manager** permission for **corporation** organization
|Request | User roles on view | User roles on edit | User roles on delete |
| :--------------- | :-------------- | :---: | :-----------------: |
|User management users|Admin, Corporation manager| -| -|

|             | Abilities | Corporation Manager | Corporation manager + Network Manager | Network manager | BDM (has partial access to entities that he can manage) |
| :---------- | :-------- | :-----------------: | :-----------------------------------: | :-------------: | :-----------------------------------------------------: |
| Permissions | get       |          -          |                   +                   |        +        |                            +                            |

Creation
[Next: Creation](../creation/index.md)
