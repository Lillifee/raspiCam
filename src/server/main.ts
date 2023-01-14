import http from 'http';
import raspiControl from './control.js';
import { createLogger } from './logger.js';
import { server } from './server.js';
import { createSettingsHelper } from './settings.js';
import { fileWatcher } from './watcher.js';

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
  const control = raspiControl(settingsHelper);

  /**
   * Create photos and thumbnail directory
   */
  const watcher = fileWatcher();

  /**
   * Webserver
   * Start the webserver and serve the website.
   */
  const app = server(control, settingsHelper, watcher);
  httpServer.on('request', app);

  /**
   * Start the web server
   */
  httpServer.listen(8000);
  logger.success('server listening on', 8000);
};

start();
