import fs from 'fs';
import ansi from 'ansilory';
import figlet from 'figlet';
import sylog from 'sylog';
import z from 'zod';
import { ACTDOCS_CONFIG_FILENAME, CLI_MANIFEST, CLI_USAGE_EXAMPLES } from './constant';
import { APP_DISPLAY_NAME, APP_NAME, APP_VERSION } from './meta';
import { ctx } from './context';

const maxLength = Math.max(...CLI_MANIFEST.map((o) => o.name.length));

export function printHelp() {
  console.log(`${ansi.bold.apply('Usage:')} ${ansi.cyan.apply(APP_NAME)} [options]

${ansi.bold.apply('Options:')}
${CLI_MANIFEST.map((opt) => `  ${ansi.yellow.apply(opt.name.padEnd(maxLength))}  ${opt.desc}`).join('\n')}

${ansi.bold.apply('Examples:')}
${CLI_USAGE_EXAMPLES.map((e) => `  ${ansi.cyan.apply(`${APP_NAME} ${e}`)}`).join('\n')}
`);
}

export function printBanner() {
  return new Promise<void>((resolve, reject) => {
    figlet.text(APP_DISPLAY_NAME, { font: 'Slant' }, (err, data) => {
      if (err) {
        console.error('Figlet error:', err);
        reject(err);
        return;
      }

      if (!data) {
        console.error('Failed to generate ASCII banner');
        resolve();
        return;
      }

      const lines = data.split('\n');
      const versionText = ansi.italic.gray.dim.apply(`v${APP_VERSION}`);
      const lastLineIndex = lines.findLastIndex((line) => line.trim().length > 0);

      if (lastLineIndex !== -1) {
        lines[lastLineIndex] += versionText;
      }

      console.log(ansi.brightCyan.apply(lines.join('\n')));
      resolve();
    });
  });
}

export function logZodError(error: z.ZodError) {
  sylog.error('Invalid actdocs configuration');

  for (const issue of error.issues) {
    const path = issue.path.length > 0 ? issue.path.join('.') : '(root)';

    sylog.error(`  • ${path}: ${issue.message}`);
  }

  sylog.info('Fix the above issues and try again');
}

export const hasConfig = fs.existsSync(ACTDOCS_CONFIG_FILENAME);

const level = ctx.userConfig?.headingLevel ?? 3;

export const heading = '#'.repeat(level);

export const subHeading = '#'.repeat(Math.min(level + 1, 6));
