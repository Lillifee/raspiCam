import express from 'express';
import path from 'path';
import { RaspiStill } from './raspi/raspiStill';
import { RaspiStream } from './raspi/raspiStream';
import { RaspiVid } from './raspi/raspiVid';
import { SettingsBase, SettingsHelper } from './raspi/settingsHelper';

/**
 * Initialize the express server
 */
const server = (
  settingsHelper: SettingsHelper,
  stream: RaspiStream,
  still: RaspiStill,
  vid: RaspiVid,
): express.Express => {
  const app = express();

  // Serve the static content from public
  app.use(express.static(path.join(__dirname, './public')));
  app.use(express.json());

  //#region Helper functions

  const stopAll = () => {
    stream.stop();
    still.stop();
    vid.stop();
  };

  const getSettings = (x: SettingsBase) => async (_: express.Request, res: express.Response) =>
    res.send(x.get());

  const applySettings = (x: SettingsBase) => async (req: express.Request, res: express.Response) =>
    x.apply(x.parse(req.body))
      ? res.status(200).send(x.get())
      : res.status(400).send('No changes found');

  const applyAndRestart = (x: SettingsBase) => async (
    req: express.Request,
    res: express.Response,
  ) => {
    const applied = x.apply(x.parse(req.body));
    if (applied) stream.restart();
    return applied ? res.status(200).send(x.get()) : res.status(400).send('No changes found');
  };

  //#endregion

  app.get('/api/camera', getSettings(settingsHelper.camera));
  app.post('/api/camera', applyAndRestart(settingsHelper.camera));

  app.get('/api/preview', getSettings(settingsHelper.preview));
  app.post('/api/preview', applyAndRestart(settingsHelper.preview));

  app.get('/api/stream', getSettings(settingsHelper.stream));
  app.post('/api/stream', applyAndRestart(settingsHelper.stream));

  app.get('/api/vid', getSettings(settingsHelper.vid));
  app.post('/api/vid', applySettings(settingsHelper.vid));

  app.get('/api/still', getSettings(settingsHelper.still));
  app.post('/api/still', applySettings(settingsHelper.still));

  app.get('/api/still/capture', async (_, res) => {
    stopAll();

    await still
      .start()
      .then(() => res.send(`Captured picture`))
      .catch((e) => res.status(400).send(e.message));

    stream.start();
  });

  app.get('/api/vid/start', async (_, res) => {
    stopAll();
    vid.start();
    res.send('video started');
  });

  app.get('/api/vid/stop', async (_, res) => {
    vid.stop();
    stream.start();
    res.send('video stopped');
  });

  return app;
};

export default server;
