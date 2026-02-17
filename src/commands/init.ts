import fs from 'fs';
import path from 'path';
import { EOL } from 'os';
import sylog from 'sylog';
import { hasConfig } from '../helpers';
import { ACTDOCS_CONFIG_FILENAME, ACTDOCS_SCHEMA_CDN_URL } from '../constant';
import { Config } from '../types';
import { ctx, cwd } from '../context';

export function init() {
  if (hasConfig) {
    sylog.warn(`An actdocs configuration file already exists: ${ACTDOCS_CONFIG_FILENAME}`);
    process.exit(0);
  }

  sylog.debug('Initializing actdocs configuration file creation...');

  fs.writeFileSync(
    path.join(cwd, ACTDOCS_CONFIG_FILENAME),
    JSON.stringify({ $schema: ACTDOCS_SCHEMA_CDN_URL, ...ctx.defaultConfig } as Config, null, 2) +
      EOL,
    {
      encoding: 'utf-8',
    },
  );

  sylog.success(`Actdocs configuration file created successfully: ${ACTDOCS_CONFIG_FILENAME}`);

  process.exit(0);
}
