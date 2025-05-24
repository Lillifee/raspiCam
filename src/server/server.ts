import express from 'express';
import path from 'path';
import { pipeline } from 'stream';
import { isDefined } from '../shared/helperFunctions';
import { RaspiGallery, RaspiStatus, GenericSettingDesc, Setting } from '../shared/settings/types';
import { Arguments } from './argument';
import { ButtonControl } from './button';
import { curDirName } from './common';
import { RaspiControl } from './control';
import { createLogger } from './logger';
import { SettingsBase, SettingsHelper } from './settings';
import { splitJpeg } from './splitJpeg';
import { Timelapse } from './timelapse';
import { FileWatcher } from './watcher';
import rateLimit from 'express-rate-limit';

const logger = createLogger('server');

type SettingRequest = express.Request<undefined, undefined, Setting<GenericSettingDesc>>;

/**
 * Initialize the express server
 */
export const server = (
  args: Arguments,
  control: RaspiControl,
  settingsHelper: SettingsHelper,
  fileWatcher: FileWatcher,
  buttonControl: ButtonControl,
  timelapse: Timelapse,
): express.Express => {
  let lastSnapshot: Buffer | undefined;

  const app = express();

  // set up rate limiter: maximum of five requests per minute
  const limiter = rateLimit({ windowMs: 60 * 1000, max: 1000 });
  app.use(limiter);

  if (args.c) {
    // Run server insecure and allow CORs
    app.use((_, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
      );
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,OPTIONS,HEAD,DELETE');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      next();
    });
  }

  // Serve the static content from public
  app.use(express.static(path.join(curDirName, 'public')));
  app.use('/photos', express.static(fileWatcher.getPath()));
  app.use(express.json());

  //#region Helper functions

  const getSettings = (x: SettingsBase) => (_: express.Request, res: express.Response) => {
    res.send(x.read());
  };

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
    gpioAvailable: buttonControl.available,
    timelapse: timelapse.getState(),
  });

  //#endregion

  app.get('/api/camera', getSettings(settingsHelper.camera));
  app.post('/api/camera', applyAndRestart(settingsHelper.camera));

  app.get('/api/preview', getSettings(settingsHelper.preview));
  app.post('/api/preview', applyAndRestart(settingsHelper.preview));

  app.get('/api/stream', getSettings(settingsHelper.stream));
  app.post('/api/stream', applyAndRestart(settingsHelper.stream));

  app.get('/api/video', getSettings(settingsHelper.video));
  app.post('/api/video', applySettings(settingsHelper.video));

  app.get('/api/photo', getSettings(settingsHelper.photo));
  app.post('/api/photo', applySettings(settingsHelper.photo));

  app.get('/api/control', getSettings(settingsHelper.control));
  app.post('/api/control', applySettings(settingsHelper.control));

  app.get('/api/application', getSettings(settingsHelper.application));
  app.post('/api/application', applySettings(settingsHelper.application));

  app.get('/api/button', getSettings(settingsHelper.button));
  app.post('/api/button', (req: SettingRequest, res: express.Response) => {
    settingsHelper.button.apply(req.body);
    buttonControl.applySettings();
    res.status(200).send(settingsHelper.button.read());
  });

  app.get('/api/timelapse', getSettings(settingsHelper.timelapse));
  app.post('/api/timelapse', (req: SettingRequest, res: express.Response) => {
    settingsHelper.timelapse.apply(req.body);
    timelapse.applySettings();
    res.status(200).send(settingsHelper.timelapse.read());
  });

  app.get('/api/status', (_, res) => {
    res.send(getStatus());
  });

  app.get('/api/start', (_, res) => {
    control
      .start()
      .then(() => res.status(200).send('ok'))
      .catch(() => res.status(500).send('error'));
  });

  app.get('/api/capture', (_, res) => {
    control
      .start('Photo')
      .then((process) => {
        const outputPath = process?.parameters()?.args.output;
        if (outputPath) {
          res.sendFile(outputPath);
        } else {
          res.status(404).send();
        }
      })
      .catch(() => res.status(500).send('error'));
  });

  app.get('/api/stop', (_, res) => {
    control.stop();
    res.status(200).send('ok');
  });

  app.get('/api/stream/live', (_, res) => {
    const liveStream = control.getStream();

    res.setHeader('Content-Type', 'video/mp4');
    res.writeHead(200);

    pipeline(liveStream, res, (err) => {
      if (!err) return;
      if (err.code === 'ERR_STREAM_PREMATURE_CLOSE') return;
      logger.error('live stream pipeline error', err);
    });
  });

  app.get('/api/stream/mjpeg', (_, res) => {
    const liveStream = control.getStream();

    const boundary = 'streamBoundary';
    res.setHeader('Content-Type', 'multipart/x-mixed-replace;boundary="' + boundary + '"');
    res.setHeader('Connection', 'close');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Cache-Control', 'no-cache, private');
    res.setHeader('Expires', 0);
    res.setHeader('Max-Age', 0);
    res.writeHead(200);

    pipeline(
      liveStream,
      splitJpeg((jpeg) => {
        lastSnapshot = jpeg;
        res.write(`Content-Type: image/jpeg\n`);
        res.write(`Content-Length: ${jpeg.length}\n\n`);
        res.write(jpeg);
        res.write(`\n--${boundary}\n`);
      }),
      (err) => {
        if (!err) return;
        if (err.code === 'ERR_STREAM_PREMATURE_CLOSE') return;
        logger.error('mjpeg stream pipeline error', err);
      },
    );

    res.on('close', () => {
      liveStream.end();
    });
  });

  app.get('/api/stream/mjpeg/snapshot', (_, res) => {
    res.contentType('image/jpeg');
    res.send(lastSnapshot);
  });

  app.get('/api/gallery', (_, res) => {
    const gallery: RaspiGallery = {
      files: fileWatcher.getFiles(),
    };
    res.status(200).send(gallery);
  });

  app.post('/api/gallery/delete', (req, res) => {
    const files =
      Array.isArray(req.body) &&
      req.body.map((value) => (typeof value === 'string' ? value : undefined)).filter(isDefined);

    if (files) fileWatcher.deleteFiles(files);
    res.status(200).send('Gallery files deleted');
  });

  // All other requests to index html
  app.get(/(.*)/, (_, res) => res.sendFile(path.resolve(curDirName, 'public', 'index.html')));

  return app;
};
