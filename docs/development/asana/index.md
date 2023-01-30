# Asana Task Management Guide

### Responsibilities

- Owner, Maintainer

  - create/delete/update project
  - create/delete/update task
  - task due date estimate
  - update/change timeline
  - invite/remove teammates
  - create task mode/state ("In progress", 'Review", "Staging", "Prod", etc.)

- Maintainer

  - create/delete/update task
  - create/delete/update subtask
  - assign a person to a task
  - review task
  - set the task dependencies
  - set tags for task

- Developer

  - task due date estimate
  - change estimate task
  - review task
  - change task mode/state (for example, from "In progress" to "Complete" or "Review/Testing" mode on the board)
  - set tags for task
  - mark task as complete

### Requirements for create task

- write short task title
- select an assignee person
- add particular project (optinal)
- set due date (start & and)
- add particular tag (optinal)
  - frontend
  - backend
- write the task description
  - description of problem
  - description the way resolve this problem
  - description of task requirements
  - description subtasks (optinal)
- add screenshots to better describe the purpose of the task (optinal)
- if necessary, set the dependencies of the current task on the execution of other tasks.
  - blocked by
  - blocking
- create subtasks if the main task has a specific list of actions that takes some time to complete.
- move a task to "In progress" mode on the board if you've started to deal with it

### Task completion delay

- set a specific tag depending on the reason for the delay
  - paused (for example, need to perform another higher priority task )
  - delayed (for example, there was some problem or difficulty completing the task, incorrect date estimation, etc.)
- post information about the reason for the delay under the task description
- set a new end date for a task

> **Note:** If a task becomes more complex and takes a long time to complete, you should create a new project based on that task.

### After complete task

- mark task as complete
- move a task from "In progress" to "Complete" or "Review/Testing" mode on the board

> **Note:**
> The current version of Asana does not allow you to create a due date estimate for a task. Only start date and end date.
