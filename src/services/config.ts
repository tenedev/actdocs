import fs from 'fs';
import path from 'path';
import arglet from 'arglet';
import sylog from 'sylog';
import yaml from 'js-yaml';
import z from 'zod';
import { ctx, cwd } from '../context';
import { ACTDOCS_CONFIG_FILENAME } from '../constant';
import { hasConfig, logZodError } from '../helpers';
import { ActionData } from '../types';
import { ConfigSchema } from '../schemas/config';

export class ConfigService {
  load() {
    this.user();
    this.action();
    this.merge();
  }

  private user() {
    sylog.debug('Loading user configuration for actdocs...');

    try {
      const baseConfig = hasConfig
        ? ConfigSchema.parse(
            JSON.parse(fs.readFileSync(path.join(cwd, ACTDOCS_CONFIG_FILENAME), 'utf-8')),
          )
        : ctx.defaultConfig;

      if (!hasConfig) {
        sylog.info('No user configuration file found, falling back to default configuration.');
      } else {
        sylog.success('User configuration loaded and validated successfully.');
      }

      ctx.userConfig = ConfigSchema.parse(arglet(baseConfig));
    } catch (err) {
      if (err instanceof z.ZodError) {
        sylog.error('Configuration validation failed due to schema errors.');
        logZodError(err);
      } else if (err instanceof Error) {
        sylog.error(`Failed to load or parse actdocs configuration: ${err.message}`);
        if (err.stack) sylog.debug(err.stack);
      } else {
        sylog.error(String(err));
      }

      process.exit(1);
    }
  }

  private action() {
    sylog.debug(`Loading GitHub Action metadata from: ${ctx.userConfig?.actionpath}`);

    try {
      ctx.actionData = yaml.load(
        fs.readFileSync(path.join(cwd, ctx.userConfig?.actionpath as string), 'utf-8'),
      ) as ActionData;

      sylog.success('GitHub Action metadata loaded successfully.');
    } catch (err) {
      if (err instanceof Error) {
        sylog.error(`Failed to read or parse action file: ${err.message}`);
        if (err.stack) sylog.debug(err.stack);
      } else {
        sylog.error(`Unexpected error while loading action file: ${String(err)}`);
      }

      process.exit(1);
    }
  }

  private merge() {
    sylog.debug('Merging user configuration with action metadata...');

    ctx.data = {
      inputs: {
        ...ctx.actionData?.inputs,
        ...ctx.userConfig?.inputs,
      },
      outputs: {
        ...ctx.actionData?.outputs,
        ...ctx.userConfig?.outputs,
      },
    };

    sylog.success('Configuration merge completed successfully.');
  }
}
