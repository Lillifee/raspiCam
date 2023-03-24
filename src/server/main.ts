import http from 'http';
import { parseArguments } from './argument';
import { createButtonControl } from './button';
import { createTimelapse } from './timelapse';
import { createRaspiControl } from './control';
import { createLogger } from './logger';
import { server } from './server';
import { createSettingsHelper } from './settings';
import { createFileWatcher } from './watcher';

const logger = createLogger('server');

const start = async () => {
  logger.info('starting services...');

  /**
   * Parse the startup arguments
   */
  const args = parseArguments();

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
   * Create timelapse
   */
  const timelapse = createTimelapse(control, settingsHelper);

  /**
   * Create photos and thumbnail directory
   */
  const watcher = createFileWatcher();

  /**
   * Webserver
   * Start the webserver and serve the website.
   */
  const app = server(args, control, settingsHelper, watcher, button, timelapse);
  httpServer.on('request', app);

  /**
   * Start the web server
   */
  httpServer.listen(args.p);
  logger.success('server listening on', args.p);
};

start().catch((error) => logger.error('server startup error', error));
