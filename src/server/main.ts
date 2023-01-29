import http from 'http';
import { createButtonControl } from './button';
import { createRaspiControl } from './control';
import { createLogger } from './logger';
import { server } from './server';
import { createSettingsHelper } from './settings';
import { createFileWatcher } from './watcher';
import yargs from 'yargs/yargs';

const logger = createLogger('server');

const args = yargs(process.argv.slice(2))
  .options({
    p: { type: 'number', alias: 'port', default: 8000 },
  })
  .parseSync();

const start = async () => {
  logger.info('starting services...');

  /**
   * https server
   * Create an http server to bind the express server.
   */
  const httpServer = http.createServer();

  /**
   * Settings helper
   * Maintain the settings for all processes
   */
  const settingsHelper = createSettingsHelper();

  /**
   * Raspi control
   * Control (start and stop) the different processes
   */
  const control = createRaspiControl(settingsHelper);

  /**
   * Create button control
   */
  const button = await createButtonControl(control, settingsHelper);

  /**
   * Create photos and thumbnail directory
   */
  const watcher = createFileWatcher();

  /**
   * Webserver
   * Start the webserver and serve the website.
   */
  const app = server(control, settingsHelper, watcher, button);
  httpServer.on('request', app);

  /**
   * Start the web server
   */
  httpServer.listen(args.p);
  logger.success('server listening on', args.p);
};

start().catch((error) => logger.error('server startup error', error));
