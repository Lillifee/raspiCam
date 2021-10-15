import express from 'express';
import path from 'path';
import {
  RaspiGallery,
  RaspiControlStatus,
  RaspiStatus,
  raspiModes,
  GenericSettingDesc,
  Setting,
} from '../shared/settings/types';
import { RaspiControl } from './control';
import { SettingsBase, SettingsHelper } from './settings';
import { FileWatcher } from './watcher';

type SettingRequest = express.Request<undefined, undefined, Setting<GenericSettingDesc>>;

/**
 * Initialize the express server
 */
const server = (
  control: RaspiControl,
  settingsHelper: SettingsHelper,
  fileWatcher: FileWatcher,
): express.Express => {
  const app = express();

  // Serve the static content from public
  app.use(express.static(path.join(__dirname, './public')));
  app.use('/photos', express.static(fileWatcher.getPath()));
  app.use(express.json());

  //#region Helper functions

  const getSettings = (x: SettingsBase) => (_: express.Request, res: express.Response) =>
    res.send(x.read());

  const applySettings = (x: SettingsBase) => (req: SettingRequest, res: express.Response) => {
    x.apply(req.body);
    res.status(200).send(x.read());
  };

  const applyAndRestart = (x: SettingsBase) => (req: SettingRequest, res: express.Response) => {
    const applied = x.apply(req.body);
    const sendSettings = () => res.status(200).send(x.read());
    if (applied) {
      control.restartStream().then(sendSettings).catch(sendSettings);
    } else {
      sendSettings();
    }
  };

  const getStatus = (): RaspiStatus => ({
    ...control.getStatus(),
    latestFile: fileWatcher.getLatestFile(),
  });

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

  app.get('/api/control', (_, res) => {
    res.send(getStatus());
  });

  app.post('/api/control', (req, res) => {
    const body = req.body as RaspiControlStatus;
    if (raspiModes.includes(body.mode)) {
      control.setMode(body.mode);
    }
    res.send(getStatus());
  });

  app.get('/api/start', (_, res) => {
    control.start();
    res.status(200).send('starting...');
  });

  app.get('/api/stop', (_, res) => {
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

  app.get('/api/gallery', (_, res) => {
    const gallery: RaspiGallery = {
      files: fileWatcher.getFiles(),
    };
    res.status(200).send(gallery);
  });

  return app;
};

export default server;
