# Requirements for codestyle

1. Use KISS principle (Keep It Simple Stupid) for writing code
2. Avoid use UseEffect
3. If needed to use useEffect, pass them adapter (not fetching data form back-end or save sata to licalStorage).
4. Use adapters for getting data form back-end
5. Use bussines logic separatly from UI component
6. Client data it is data which using into ui componnts and saving on client side.
7. Use on state UI only primitive data, not objects
8. Don`t try to use elements from DOM directrly. Work only with vitrual DOM and react tools.
9. Use a ternary operator for conditional render in react. Don`t use logical &&.
10. Use import type not components if you only need types. [Here is more info](./import_type/index.md)

Useful link

- [Refactoring](https://refactoring.guru/design-patterns/)
