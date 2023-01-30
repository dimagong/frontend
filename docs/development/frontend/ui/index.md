# UI Requirements

### Base recommendations for create UI components

1. AntDesing always first! Re-use not customize!
2. Working with ICONS
3. Don’t use PNG images -> use webp
4. IMG vs BACKGROUNDS
5. Div can’t be interactive. Use buttons/input/a (WhatWG Interactive elements)
6. Use currentColor for svg

### Base recommendations for redesign

1. Design analyze first (analyze design before implementation).
2. UI first (first create only UI with storybook).
3. Question first (do not do mistake, ask a question).
4. Approve by customer (everything must be approved).
5. SVG is friend for responsive shapes.
6. Iterative approach (analyz -> create -> decompose -> analyz -> create …).
7. AntDesign is refactoring to JSS, we are considering using JSS in the project.

### CodeStyle

1. Use a component-wrapper over direct usage of an Ant Design component.
2. Create a component-wrapper over an Ant Design component as a part of nmp-ui. It helps keep component customize friendly.
3. Use css variables from Ant Design, do not use css variables or scss variables from Bootstrap or Material UI.
4. Use BEM.

### Required UI utilities

1. Container (center + x-gutter)
2. Layout (vertical fit)
3. VerticalCol (flex column utility)
4. Typography (from AntDesign)

### Pictures

1. Do not use png in case if you need alpha channel, use webp.
2. Take a read to get differences when to use html `<img />` and css `backgorund`
   - [here is explanation](https://maheshkonne.medium.com/html-img-tag-vs-css-background-image-23f9e2e9c8aa)
3. Use [this tools](https://squoosh.app/) for image croping/converting/optimizing.

### Icons

1. Do not use `svg` directly. Try to find similar `icon` in Ant Design icons library. If Ant Design do not have such `icon`, add it directly to nmp-ui/icons by Ant Design [specification](https://ant.design/components/icon#components-icon-demo-custom). When adding a custom-icon as `svg`, use `viewBox`, `fill`, `width`, and `height` correctly. Note that `width` and `height` must be `1em`, the `fill` or `stroke` can be used as `currentColor`.
2. Before adding some svg as custom-icon, optimize it with this [recourse](https://jakearchibald.github.io/svgomg/)

**The useful links**

- [Client side architecture](https://khalilstemmler.com/articles/client-side-architecture/introduction/)
- [Flexbux repo (must know flex: auto + min-height: 0)](https://github.com/philipwalton/flexbugs#flexbugs)
- [A website on building software effectively](https://martinfowler.com/)
- [Addy Osmani](https://addyosmani.com/)
- [Zach Leatherman](https://www.zachleat.com/)
- [Markus Oberlehner is](https://markus.oberlehner.net/)
- [developer advocate for Google Chrome](https://jakearchibald.com/)