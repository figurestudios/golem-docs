# Class: TaskExecutor

[executor/executor](../modules/executor_executor).TaskExecutor

A high-level module for defining and executing tasks in the golem network

## Table of contents

### Methods

- [create](executor_executor.TaskExecutor#create)
- [init](executor_executor.TaskExecutor#init)
- [end](executor_executor.TaskExecutor#end)
- [getStats](executor_executor.TaskExecutor#getstats)
- [beforeEach](executor_executor.TaskExecutor#beforeeach)
- [run](executor_executor.TaskExecutor#run)
- [map](executor_executor.TaskExecutor#map)
- [forEach](executor_executor.TaskExecutor#foreach)
- [cancel](executor_executor.TaskExecutor#cancel)

## Methods

### create

▸ `Static` **create**(`options`): `Promise`<[`TaskExecutor`](executor_executor.TaskExecutor)\>

Create a new Task Executor

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`ExecutorOptionsMixin`](../modules/executor_executor#executoroptionsmixin) | Task executor options |

#### Returns

`Promise`<[`TaskExecutor`](executor_executor.TaskExecutor)\>

TaskExecutor

**`Description`**

Factory Method that create and initialize an instance of the TaskExecutor

**`Example`**

**Simple usage of Task Executor**

The executor can be created by passing appropriate initial parameters such as package, budget, subnet tag, payment driver, payment network etc.
One required parameter is a package. This can be done in two ways. First by passing only package image hash or image tag, e.g.
```js
const executor = await TaskExecutor.create("9a3b5d67b0b27746283cb5f287c13eab1beaa12d92a9f536b747c7ae");
```
or
```js
const executor = await TaskExecutor.create("golem/alpine:3.18.2");
```

**`Example`**

**Usage of Task Executor with custom parameters**

Or by passing some optional parameters, e.g.
```js
const executor = await TaskExecutor.create({
  subnetTag: "public",
  payment: { driver: "erc-20", network: "goerli" },
  package: "golem/alpine:3.18.2",
});
```

#### Defined in

[src/executor/executor.ts:117](https://github.com/golemfactory/golem-js/blob/491c0c9/src/executor/executor.ts#L117)

___

### init

▸ **init**(): `Promise`<`void`\>

Initialize executor

#### Returns

`Promise`<`void`\>

**`Description`**

Method responsible initialize all executor services.

#### Defined in

[src/executor/executor.ts:168](https://github.com/golemfactory/golem-js/blob/491c0c9/src/executor/executor.ts#L168)

___

### end

▸ **end**(): `Promise`<`void`\>

Stop all executor services and shut down executor instance

#### Returns

`Promise`<`void`\>

#### Defined in

[src/executor/executor.ts:216](https://github.com/golemfactory/golem-js/blob/491c0c9/src/executor/executor.ts#L216)

___

### getStats

▸ **getStats**(): `Object`

Statistics of execution process

#### Returns

`Object`

array

#### Defined in

[src/executor/executor.ts:236](https://github.com/golemfactory/golem-js/blob/491c0c9/src/executor/executor.ts#L236)

___

### beforeEach

▸ **beforeEach**(`worker`): `void`

Define worker function that will be runs before every each computation Task, within the same activity.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `worker` | [`Worker`](../modules/task_work#worker) | worker function - task |

#### Returns

`void`

**`Example`**

```typescript
executor.beforeEach(async (ctx) => {
  await ctx.uploadFile("./params.txt", "/params.txt");
});

await executor.forEach([1, 2, 3, 4, 5], async (ctx, item) => {
   await ctx
     .beginBatch()
     .run(`/run_some_command.sh --input ${item} --params /input_params.txt --output /output.txt`)
     .downloadFile("/output.txt", "./output.txt")
     .end();
});
```

#### Defined in

[src/executor/executor.ts:259](https://github.com/golemfactory/golem-js/blob/491c0c9/src/executor/executor.ts#L259)

___

### run

▸ **run**<`OutputType`\>(`worker`, `options?`): `Promise`<`undefined` \| `OutputType`\>

Run task - allows to execute a single worker function on the Golem network with a single provider.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `OutputType` | [`Result`](activity_results.Result)<`any`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `worker` | [`Worker`](../modules/task_work#worker)<`undefined`, `OutputType`\> | function that run task |
| `options?` | [`TaskOptions`](../modules/task_task#taskoptions) | task options |

#### Returns

`Promise`<`undefined` \| `OutputType`\>

result of task computation

**`Example`**

```typescript
await executor.run(async (ctx) => console.log((await ctx.run("echo 'Hello World'")).stdout));
```

#### Defined in

[src/executor/executor.ts:274](https://github.com/golemfactory/golem-js/blob/491c0c9/src/executor/executor.ts#L274)

___

### map

▸ **map**<`InputType`, `OutputType`\>(`data`, `worker`): `AsyncIterable`<`undefined` \| `OutputType`\>

Map iterable data to worker function and return computed Task result as AsyncIterable

#### Type parameters

| Name |
| :------ |
| `InputType` |
| `OutputType` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Iterable`<`InputType`\> | Iterable data |
| `worker` | [`Worker`](../modules/task_work#worker)<`InputType`, `OutputType`\> | worker function |

#### Returns

`AsyncIterable`<`undefined` \| `OutputType`\>

AsyncIterable with results of computed tasks

**`Example`**

```typescript
const data = [1, 2, 3, 4, 5];
const results = executor.map(data, (ctx, item) => ctx.run(`echo "${item}"`));
for await (const result of results) console.log(result.stdout);
```

#### Defined in

[src/executor/executor.ts:297](https://github.com/golemfactory/golem-js/blob/491c0c9/src/executor/executor.ts#L297)

___

### forEach

▸ **forEach**<`InputType`, `OutputType`\>(`data`, `worker`): `Promise`<`void`\>

Iterates over given data and execute task using worker function

#### Type parameters

| Name |
| :------ |
| `InputType` |
| `OutputType` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Iterable`<`InputType`\> | Iterable data |
| `worker` | [`Worker`](../modules/task_work#worker)<`InputType`, `OutputType`\> | Worker function |

#### Returns

`Promise`<`void`\>

**`Example`**

```typescript
const data = [1, 2, 3, 4, 5];
await executor.forEach(data, async (ctx, item) => {
    console.log((await ctx.run(`echo "${item}"`)).stdout);
});
```

#### Defined in

[src/executor/executor.ts:345](https://github.com/golemfactory/golem-js/blob/491c0c9/src/executor/executor.ts#L345)

___

### cancel

▸ **cancel**(`reason?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `reason?` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/executor/executor.ts:403](https://github.com/golemfactory/golem-js/blob/491c0c9/src/executor/executor.ts#L403)
