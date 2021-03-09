import express from 'express';
import path from 'path';
import { raspiModes } from '../shared/settings/types';
import { RaspiControl } from './raspi/raspiControl';
import { PhotosAbsPath, SettingsBase, SettingsHelper } from './raspi/settingsHelper';

/**
 * Initialize the express server
 */
const server = (control: RaspiControl, settingsHelper: SettingsHelper): express.Express => {
  const app = express();

  // Serve the static content from public
  app.use(express.static(path.join(__dirname, './public')));
  app.use('/photos', express.static(PhotosAbsPath));
  app.use(express.json());

  //#region Helper functions

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
    if (applied) await control.restartStream();
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

  app.get('/api/control', async (_, res) => res.send(control.getStatus()));

  app.post('/api/control', async (req, res) => {
    if (raspiModes.includes(req.body.mode)) {
      control.setMode(req.body.mode);
    }
    res.send(control.getStatus());
  });

  app.get('/api/status', async (_, res) => {
    res.send(control.getStatus());
  });

  app.get('/api/start', async (_, res) => {
    control.start();
    res.status(200).send('starting...');
  });

  app.get('/api/stop', async (_, res) => {
    control.stop();
    res.status(200).send('stopping...');
  });

  app.get('/api/stream/live', (_, res) => {
    const liveStream = control.getStream();

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
