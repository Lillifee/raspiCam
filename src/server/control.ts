import path from 'path';
import internal from 'stream';
import { getIsoDataTime } from '../shared/helperFunctions';
import { RaspiMode, RaspiStatus } from '../shared/settings/types';
import { createLogger } from './logger';
import { spawnProcess } from './process';
import { SettingsHelper } from './settings';
import { photosAbsPath } from './watcher';

const logger = createLogger('control');

export interface RaspiControl {
  start: () => void;
  stop: () => void;
  restartStream: () => Promise<void>;
  getStatus: () => RaspiStatus;
  getStream: () => internal.Readable | null | undefined;
}

/**
 * RaspiControl
 */
const raspiControl = (settingsHelper: SettingsHelper): RaspiControl => {
  const actionProcess = spawnProcess();
  const streamProcess = spawnProcess({
    stdioOptions: ['ignore', 'pipe', 'inherit'],
    resolveOnData: true,
  });

  const startStream = async () => {
    actionProcess.stop();
    streamProcess.stop();

    const stream = modeHelper.Stream(settingsHelper);
    logger.info('starting', 'Stream', '...');

    return streamProcess.start(stream.command, stream.settings).catch((e: Error) => {
      logger.error('stream failed:', e.message);
    });
  };

  const getStream = () => streamProcess.output();

  const restartStream = async () => {
    if (streamProcess.running()) {
      return startStream();
    }
  };

  const getStatus = () => ({
    running: actionProcess.running(),
    streamRunning: streamProcess.running(),
  });

  const start = () => {
    streamProcess.stop();
    actionProcess.stop();

    const control = settingsHelper.control.convert();
    if (!control.mode) return;

    const mode = modeHelper[control.mode](settingsHelper);
    logger.info('starting', control.mode, '...');

    actionProcess
      .start(mode.command, mode.settings)
      .then(() => startStream())
      .catch((e: Error) => {
        logger.error(control.mode, 'failed:', e.message);
      });
  };

  const stop = () => {
    logger.info('stopping', '...');
    actionProcess.stop();
  };

  const control = settingsHelper.control.convert();
  if (control.captureStartup) {
    start();
  } else {
    startStream().catch(() => {
      // not needed
    });
  }

  return { start, stop, getStatus, restartStream, getStream };
};

const modeHelper: {
  [key in RaspiMode | 'Stream']: (settingsHelper: SettingsHelper) => {
    settings: Record<string, unknown>;
    command: 'libcamera-still' | 'libcamera-vid';
  };
} = {
  Photo: (settingsHelper: SettingsHelper) => {
    const { camera, preview, photo } = settingsHelper;
    const settings = {
      ...camera.convert(),
      ...preview.convert(),
      ...photo.convert(),
    };

    return {
      command: 'libcamera-still',
      settings: {
        ...settings,
        output: path.join(photosAbsPath, `${getIsoDataTime()}-%04d.${settings.encoding || 'jpg'}`),
      },
    };
  },
  Video: (settingsHelper: SettingsHelper) => {
    const { camera, preview, vid } = settingsHelper;
    const settings = {
      ...camera.convert(),
      ...preview.convert(),
      ...vid.convert(),
    };

    return {
      command: 'libcamera-vid',
      settings: {
        ...settings,
        output: path.join(photosAbsPath, `${getIsoDataTime()}.h264`),
      },
    };
  },
  Stream: (settingsHelper: SettingsHelper) => {
    const { camera, preview, stream } = settingsHelper;
    const settings = {
      ...camera.convert(),
      ...preview.convert(),
      ...stream.convert(),
    };

    return {
      command: 'libcamera-vid',
      settings: {
        ...settings,
        timeout: 0,
        profile: 'baseline',
        inline: true,
        output: '-',
      },
    };
  },
};

export default raspiControl;
