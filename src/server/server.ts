import express from 'express';
import path from 'path';
import { RaspiPhoto } from './raspi/raspiPhoto';
import { RaspiStream } from './raspi/raspiStream';
import { RaspiTimelapse } from './raspi/raspiTimelapse';
import { RaspiVid } from './raspi/raspiVid';
import { PhotosAbsPath, SettingsBase, SettingsHelper } from './raspi/settingsHelper';

/**
 * Initialize the express server
 */
const server = (
  settingsHelper: SettingsHelper,
  stream: RaspiStream,
  photo: RaspiPhoto,
  timelapse: RaspiTimelapse,
  vid: RaspiVid,
): express.Express => {
  const app = express();

  // Serve the static content from public
  app.use(express.static(path.join(__dirname, './public')));
  app.use('/photos', express.static(PhotosAbsPath));
  app.use(express.json());

  //#region Helper functions

  const stopAll = () => {
    stream.stop();
    photo.stop();
    vid.stop();
  };

  const getSettings = (x: SettingsBase) => async (_: express.Request, res: express.Response) =>
    res.send(x.read());

  const applySettings = (x: SettingsBase) => async (
    req: express.Request,
    res: express.Response,
  ) => {
    x.apply(req.body);
    res.status(200).send(x.read());
  };

  const applyAndRestart = (x: SettingsBase) => async (
    req: express.Request,
    res: express.Response,
  ) => {
    const applied = x.apply(req.body);
    if (applied) await stream.restart();
    return res.status(200).send(x.read());
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

  app.get('/api/photo', getSettings(settingsHelper.photo));
  app.post('/api/photo', applySettings(settingsHelper.photo));

  app.get('/api/timelapse', getSettings(settingsHelper.timelapse));
  app.post('/api/timelapse', applySettings(settingsHelper.timelapse));

  app.get('/api/timelapse/capture', async (_, res) => {
    stopAll();

    await timelapse
      .start()
      .then((fileName) => res.send(fileName))
      .catch((e) => res.status(400).send(e.message));

    await stream.start();
  });

  app.get('/api/photo/capture', async (_, res) => {
    stopAll();

    await photo
      .start()
      .then((fileName) => res.send(fileName))
      .catch((e) => res.status(400).send(e.message));

    await stream.start();
  });

  app.get('/api/vid/start', async (_, res) => {
    stopAll();
    vid.start();
    res.send('video started');
  });

  app.get('/api/vid/stop', async (_, res) => {
    vid.stop();
    await stream.start();
    res.send('video stopped');
  });

  app.get('/api/stream/live', (_, res) => {
    const liveStream = stream.stream();

    if (liveStream) {
      res.writeHead(200, { 'Content-Type': 'video/mp4' });

      res.on('close', () => {
        res.destroy();
      });

      liveStream.pipe(res);
    } else {
      res.status(503).send('Camera restarting or in use');
    }
  });
  return app;
};

export default server;
