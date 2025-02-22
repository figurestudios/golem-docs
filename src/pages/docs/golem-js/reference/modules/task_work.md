# Module: task/work

## Table of contents

### Classes

- [WorkContext](../classes/task_work.WorkContext)

### Interfaces

- [WorkOptions](../interfaces/task_work.WorkOptions)
- [CommandOptions](../interfaces/task_work.CommandOptions)

### Type Aliases

- [Worker](task_work#worker)

## Type Aliases

### Worker

Ƭ **Worker**<`InputType`, `OutputType`\>: (`ctx`: [`WorkContext`](../classes/task_work.WorkContext), `data?`: `InputType`) => `Promise`<`OutputType`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `InputType` | `unknown` |
| `OutputType` | `unknown` |

#### Type declaration

▸ (`ctx`, `data?`): `Promise`<`OutputType`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `ctx` | [`WorkContext`](../classes/task_work.WorkContext) |
| `data?` | `InputType` |

##### Returns

`Promise`<`OutputType`\>

#### Defined in

[src/task/work.ts:19](https://github.com/golemfactory/golem-js/blob/491c0c9/src/task/work.ts#L19)
