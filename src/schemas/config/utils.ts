import z from 'zod';

export const DescriptionSchema = z
  .union([
    z.string().min(1, 'Input description is required and cannot be empty'),
    z
      .array(z.string().min(1, 'Each description line must be a non-empty string.'))
      .min(1, 'Description must contain at least one line.'),
  ])
  .describe(
    'A human-readable description of the input.\n\n' +
      'Supports **Markdown (.md)** formatting, including:\n' +
      '- headings (`## Heading`)\n' +
      '- lists\n' +
      '- code blocks\n\n' +
      'May be provided as a single string or an array of strings (which will be joined with newlines).',
  );

export const identifierSchema = z
  .string()
  .regex(
    /^[A-Za-z_][A-Za-z0-9_-]*$/,
    'Identifier must start with a letter or "_" and may contain only letters, numbers, "-", or "_"',
  )
  .describe(
    'A unique identifier used as the key. It must start with a letter or "_" and can contain alphanumeric characters, "-" or "_".',
  );
