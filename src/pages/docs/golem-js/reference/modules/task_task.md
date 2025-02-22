# Module: task/task

## Table of contents

### Enumerations

- [TaskState](../enums/task_task.TaskState)

### Classes

- [Task](../classes/task_task.Task)

### Type Aliases

- [TaskOptions](task_task#taskoptions)

## Type Aliases

### TaskOptions

Ƭ **TaskOptions**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `maxRetries?` | `number` | maximum number of retries if task failed due to provider reason, default = 5 |
| `timeout?` | `number` | timeout in ms for task execution, including retries, default = 300_000 (5min) |

#### Defined in

[src/task/task.ts:12](https://github.com/golemfactory/golem-js/blob/491c0c9/src/task/task.ts#L12)
