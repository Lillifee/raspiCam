import http from 'http';
import { createButtonControl } from './button.js';
import { createRaspiControl } from './control.js';
import { createLogger } from './logger.js';
import { server } from './server.js';
import { createSettingsHelper } from './settings.js';
import { createFileWatcher } from './watcher.js';

const logger = createLogger('server');

const start = () => {
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
  const button = createButtonControl(control, settingsHelper);

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

start();
