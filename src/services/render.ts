import fs from 'fs';
import { EOL } from 'os';
import sylog from 'sylog';
import { rewriteMdComment } from 'rewrite.md';
import { ctx } from '../context';
import { ActionData, Config } from '../types';
import { heading, subHeading } from '../helpers';

export class RenderService {
  run() {
    sylog.debug('Starting README rendering process...');

    try {
      sylog.debug(`Reading README file from: ${ctx.userConfig!.readmepath}`);
      const readmeData = fs.readFileSync(ctx.userConfig!.readmepath!, 'utf-8');

      sylog.debug(
        `Rendering format: ${ctx.userConfig!.format} with placeholder ${ctx.userConfig!.readmePlaceholder}`,
      );

      const renderedContent = this.rendererMap[ctx.userConfig!.format!](ctx.actionData!);

      const data = rewriteMdComment(readmeData, {
        [ctx.userConfig!.readmePlaceholder!]: renderedContent,
      });

      fs.writeFileSync(ctx.userConfig!.readmepath!, data, 'utf-8');

      sylog.success('File updated successfully.');
    } catch (err) {
      if (err instanceof Error) {
        sylog.error(`Failed to render README: ${err.message}`);
        if (err.stack) sylog.debug(err.stack);
      } else {
        sylog.error(`Unexpected error during rendering: ${String(err)}`);
      }
      process.exit(1);
    }
  }

  private result = '';

  private rendererMap: Record<NonNullable<Config['format']>, (data: ActionData) => void> = {
    section: (data) => this.section(data),
    table: (data) => this.table(data),
  };

  private hasEntries<T extends object>(obj: T | undefined): obj is T {
    return !!obj && Object.keys(obj).length > 0;
  }

  private append(line: string) {
    this.result += `${line}${EOL}`;
  }

  private formatDescription(desc: string | string[], breakPoint: string = EOL) {
    if (Array.isArray(desc)) return desc.map((d) => `- ${d}`).join(breakPoint ? EOL : '<br>');

    return desc;
  }

  private section(data: ActionData) {
    sylog.debug('Rendering content in `section` format...');

    if (this.hasEntries(data.inputs)) {
      sylog.debug(`Processing ${Object.keys(data.inputs).length} input(s)...`);

      this.append(`${heading} ${ctx.userConfig?.inputsTitle}${EOL}`);

      for (const [key, value] of Object.entries(data.inputs)) {
        if (!key) continue;

        if (value.deprecationMessage) {
          sylog.warn(`Input ${key} is marked as deprecated.`);
        }

        this.append(`${subHeading} ${value.deprecationMessage && '🚩'} \`${key}\`${EOL}`);
        this.append(`${this.formatDescription(value.description)}${EOL}`);

        if (value.required) this.append(`**Required:** \`${value.required}\`${EOL}`);
        if (value.default) this.append(`**Default:** \`${value.default}\`${EOL}`);
        if (value.deprecationMessage)
          this.append(`⚠️ **Deprecated:** ${value.deprecationMessage}${EOL}`);
      }
    }

    if (this.hasEntries(data.outputs)) {
      sylog.debug(`Processing ${Object.keys(data.outputs).length} output(s)...`);

      this.append(`${heading} ${ctx.userConfig?.outputsTitle}${EOL}`);

      for (const [key, value] of Object.entries(data.outputs)) {
        if (!key) continue;

        this.append(`${subHeading} \`${key}\`${EOL}`);
        this.append(`${this.formatDescription(value.description)}${EOL}`);
      }
    }

    sylog.debug('Section format rendering completed.');
    return this.result;
  }

  private table(data: ActionData) {
    sylog.debug('Rendering content in `table` format...');

    const deprecatedInputs: Array<{ key: string; message: string }> = [];

    if (this.hasEntries(data.inputs)) {
      sylog.debug(`Processing ${Object.keys(data.inputs).length} input(s)...`);

      this.append(`${heading} ${ctx.userConfig?.inputsTitle}${EOL}`);

      this.append(`| Name | Description | Required | Default |${EOL}`);
      this.append(`|------|-------------|----------|---------|${EOL}`);

      for (const [key, value] of Object.entries(data.inputs)) {
        if (!key) continue;

        this.append(
          `| \`${key}\` | ${this.formatDescription(
            value.description,
            '<br>',
          )} | ${value.required ? 'Yes' : 'No'} | ${value.default ?? '-'} |${EOL}`,
        );

        if (value.deprecationMessage) {
          sylog.warn(`Input ${key} is deprecated.`);
          deprecatedInputs.push({
            key,
            message: value.deprecationMessage,
          });
        }
      }
    }

    if (this.hasEntries(data.outputs)) {
      sylog.debug(`Processing ${Object.keys(data.outputs).length} output(s)...`);

      this.append(`${heading} ${ctx.userConfig?.outputsTitle}${EOL}${EOL}`);

      this.append(`| Name | Description |${EOL}`);
      this.append(`|------|-------------|${EOL}`);

      for (const [key, value] of Object.entries(data.outputs)) {
        if (!key) continue;

        const description = Array.isArray(value.description)
          ? value.description.join('<br>')
          : (value.description ?? '');

        this.append(`| \`${key}\` | ${description} |${EOL}`);
      }
    }

    if (deprecatedInputs.length > 0) {
      sylog.info(
        `${deprecatedInputs.length} deprecated input(s) documented in a separate section.`,
      );

      this.append(`${heading} Deprecated Inputs${EOL}`);

      for (const input of deprecatedInputs) {
        this.append(`${subHeading} \`${input.key}\`${EOL}`);
        this.append(`⚠️ ${input.message}${EOL}`);
      }
    }

    sylog.debug('Table format rendering completed.');
    return this.result;
  }
}
