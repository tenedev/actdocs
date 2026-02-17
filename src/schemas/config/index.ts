import fs from 'fs';
import z from 'zod';
import { InputSchema } from './input';
import { DescriptionSchema, identifierSchema } from './utils';
import { GITHUB_ACTION_FILENAMES } from '../../constant';

export const ConfigSchema = z
  .object({
    $schema: z.string().describe('Path or URL to the JSON Schema for this configuration file.'),

    actionpath: z
      .string()
      .default(GITHUB_ACTION_FILENAMES[0])
      .refine(
        (val) =>
          GITHUB_ACTION_FILENAMES.some((f) => f === val) ||
          val.endsWith('.yml') ||
          val.endsWith('.yaml'),
        {
          message:
            'Invalid actionpath, Expected "action.yml", "action.yaml", or a custom file ending in ".yml" or ".yaml".',
        },
      )
      .refine((val) => fs.existsSync(val), {
        message: `Action file not found, Expected one of: ${GITHUB_ACTION_FILENAMES.join(', ')}`,
      })
      .describe(
        'Path to the GitHub Action metadata file. Use this when your action file is not located at the repository root or uses a custom name.',
      ),

    readmepath: z
      .string()
      .default('README.md')
      .refine((val) => val.endsWith('.md') || val.endsWith('.mdx'), {
        message: 'Invalid readmepath. Expected a Markdown file ending in ".md" or ".mdx".',
      })
      .refine((val) => fs.existsSync(val), {
        message: 'README file not found at the specified path.',
      })
      .describe(
        'Path to the README file that actdocs will generate or update. ' +
          '- Supports Markdown files ending in `.md` or `.mdx`.\n' +
          '- Defaults to `README.md` at the repository root.',
      ),

    readmePlaceholder: z
      .string()
      .min(1, 'Placeholder marker cannot be empty')
      .default('actdocs')
      .describe(
        'Placeholder marker used by actdocs to define the auto-generated section in the README where the same marker is used for both boundaries.',
      ),

    format: z
      .enum(['section', 'table'])
      .default('section')
      .describe(
        'Controls how content is rendered in output.\n\n' +
          '- `section` (default): Renders each item as a titled documentation block.\n' +
          '- `table`: Renders content in a structured table format.',
      ),

    headingLevel: z
      .number()
      .int('Heading level must be an integer between 1 and 6.')
      .min(1, 'Heading level must be at least 1 (#).')
      .max(6, 'Heading level cannot exceed 6 (######).')
      .default(3)
      .describe(
        'Markdown heading level used for generated section titles like `Inputs` and `Outputs`.',
      ),

    inputsTitle: z
      .string()
      .trim()
      .min(1, 'Title cannot be empty.')
      .default('Inputs')
      .describe('Title used for the inputs section in the generated README.'),

    outputsTitle: z
      .string()
      .trim()
      .min(1, 'Title cannot be empty.')
      .default('Outputs')
      .describe('Title used for the outputs section in the generated README.'),

    inputs: z
      .record(identifierSchema, InputSchema)
      .describe(
        'Definitions of inputs supported by the action. Each key represents an input name, and its value describes how the input behaves.',
      ),

    outputs: z
      .record(
        identifierSchema,
        z.object({
          description: DescriptionSchema,
        }),
      )

      .describe(
        'Definitions of outputs produced by the action. Each key represents an output name exposed to downstream workflow steps.',
      ),
  })
  .partial()
  .strict();
