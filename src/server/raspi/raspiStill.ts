import { ChildProcess, exec, spawn } from 'child_process';
import path from 'path';
import { getIsoDataTime } from '../../shared/helperFunctions';
import { defaultSettings } from '../../shared/settings';
import { getSpawnArgs, stopProcess } from './processHelper';
import { PhotosAbsPath, PhotosPath, SettingsHelper } from './settingsHelper';

export interface RaspiStill {
  start: () => Promise<string>;
  stop: () => void;
}

/**
 * Extract thumbnail using exiv2
 */
const extractThumbnail = async (fileBaseName: string, fileExtension: string): Promise<string> => {
  const filePath = path.join(PhotosAbsPath, `${fileBaseName}.${fileExtension}`);
  const thumbnailPath = path.join(PhotosPath, `${fileBaseName}-preview1.${fileExtension}`);

  return new Promise((resolve, reject) =>
    exec(`exiv2 -ep1 ${filePath}`, (err, _, stderr) => {
      err || stderr ? reject(err || stderr) : resolve(thumbnailPath);
    }),
  );
};

/**
 * RaspiStill
 */
const raspiStill = (settingsHelper: SettingsHelper): RaspiStill => {
  let process: ChildProcess | undefined;

  /**
   * Start photo capture
   */
  const start = (): Promise<string> => {
    const { camera, preview, still } = settingsHelper;
    const overrideSetting = { thumb: '320:240:35' }; // TODO calculate}

    const settings = {
      ...defaultSettings.still,
      ...camera.convert(),
      ...preview.convert(),
      ...still.convert(),
      ...overrideSetting,
    };

    const fileBaseName = getIsoDataTime();
    const fileExtension = settings.encoding || 'jpg';
    const fileCounter = settings.timelapse ? `-%04d` : '';
    const fileName = `${fileBaseName}${fileCounter}.${fileExtension}`;

    const spawnArgs = getSpawnArgs({
      ...settings,
      output: path.join(PhotosAbsPath, fileName),
    });

    console.info('raspistill', spawnArgs.join(' '));

    // Spawn the raspiStill
    return new Promise<string>((resolve, reject) => {
      process = spawn('raspistill', [...spawnArgs], {});
      process.stdout?.on('data', (data) => console.log('raspistill', data));
      process.on('exit', () =>
        extractThumbnail(`${fileBaseName}${fileCounter ? '-0001' : ''}`, fileExtension)
          .then(resolve)
          .catch(reject),
      );
      process.on('error', (e) => reject(e));
    });
  };

  /**
   * Stop photo capture
   */
  const stop = () => stopProcess(process);

  return { start, stop };
};

export default raspiStill;
