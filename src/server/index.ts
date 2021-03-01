import http from 'http';
import yargs from 'yargs';
import fs from 'fs';
import raspiStill from './raspi/raspiStill';
import raspiStream from './raspi/raspiStream';
import raspiVid from './raspi/raspiVid';
import { createSettingsHelper, PhotosAbsPath } from './raspi/settingsHelper';
import server from './server';

/**
 * Parse the command line arguments
 */
const argv = yargs
  .option('port', {
    alias: 'p',
    type: 'number',
    description: 'Port number of the express server',
    default: 8000,
  })
  .help()
  .alias('help', 'h').argv;

const start = () => {
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
  // TODO load and apply stored settings
  // settingsHelper.stream.apply(defaultSettings.stream);
  // settingsHelper.still.apply(defaultSettings.still);
  // settingsHelper.vid.apply(defaultSettings.vid);
  // settingsHelper.preview.apply(defaultSettings.preview);

  /**
   * Raspi processes
   * stream - Broadcast the stream to the WebSocket clients.
   * vid - Capture videos using raspivid.
   * still - Capture pictures using raspistill.
   */
  const stream = raspiStream(settingsHelper);
  const still = raspiStill(settingsHelper);
  const vid = raspiVid(settingsHelper);

  stream.start();

  /**
   * Create photos and thumbnail directory
   */
  if (!fs.existsSync(PhotosAbsPath)) {
    fs.mkdirSync(PhotosAbsPath);
  }

  /**
   * Webserver
   * Start the webserver and serve the website.
   */
  const app = server(settingsHelper, stream, still, vid);
  httpServer.on('request', app);

  /**
   * Start the web server
   */
  httpServer.listen(argv.port);
  console.info('Server listening on', argv.port);
};

start();
