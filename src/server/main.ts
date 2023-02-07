import http from 'http';
import { createButtonControl } from './button';
import { createRaspiControl } from './control';
import { createLogger } from './logger';
import { server } from './server';
import { createSettingsHelper } from './settings';
import { createFileWatcher } from './watcher';

const logger = createLogger('server');

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
  httpServer.listen(8000);
  logger.success('server listening on', 8000);
};

start().catch((error) => logger.error('server startup error', error));
