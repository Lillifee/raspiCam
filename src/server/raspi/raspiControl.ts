import internal from 'stream';
import { RaspiControlStatus, RaspiMode } from '../../shared/settings/types';
import { RaspiPhoto } from './raspiPhoto';
import { RaspiStream } from './raspiStream';
import { RaspiTimelapse } from './raspiTimelapse';
import { RaspiVid } from './raspiVid';

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
const raspiControl = (
  stream: RaspiStream,
  photo: RaspiPhoto,
  timelapse: RaspiTimelapse,
  vid: RaspiVid,
): RaspiControl => {
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
        timelapse.start();
        break;

      case 'Video':
        vid.start();
        break;

      default:
        break;
    }
  };

  const stop = () => {
    stopAll();
    stream.start();
  };

  return { start, stop, getStatus, setMode, restartStream: restartStream, getStream };
};

export default raspiControl;
