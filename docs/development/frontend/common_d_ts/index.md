# How to use common.d.ts file

Sometimes we need to create particular types which used on whole project rather than in one of part.

For example, for this purpose has been created PartialKey type. It can change another type so that one of key will be not obligate.

Let's say we need to change the type of `{a: number, b: string}` to `{a: number, b?: string}`.

In this case, we can use the following line:

```
PartialKey<{a: number, b: string}, b>

```

### What there are advantages?

- Ability to use interface types described in the common.d.ts file throughout the project
- No need to use export or import from common.d.ts file
- Flexibility in the use of typing

> **Caveat**:
> It is an error to use any code or logical instruction in the common.d.ts file. Here we can use only types or interfaces.
