# How to add icon to project

The main recommendation is use `icons` from Ant Design library.  
If there is no specific `icon` in Ant Design, the following steps must be followed.

1. The svg custom-icon should be optimized according to this [recourse](https://jakearchibald.github.io/svgomg/)

2. After optimization add `icon` directly to nmp-ui/icons by Ant Design [specification](https://ant.design/components/icon#components-icon-demo-custom).

3. When adding a custom-icon as `svg`, use `viewBox`, `fill`, `width`, and `height` correctly. Note that `width` and `height` must be `1em`, the `fill` or `stroke` can be used as `currentColor`.
