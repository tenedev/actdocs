# ActDocs

> Automatic documentation generator for GitHub Actions.

**ActDocs** reads your `action.yml` file and produces clean, accurate documentation for inputs and outputs that can be injected directly into your `README.md`.

ActDocs keeps your Action documentation synchronized automatically and reduces the need for manual updates.

## Features

- Optional `.actdocs.json` configuration for enhanced control
- Command line configuration overrides
- Markdown compatible descriptions
- Multiple rendering formats
- Runtime validation powered by Zod
- JSON Schema support for editor autocomplete
- Designed for CI and automation workflows

## Installation

```bash
pnpm add -D actdocs
# or
npm install -D actdocs
```

You can also run it without installing:

```bash
npx -y actdocs
```

## Usage

### Basic

Generate documentation using the default settings:

```bash
actdocs
```

This command will:

1. Load the default configuration values
2. Load `.actdocs.json` if it exists
3. Apply command line overrides if provided
4. Read the `action.yml` file
5. Merge metadata with custom configuration
6. Inject the generated documentation into your README

### Examples

Render output in table format:

```bash
actdocs --format=table
```

Use a different README file:

```bash
actdocs --readmepath=DOCS.md
```

Change the heading level of generated sections:

```bash
actdocs --headingLevel=2
```

Customize the placeholder marker:

```bash
actdocs --readmePlaceholder=docs
```

## CLI Configuration

ActDocs allows configuration to be overridden directly through the command line.

Configuration precedence follows this order:

```
Default values
   ↓
.actdocs.json
   ↓
Command line arguments
```

Command line options always override values defined in the configuration file.

## Initialize Configuration

Create a starter configuration file:

```bash
actdocs init
```

This command generates a `.actdocs.json` file with sensible defaults.

## Configuration File (.actdocs.json)

ActDocs can be configured using a `.actdocs.json` file located in the repository root.

Example:

```json
{
  "$schema": "./actdocs.schema.json",
  "actionpath": "action.yml",
  "readmepath": "README.md",
  "format": "section"
}
```

## Rendering Modes

### Section Mode (Default)

Section mode renders structured documentation blocks that include:

- Clear section titles
- Detailed descriptions
- Required and default value indicators
- Deprecation warnings when applicable

### Table Mode

Table mode renders a structured table that includes:

- Name
- Description
- Required status
- Default value

Deprecated inputs can be displayed separately when applicable.

## Placeholder Injection

ActDocs updates content between specific markers inside your README:

```md
<!-- actdocs:start -->
<!-- actdocs:end -->
```

Only the content between these markers is replaced; All other content in the README remains unchanged.
