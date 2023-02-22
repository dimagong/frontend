# Why we need to use `import type ... from` instead `import ... from`

1. If we need only type.
2. Importing only type make code more readable.
3. It avoid crete some mistakes (fot example circular dependencies, when two or more modules reference each other).
