# Documentation related to the development of NMP project

## Why need this development documentation?

The developers of the NMP project use high standards for the development and maintenance of this project. This project uses a certain style code, approaches for interacting with each other using a version control system, storybook, task managers, etc. All this requires unification and strict adherence to requirements in order to avoid misunderstanding or introducing errors into the project.

There are 4 folders for development documentation.

- asana
- backend
- frontend
- git

You can create an additional folder or create new document if necessary.

[Here's a style guide to creating documentation.](../index.md)

## Communication flow (issues - MR - Asana)

1. First should be created new task in Asana with a description of the problem. The requirements for create the task are [here](./asana/index.md)
2. After complete tack developer need to mark task as complete and move a task from "In progress" to "Complete" or "Review/Testing" mode on the board
3. Next step is create merge request (MR). The requirements for MR are [here](./git/mr_requirements/index.md)
4. Upon successful review, the MP is marked as approved.
5. Upon unsuccessful review
   - in MP overview the maintainer indicates the reasons for the unsuccessful completion of the task
   - the task in Asana returns to "In Progress" mode on the board
   - after completing the task, the developer responds to the maintainer in the MP overview and begins to perform steps starting from point 2.
   - if problem was resolved successful, maintainer mark particular comment as resolved
