import { writeFileSync } from 'fs';
import z from 'zod';
import { ConfigSchema } from '../src/schemas/config';
import { EOL } from 'os';

writeFileSync(
  'actdocs.schema.json',
  JSON.stringify(
    z.toJSONSchema(ConfigSchema, {
      target: 'draft-7',
    }),
    null,
    2,
  ) + EOL,
);
