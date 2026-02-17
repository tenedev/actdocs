import sylog from 'sylog';
import { printBanner, printHelp } from './helpers';
import { Flag } from './types';
import { APP_VERSION } from './meta';
import { init } from './commands/init';
import { ConfigService } from './services/config';
import { RenderService } from './services/render';

export class Actdocs {
  private services!: {
    config: ConfigService;
    render: RenderService;
  };

  constructor(private readonly args: Flag[]) {
    this.services = {
      config: new ConfigService(),
      render: new RenderService(),
    };
  }

  async run() {
    this.handleFlags();

    if (this.isInit()) init();

    await printBanner();

    this.services.config.load();
    this.services.render.run();
  }

  private handleFlags(): void {
    if (this.args.includes('-D') || process.env.DEBUG) {
      sylog.enableDebug();
    }

    if (this.args.includes('-v') || this.args.includes('--version')) {
      console.log(APP_VERSION);
      process.exit(0);
    }

    if (this.args.includes('-h') || this.args.includes('--help')) {
      printHelp();
      process.exit(0);
    }
  }

  private isInit() {
    return this.args[0] === 'init';
  }
}
