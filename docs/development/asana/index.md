# Asana Task Management Guide

### Responsibilities

- Owner, Maintainer

  - create/delete/update project
  - create/delete/update task
  - task due date estimate
  - update/change timeline
  - invite/remove teammates

- Maintainer

  - create/delete/update task
  - create/delete/update subtask
  - assign a person to a task
  - review task
  - change task mode ("In progress", 'Review", "Staging", "Prod", etc.)
  - set the task dependencies
  - set tags for task

- Developer

  - task due date estimate
  - change estimate task
  - review task
  - change task from "In progress" to "Complete" or "Review/Testing" mode on the board
  - set tags for task
  - mark task as complete

### Requirements for create task

- Write short task title
- Select an assignee person
- Add particular project (optinal)
- Set due date (start & and)
- Add particular tag (optinal)
  - Frontend
  - Backend
- Write the task description
  - description of problem
  - description the way resolve this problem
  - description of task requirements
  - description subtasks (optinal)
- Add screenshots to better describe the purpose of the task (optinal)
- If necessary, set the dependencies of the current task on the execution of other tasks.
  - Blocked by
  - Blocking
- Create subtasks if the main task has a specific list of actions that takes some time to complete.
- Move a task to "In progress" mode on the board if you've started to deal with it

### Task completion delay

- Set a specific tag depending on the reason for the delay
  - Paused (for example, need to perform another higher priority task )
  - Delayed (for example, there was some problem or difficulty completing the task, incorrect date estimation, etc.)
- Post information about the reason for the delay under the task description
- Set a new end date for a task

> **Note:** If a task becomes more complex and takes a long time to complete, you should create a new project based on that task.

### After complete task

- Mark task as complete
- Move a task from "In progress" to "Complete" or "Review/Testing" mode on the board

> **Note:**
> The current version of Asana does not allow you to create a due date estimate for a task. Only start date and end date.
