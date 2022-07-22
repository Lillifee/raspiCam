import { appendUnit } from '../helperFunctions';
import { booleanSetting, enumSetting, numberSetting } from './helper';
import { Setting } from './types';

/**
 * Still settings
 * https://www.raspberrypi.org/documentation/raspbian/applications/camera.md
 */
export const photoSettingDesc = {
  /** Set JPEG quality <0 to 100> */
  quality: numberSetting('Quality', 0, 100, 80, 5),

  /** Set image width <size> 4056  */
  width: numberSetting('Width', 64, 4056, 4056, 1, appendUnit('px')),

  /** Set image height <size> 3040 */
  height: numberSetting('Height', 64, 3040, 3040, 1, appendUnit('px')),

  /**
   * Time before the camera takes picture and shuts down.
   * The program will run for the specified length of time, entered in milliseconds.
   * It then takes the capture and saves it if an output is specified.
   * If a timeout value is not specified, then it is set to 5 seconds (-t 5000).
   * Note that low values (less than 500ms, although it can depend on other settings)
   * may not give enough time for the camera to start up and provide enough frames
   * for the automatic algorithms like AWB and AGC to provide accurate results.
   */
  timeout: numberSetting('Timeout', 100, 20000, 2000, 500),

  /**
   * Encoding to use for output file
   * Valid options are jpg, bmp, gif, and png. Note that unaccelerated image types (GIF, PNG, BMP)
   * will take much longer to save than jpg, which is hardware accelerated.
   * Also note that the filename suffix is completely ignored when deciding the encoding of a file.
   */
  encoding: enumSetting('Encoding', ['jpg', 'bmp', 'gif', 'png'], 'jpg'),

  /** Add raw Bayer data to JPEG metadata */
  raw: booleanSetting('Raw', false),

  /**
   * time-lapse mode
   * The specific value is the time between shots in milliseconds.
   * Note that you should specify %04d at the point in the filename where you want a frame count number to appear.
   * -t 30000 -tl 2000 -o image%04d.jpg
   */
  timelapse: numberSetting('Timelapse', 0, 60 * 60 * 24 * 1000, 3000, 1000),

  /**
   * Additional setting for timelapse duration.
   */
  timelapseTimeout: numberSetting('Duration', 0, 60 * 60 * 24 * 1000, 0, 1000),
};

export type PhotoSettingDesc = typeof photoSettingDesc;
export type PhotoSetting = Setting<PhotoSettingDesc>;

export const photoSettingConverter = (
  settings: Setting<PhotoSettingDesc>,
): Record<string, unknown> => {
  const { timelapseTimeout, ...passThroughSettings } = settings;

  const timeout = settings.timelapse ? timelapseTimeout : settings.timeout;

  return { ...passThroughSettings, timeout, thumb: '320:240:35' };
};
