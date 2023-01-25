# All documentation on the NMP project and its development process

- [API related documentation](./api/index.md)
- [Development related documentation](./development/index.md)
- [Project related documentation](./project/index.md)

### If you want to add any document, please follow the following style guide

## Text

- Split up long lines, this makes it much easier to review and edit. Only
  double line breaks are shown as a full line break in GitLab markdown.
  80-100 characters is a good line length
- Make sure that the documentation is added in the correct directory and that
  there's a link to it somewhere useful
- Do not duplicate information
- Be brief and clear
- Unless there's a logical reason not to, add documents in alphabetical order
- Write in US English
- Use single spaces instead of double spaces

## Formatting

- Use dashes (-) for unordered lists instead of asterisks (\*)
- Use the number one (1) for ordered lists
- Use underscores (\_) to mark a word or text in italics
- Use double asterisks (\*\*) to mark a word or text in bold
- When using lists, prefer not to end each item with a period. You can use
  them if there are multiple sentences, just keep the last sentence without
  a period

## Headings

- Add only one H1 title in each document, by adding # at the beginning of it (when using markdown). For subheadings, use ##, ### and so on
- Avoid putting numbers in headings. Numbers shift, hence documentation anchor links shift too, which eventually leads to dead links. If you think it is compelling to add numbers in headings, make sure to at least discuss it with someone in the Merge Request
- Avoid adding things that show ephemeral statuses. For example, if a feature is considered beta or experimental, put this info in a note, not in the heading.
- When introducing a new document, be careful for the headings to be grammatically and syntactically correct.
- This is to ensure that no document with wrong heading is going live without an audit, thus preventing dead links and redirection issues when corrected
- Leave exactly one newline after a heading

## Links

- Use the regular inline link markdown markup [Text](https://example.com).It's easier to read, review, and maintain.
- If there's a link that repeats several times through the same document, you can use [Text][identifier] and at the bottom of the section or the document add: [identifier]: https://example.com, in which case, we do encourage you to also add an alternative text: [identifier]: https://example.com "Alternative text" that appears when hovering your mouse on a link.

## Images

- Place images in a separate directory named img/ in the same directory where
  the .md document that you're working on is located. Always prepend their
  names with the name of the document that they will be included in. For
  example, if there is a document called twitter.md, then a valid image name
  could be twitter_login_screen.png. [Exception: images for
  articles should be
  put in a directory called img underneath /articles/article_title/img/, therefore,
  there's no need to prepend the document name to their filenames.]
- Images should have a specific, non-generic name that will differentiate them.
- Keep all file names in lower case.
- Consider using PNG images instead of JPEG.
- Compress all images with https://tinypng.com/ or similar tool.
- Compress gifs with https://ezgif.com/optimize or similar tool.
- Images should be used (only when necessary) to illustrate the description
  of a process, not to replace it.

#### Inside the document:

- The Markdown way of using an image inside a document is:

```
  ![Proper description what the image is about](img/document_image_title.png)
```

- Always use a proper description for what the image is about. That way, when a
  browser fails to show the image, this text will be used as an alternative
  description
- If there are consecutive images with little text between them, always add
  three dashes (---) between the image and the text to create a horizontal
  line for better clarity
- If a heading is placed right after an image, always add three dashes (---)
  between the image and the heading

## Notes

- Notes should be quoted with the word Note: being bold. Use this form:

```
>**Note:**
This is something to note.
```

which renders to:

> **Note:** This is something to note.

If the note spans across multiple lines it's OK to split the line.
