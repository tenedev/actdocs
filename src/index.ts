import sylog from 'sylog';
import { Actdocs } from './app';
import { Flag } from './types';

async function main() {
  try {
    await new Actdocs(process.argv.slice(2) as Flag[]).run();
  } catch (err) {
    sylog.error(
      err instanceof Error
        ? `Unexpected error occurred: ${err.message}`
        : `Unexpected runtime error: ${String(err)}`,
    );
    process.exit(1);
  }
}

void main();
