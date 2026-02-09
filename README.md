# ActDocs

> Automatic documentation generator for GitHub Actions.

[![ci](https://github.com/teneplaysofficial/actdocs/actions/workflows/ci.yml/badge.svg)](https://github.com/teneplaysofficial/actdocs)

**ActDocs** reads your `action.yml` (or `action.yaml`) and generates clean, accurate documentation for inputs and outputs-ready to inject into your `README.md`.

## Features

- Parses `action.yml` / `action.yaml`
- Optional `.actdocs.json` for enhanced docs
- Markdown-friendly descriptions
- Table or list render modes
- Zod-based validation
- JSON Schema generation for editor autocomplete
- CLI-first, scriptable

## Installation

```bash
pnpm add -D actdocs
# or
npm install -D actdocs
```

Or run without installing:

```bash
npx -y actdocs
```

## Usage

```bash
actdocs
```

By default, ActDocs:

1. Looks for `action.yml` or `action.yaml`
2. Loads `.actdocs.json` if present
3. Generates Markdown docs for inputs & outputs
