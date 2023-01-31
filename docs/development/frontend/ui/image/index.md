# Description about (png, jpg, webp, heic, svg) usage.

### Steer clear of using png or jpg images.

- Lossy WebP images average 25–35% smaller than jpg images of visually similar compression levels.
- Lossless WebP images are typically 26% smaller than the same images in png format.
- Lossless HEIC images are typically 50% smaller than the same images in jpg format.

### Use optimizer that allows to compress images

- for png, jpg
  - https://squoosh.app/
- for svg
  - https://jakearchibald.github.io/svgomg/

> **Note:**
>
> When adding a custom-icon as svg, use `viewBox`, `fill`, `width`, and `height` correctly. Note that `width` and `height` must be 1em, the `fill` or `stroke` can be used as `currentColor`.

### When should use CSS `background-image` property?

- if an image is purely decoration
- image tag with alt attribute helps us for SEO.
- if you have image image layers
- if you want to display on mouse hover
- if you want some text on top of the image
- if you want show only some part of the image
- if you want to apply some cool background-attachment properties

### When should use HTML `<img />` tag?

- if an image has meaning, in terms of your content
- if you want an image to print (cmd/ctrl + p) by default
- If you want your image to be clickable
