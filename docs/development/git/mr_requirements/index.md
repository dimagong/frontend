# Requirements for creating Merge Requests (MR)

### Here is base structure of MR

**[Asana task](url) (optional)**

**Dependent MRs - #000 (optional)**

**1. What this MR does / why we need it:**

**2. Make sure that you’ve checked the boxes below before you submit MR:**

- [ ] I have run `tests` locally and there is no error.
- [ ] no conflict with %{target_branch} branch.

**3. Which issue this PR fixes (optional)**

**4. CHANGELOG/Release Notes (optional)**

### Labels

All MR need to use particular labels. It needed for more simple keep tracking merge requests.

| label                   | description                                                                                                                                               |
| :---------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bug:functional          | Functional defects resulting from feature changes.                                                                                                        |
| bug:performance         | Performance defects or response time degradation.                                                                                                         |
| bug:transient           | Bugs that are transient.                                                                                                                                  |
| bug:ux                  | Unexpected and unintended behavior that is detrimental to the user experience.                                                                            |
| bug:vulnerability       | A security vulnerability.                                                                                                                                 |
| critical:high           | Prevents some or all users from performing critical tasks with no possible workaround.                                                                    |
| critical:low            | Prevents some users from performing non-critical tasks, or where the user experience is seriously degraded for users with certain assistive technologies. |
| critical:medium         | Prevents some users from performing critical tasks. A workaround may exist, but not without creating frustration and inefficiency.                        |
| discussion              | Merge requests for further discussion by project Maintainers.                                                                                             |
| documentation           | Merge requests related to product documentation.                                                                                                          |
| feature                 | The first MVC that gives NMP users a foundation of new capabilities that were previously unavailable. Includes good user value, usability, and tests.     |
| maintenance:dependency  | Dependency updates and their version upgrades.                                                                                                            |
| maintenance:refactor    | Simplifying or restructuring existing code or documentation.                                                                                              |
| maintenance:scalability | Modification to improve the scalability of NMP that is not a user facing change or performance improvement.                                               |

[The list of prioritized labels](https://gitlab.com/RS_NMP/frontend/-/labels)

[more info about labels](https://docs.gitlab.com/ee/user/project/labels.html)
