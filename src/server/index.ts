import http from 'http';
import yargs from 'yargs';
import fs from 'fs';
import raspiPhoto from './raspi/raspiPhoto';
import raspiStream from './raspi/raspiStream';
import raspiVid from './raspi/raspiVid';
import { createSettingsHelper, PhotosAbsPath } from './raspi/settingsHelper';
import server from './server';
import raspiTimelapse from './raspi/raspiTimelapse';
import raspiControl from './raspi/raspiControl';

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
  // settingsHelper.stream.apply(initialSettings.stream);
  // settingsHelper.still.apply(initialSettings.still);
  // settingsHelper.vid.apply(initialSettings.vid);
  // settingsHelper.preview.apply(initialSettings.preview);

  /**
   * Raspi processes
   * stream - Stream using raspivid.
   * vid - Capture videos using raspivid.
   * photo - Capture pictures using raspistill.
   */
  const stream = raspiStream(settingsHelper);
  const photo = raspiPhoto(settingsHelper);
  const timelapse = raspiTimelapse(settingsHelper);
  const vid = raspiVid(settingsHelper);
  const control = raspiControl(stream, photo, timelapse, vid);

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
  const app = server(control, settingsHelper);
  httpServer.on('request', app);

  /**
   * Start the web server
   */
  httpServer.listen(argv.port);
  console.info('Server listening on', argv.port);
};

start();
