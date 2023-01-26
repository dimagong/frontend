# Conventional Commits

The Conventional Commits specification is a lightweight convention on top of commit messages. It provides an easy set of rules for creating an explicit commit history; which makes it easier to write automated tools on top of. This convention dovetails with SemVer, by describing the features, fixes, and breaking changes made in commit messages.

### The commit message should be structured as follows:

> `<type>[optional scope]: <description>`

> `[optional body]`

> `[optional footer(s)]`

### Need to use next types:

- fix: a commit of the type fix patches a bug in your codebase (this correlates with PATCH in Semantic Versioning).
- feat: a commit of the type feat introduces a new feature to the codebase (this correlates with MINOR in Semantic Versioning).
- build:, chore:, ci:, docs:, style:, refactor:, perf:, test:
- ! after the type/scope, introduces a breaking API change

### Description

- Your commit description must be in lowercase

### Examples

> feat(api): send an email to the customer when a product is shipped

[More info about convention commits](https://www.conventionalcommits.org/en/v1.0.0/)
