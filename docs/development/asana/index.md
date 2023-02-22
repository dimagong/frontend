# Asana Task Management Guide

### Responsibilities

- Owner, Maintainer

  - create/delete/update project
  - create/delete/update task
  - create/delete/update subtask
  - create task mode/state ("In progress", 'Review", "Staging", "Prod", etc.)
  - assign a person to a task
  - task due date estimate
  - update/change timeline
  - invite/remove teammates
  - review task
  - set the task dependencies
  - set tags for task

- Developer

  - create/delete/update task
  - create/delete/update subtask
  - task due date estimate (if developer is assignee)
  - change estimate task (if developer is assignee)
  - review task
  - change task mode/state (for example, from "In progress" to "Complete" or "Review/Testing" mode on the board) (if developer is assignee)
  - set tags for task (if developer is assignee)
  - mark task as complete (if developer is assignee)

- Assignee

  - task due date estimate
  - change estimate task
    > **Note:** Only who assignee of a task can change due date
  - change task mode/state (for example, from "In progress" to "Complete" or "Review/Testing" mode on the board)
  - set tags for task
  - mark task as complete

  > **Note:** Every Friday if task is still in stage "In Progress", needs to leave a comment with the progress of that task, including any delays, blockers, etc. Need to set @Brad Powar on this comment so Brad get notification.

- Collaborator

  - subtask due date estimate
  - change estimate subtask

    > **Note:** When some collaborator of a task run into delay(which does not fit in main task deadline) of this subtask, the collaborator need to ask assignee of the task to change due date.

  - set tags for subtask
  - mark subtask as complete

> **Note:** If you know that you completed your task and you are not responsible just assign someone else who do you think is responsible.

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

[Here is communication flow (issues - MR - Asana)](../index.md)
