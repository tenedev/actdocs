import z from 'zod';
import { DescriptionSchema } from './utils';

export const InputSchema = z
  .object({
    description: DescriptionSchema,

    required: z
      .boolean()
      .optional()
      .describe(
        'Whether this input must be provided by the user. Set this to true when the action cannot function without this value.',
      ),

    default: z
      .string()
      .optional()
      .describe(
        'A fallback value used when the workflow does not provide this input. Do not set this when the input is marked as required.',
      ),

    deprecationMessage: z
      .string()
      .optional()
      .describe(
        'A warning message shown to users when this input is used. Use this to communicate deprecations and suggest alternatives.',
      ),
  })
  .superRefine((val, ctx) => {
    if (val.required === true && val.default !== undefined) {
      ctx.addIssue({
        code: 'custom',
        message:
          'This input is marked as required, so it must not define a default value. Remove either "required" or "default".',
        path: ['default'],
      });
    }
  });
