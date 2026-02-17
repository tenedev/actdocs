import { APP_NAME, APP_VERSION } from './meta';

export const CLI_MANIFEST = [
  { name: '-h, --help', desc: 'Show this help message' },
  { name: '-v, --version', desc: 'Show CLI version' },
  { name: '-D, --debug', desc: 'Enable verbose debug logging' },
  { name: 'init', desc: 'Initialize actdocs' },
] as const;

export const CLI_USAGE_EXAMPLES = ['', 'init'] as const;

export const GITHUB_ACTION_FILENAMES = ['action.yml', 'action.yaml'] as const;

export const ACTDOCS_CONFIG_FILENAME = '.actdocs.json' as const;

export const ACTDOCS_SCHEMA_FILENAME = 'actdocs.schema.json' as const;

export const ACTDOCS_SCHEMA_CDN_URL =
  `https://cdn.jsdelivr.net/npm/${APP_NAME}@${APP_VERSION}/${ACTDOCS_SCHEMA_FILENAME}` as const;
