# Class: ActivityCreated

[events/events](../modules/events_events).ActivityCreated

## Hierarchy

- [`BaseEvent`](events_events.BaseEvent)<{ `id`: `string` ; `agreementId`: `string`  }\>

  ↳ **`ActivityCreated`**

## Table of contents

### Constructors

- [constructor](events_events.ActivityCreated#constructor)

### Properties

- [detail](events_events.ActivityCreated#detail)
- [name](events_events.ActivityCreated#name)
- [timestamp](events_events.ActivityCreated#timestamp)

## Constructors

### constructor

• **new ActivityCreated**(`data?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `data?` | `Object` |
| `data.id` | `string` |
| `data.agreementId` | `string` |

#### Inherited from

[BaseEvent](events_events.BaseEvent).[constructor](events_events.BaseEvent#constructor)

#### Defined in

[src/events/events.ts:28](https://github.com/golemfactory/golem-js/blob/491c0c9/src/events/events.ts#L28)

## Properties

### detail

• `Readonly` **detail**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `agreementId` | `string` |

#### Inherited from

[BaseEvent](events_events.BaseEvent).[detail](events_events.BaseEvent#detail)

#### Defined in

[src/events/events.ts:16](https://github.com/golemfactory/golem-js/blob/491c0c9/src/events/events.ts#L16)

___

### name

• `Readonly` **name**: `string`

#### Inherited from

[BaseEvent](events_events.BaseEvent).[name](events_events.BaseEvent#name)

#### Defined in

[src/events/events.ts:17](https://github.com/golemfactory/golem-js/blob/491c0c9/src/events/events.ts#L17)

___

### timestamp

• `Readonly` **timestamp**: `number`

#### Inherited from

[BaseEvent](events_events.BaseEvent).[timestamp](events_events.BaseEvent#timestamp)

#### Defined in

[src/events/events.ts:18](https://github.com/golemfactory/golem-js/blob/491c0c9/src/events/events.ts#L18)
