import z from 'zod';
import { CLI_MANIFEST } from './constant';
import { ConfigSchema } from './schemas/config';

type Trim<S extends string> = S extends ` ${infer T}`
  ? Trim<T>
  : S extends `${infer T} `
    ? Trim<T>
    : S;

type SplitFlags<S extends string> = S extends `${infer Head},${infer Tail}`
  ? Trim<Head> | SplitFlags<Tail>
  : Trim<S>;

type RawFlag = (typeof CLI_MANIFEST)[number]['name'];

export type Flag = SplitFlags<RawFlag>;

export type Config = z.infer<typeof ConfigSchema>;

export type ActionData = Pick<Config, 'inputs' | 'outputs'>;

export type Context = {
  defaultConfig: Config;
  userConfig?: Config;
  actionData?: ActionData;
  data?: ActionData;
};
