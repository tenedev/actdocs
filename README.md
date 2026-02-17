# ActDocs

> Automatic documentation generator for GitHub Actions.

**ActDocs** reads your `action.yml` and generates clean, accurate documentation for inputs and outputs-ready to inject into your `README.md`.

## Features

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

### Basic

Generate documentation using the default configuration:

```bash
actdocs
```

This will:

1. Locate your GitHub Action metadata file (`action.yml`)
2. Load `.actdocs.json` if present
3. Merge metadata + custom overrides
4. Inject generated documentation into your `README.md`

### Initialize Configuration

Create a starter `.actdocs.json` configuration file:

```bash
actdocs init
```

## Placeholder Injection

ActDocs injects content inside matching Markdown comment markers.

By default:

```md
<!-- actdocs:start -->
<!-- actdocs:end -->
```

Everything between these markers will be replaced with generated documentation.

You can customize the placeholder via `.actdocs.json`:

```json
{
  "readmePlaceholder": "docs"
}
```

Then your README must contain:

```md
<!-- docs:start -->
<!-- docs:end -->
```

## Rendering Modes

You can choose between formats:

### Section Mode (default)

```json
{
  "format": "section"
}
```

Outputs:

- Headings per input/output
- Detailed Markdown blocks
- Required/default/deprecation indicators

### Table Mode

```json
{
  "format": "table"
}
```

Outputs:

- Structured table layout
- Required & default columns
- Deprecated inputs grouped separately
