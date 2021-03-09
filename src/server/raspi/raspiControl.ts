import internal from 'stream';
import { RaspiControlStatus, RaspiMode } from '../../shared/settings/types';
import raspiPhoto from './raspiPhoto';
import raspiStream from './raspiStream';
import raspiTimelapse from './raspiTimelapse';
import raspiVid from './raspiVid';
import { SettingsHelper } from './settingsHelper';

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
  const stream = raspiStream(settingsHelper);
  const photo = raspiPhoto(settingsHelper);
  const timelapse = raspiTimelapse(settingsHelper);
  const vid = raspiVid(settingsHelper);

  const status: RaspiControlStatus = {
    mode: 'Photo',
    running: false,
  };

  const stopAll = () => {
    status.running = false;
    stream.stop();
    photo.stop();
    timelapse.stop();
    vid.stop();
  };

  const stop = async () => {
    stopAll();
    await stream.start();
  };

  const getStream = () => stream.stream();
  const restartStream = () => stream.restart();

  const setMode = (mode: RaspiMode) => {
    if (status.running) stop();
    status.mode = mode;
  };

  const getStatus = () => status;

  const start = () => {
    stopAll();
    status.running = true;

    switch (status.mode) {
      case 'Photo':
        photo
          .start()
          .then((fileName) => (status.lastImagePath = fileName))
          .finally(() => stop())
          .catch((e) => (status.lastError = e.message));
        break;

      case 'Timelapse':
        timelapse
          .start()
          .then((fileName) => (status.lastImagePath = fileName))
          .finally(() => stop())
          .catch((e) => (status.lastError = e.message));

        break;

      case 'Video':
        vid
          .start()
          .finally(() => stop())
          .catch((e) => (status.lastError = e.message));
        break;

      default:
        break;
    }
  };

  stream.start();
  return { start, stop, getStatus, setMode, restartStream, getStream };
};

export default raspiControl;
