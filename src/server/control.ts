import path from 'path';
import internal from 'stream';
import { getIsoDataTime } from '../shared/helperFunctions';
import { RaspiControlStatus, RaspiMode } from '../shared/settings/types';
import { createLogger } from './logger';
import { spawnProcess } from './process';
import { SettingsHelper } from './settings';
import { photosAbsPath } from './watcher';

const logger = createLogger('control');

export interface RaspiControl {
  start: () => void;
  stop: () => void;
  setMode: (mode: RaspiMode) => void;
  restartStream: () => Promise<void>;
  getStatus: () => RaspiControlStatus;
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

  const status: RaspiControlStatus = {
    mode: 'Photo',
  };

  const startStream = async () => {
    actionProcess.stop();
    streamProcess.stop();

    const mode = modeHelper.Stream(settingsHelper);
    logger.info('starting', 'Stream', '...');

    return streamProcess.start(mode.command, mode.settings).catch((e: Error) => {
      logger.error('Stream failed:', e.message);
      status.lastError = e.message;
    });
  };

  const getStream = () => streamProcess.output();

  const restartStream = async () => {
    if (streamProcess.running()) {
      return startStream();
    }
  };

  const setMode = (mode: RaspiMode) => {
    if (actionProcess.running()) stop();
    status.mode = mode;
  };

  const getStatus = () => ({
    ...status,
    running: actionProcess.running(),
    streamRunning: streamProcess.running(),
  });

  const start = () => {
    streamProcess.stop();
    actionProcess.stop();

    status.running = true;
    const mode = modeHelper[status.mode](settingsHelper);
    logger.info('starting', status.mode, '...');

    actionProcess
      .start(mode.command, mode.settings)
      .then(() => startStream())
      .catch((e: Error) => {
        logger.error(status.mode, 'failed:', e.message);
        status.lastError = e.message;
      });
  };

  const stop = () => {
    logger.info('stop', status.mode, '...');
    actionProcess.stop();
  };

  startStream().catch(() => {
    // not needed
  });

  return { start, stop, getStatus, setMode, restartStream, getStream };
};

const modeHelper: {
  [key in RaspiMode | 'Stream']: (
    settingsHelper: SettingsHelper,
  ) => { settings: Record<string, unknown>; command: string };
} = {
  Photo: (settingsHelper: SettingsHelper) => {
    const { camera, preview, photo } = settingsHelper;
    const settings = {
      ...camera.convert(),
      ...preview.convert(),
      ...photo.convert(),
    };

    return {
      command: 'raspistill',
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
      command: 'raspivid',
      settings: {
        ...settings,
        output: path.join(photosAbsPath, `${getIsoDataTime()}.h264`),
      },
    };
  },
  Stream: (settingsHelper: SettingsHelper) => {
    const { camera, preview, stream } = settingsHelper;

    return {
      command: 'raspivid',
      settings: {
        ...camera.convert(),
        ...preview.convert(),
        ...stream.convert(),
        timeout: 0,
        profile: 'baseline',
        inline: true,
        output: '-',
      },
    };
  },
};

export default raspiControl;
