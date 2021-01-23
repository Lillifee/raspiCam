import express from 'express';
import path from 'path';
import {
  ParseOption,
  ParseOptions,
  raspiStillParseOptions,
  raspiVidParseOptions,
} from '../shared/raspiParseOptions';
import { RaspiStill } from './raspi/raspiStill';
import { RaspiStream } from './raspi/raspiStream';
import { RaspiVid } from './raspi/raspiVid';

/**
 * Initialize the express server
 */
const server = (stream: RaspiStream, still: RaspiStill, vid: RaspiVid): express.Express => {
  const app = express();

  // Serve the static content from public
  app.use(express.static(path.join(__dirname, './public')));

  /**
   * Stop all processes
   */
  const stopAll = () => {
    stream.stop();
    still.stop();
    vid.stop();
  };

  /**
   * Parse the request parameters
   */
  const parseParameters = <T>(
    req: express.Request,
    raspiOptions: ParseOptions<Partial<T>>,
  ): Partial<T> =>
    Object.entries(raspiOptions).reduce<Partial<T>>((result, [key, option]) => {
      const qryValue = req.query[key];
      const parseOption = option as ParseOption;
      const value = qryValue && parseOption.convert(qryValue.toString());
      return value ? { ...result, [key]: value } : result;
    }, {});

  /**
   * RaspiStill - capture image
   */
  app.get('/api/still', async (req, res) => {
    const options = parseParameters(req, raspiStillParseOptions);

    stopAll();
    await still.start(options).catch((err) => res.send(err));
    stream.start();
    res.end();
  });

  /**
   * RaspiStream - Stop and restart with settings
   */
  app.get('/api/stream', async (req, res) => {
    const options = parseParameters(req, raspiVidParseOptions);

    stopAll();
    stream.start(options);
    res.end();
  });

  /**
   * RaspiVid - start video capture
   */
  app.get('/api/vid/start', async (req, res) => {
    const options = parseParameters(req, raspiVidParseOptions);

    stopAll();
    vid.start(options);
    res.end();
  });

  /**
   * RaspiVid - stop video capture
   */
  app.get('/api/vid/stop', async (_, res) => {
    vid.stop();
    stream.start();
    res.end();
  });

  return app;
};

export default server;
