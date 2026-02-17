import { ConfigSchema } from './schemas/config';
import { Context } from './types';

export const ctx: Context = {
  defaultConfig: ConfigSchema.parse({}),
};

export const cwd = process.cwd();
