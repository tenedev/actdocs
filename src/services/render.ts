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

  private append(line: string, eolCount: number = 1) {
    this.result += `${line}${EOL.repeat(eolCount)}`;
  }

  private formatDescription(desc: string | string[], breakPoint: string = EOL) {
    if (Array.isArray(desc)) return desc.map((d) => `- ${d}`).join(breakPoint ? EOL : '<br>');

    return desc;
  }

  private section(data: ActionData) {
    sylog.debug('Rendering content in `section` format...');

    if (this.hasEntries(data.inputs)) {
      sylog.debug(`Processing ${Object.keys(data.inputs).length} input(s)...`);

      this.append(`${heading} ${ctx.userConfig?.inputsTitle}`);

      for (const [key, value] of Object.entries(data.inputs)) {
        if (!key) continue;

        if (value.deprecationMessage) {
          sylog.warn(`Input ${key} is marked as deprecated.`);
        }

        this.append(`${subHeading} ${value.deprecationMessage ? '🚩 ' : ''} \`${key}\``);
        this.append(`${this.formatDescription(value.description)}`, 2);

        if (value.required) this.append(`**Required:** \`${value.required}\``, 2);
        if (value.default) this.append(`**Default:** \`${value.default}\``, 2);
        if (value.deprecationMessage)
          this.append(`⚠️ **Deprecated:** ${value.deprecationMessage}`, 2);
      }
    }

    if (this.hasEntries(data.outputs)) {
      sylog.debug(`Processing ${Object.keys(data.outputs).length} output(s)...`);

      this.append(`${heading} ${ctx.userConfig?.outputsTitle}`);

      for (const [key, value] of Object.entries(data.outputs)) {
        if (!key) continue;

        this.append(`${subHeading} \`${key}\``);
        this.append(`${this.formatDescription(value.description)}`, 2);
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

      this.append(`${heading} ${ctx.userConfig?.inputsTitle}`);

      this.append(`| Name | Description | Required | Default |`);
      this.append(`|------|-------------|----------|---------|`);

      for (const [key, value] of Object.entries(data.inputs)) {
        if (!key) continue;

        this.append(
          `| \`${key}\` | ${this.formatDescription(
            value.description,
            '<br>',
          )} | ${value.required ? 'Yes' : 'No'} | ${value.default ?? '-'} |`,
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

      this.append(`${heading} ${ctx.userConfig?.outputsTitle}`);

      this.append(`| Name | Description |`);
      this.append(`|------|-------------|`);

      for (const [key, value] of Object.entries(data.outputs)) {
        if (!key) continue;

        const description = Array.isArray(value.description)
          ? value.description.join('<br>')
          : (value.description ?? '');

        this.append(`| \`${key}\` | ${description} |`);
      }
    }

    if (deprecatedInputs.length > 0) {
      sylog.info(
        `${deprecatedInputs.length} deprecated input(s) documented in a separate section.`,
      );

      this.append(`${heading} Deprecated Inputs`);

      for (const input of deprecatedInputs) {
        this.append(`${subHeading} \`${input.key}\``);
        this.append(`⚠️ ${input.message}`);
      }
    }

    sylog.debug('Table format rendering completed.');
    return this.result;
  }
}
