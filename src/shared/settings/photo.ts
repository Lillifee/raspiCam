import { appendUnit } from '../helperFunctions';
import { numberSetting, enumSetting, booleanSetting } from './helper';
import { Setting } from './types';

/**
 * Still settings
 * https://www.raspberrypi.org/documentation/raspbian/applications/camera.md
 */
export const photoSettingDesc = {
  /** Set image width <size> 4056  */
  width: numberSetting('Width', 64, 4056, 4056, 1, appendUnit('px')),

  /** Set image height <size> 3040 */
  height: numberSetting('Height', 64, 3040, 3040, 1, appendUnit('px')),

  /** Set JPEG quality <0 to 100> */
  quality: numberSetting('Quality', 0, 100, 80, 5),

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

  // /**
  //  * Sets the JPEG restart marker interval to a specific value.
  //  * Can be useful for lossy transport streams because it allows a broken JPEG file to still be partially displayed.
  //  */
  // restart: booleanSetting('Restart', false),

  // /**
  //  * Full preview mode
  //  * This runs the preview window using the full resolution capture mode.
  //  * Maximum frames per second in this mode is 15fps, and the preview will have the same field of view as the capture.
  //  * Captures should happen more quickly, as no mode change should be required. This feature is currently under development.
  //  */
  // fullpreview: booleanSetting('Full preview mode', false),

  /**
   * Link latest frame to filename <filename>
   * Makes a file system link under this name to the latest frame.
   */
  // latest: string;

  /** Output verbose information during run */
  // verbose: string;

  /**
   * Set thumbnail parameters (x:y:quality)
   * Allows specification of the thumbnail image inserted into the JPEG file.
   * If not specified, defaults are a size of 64x48 at quality 35.
   */
  // thumb: string | 'none';

  /**
   * EXIF tag to apply to captures (format as 'key=value')
   * Allows the insertion of specific EXIF tags into the JPEG image. You can have up to 32 EXIF tag entries.
   */
  // exif: string;

  /**
   * Specify the output filename.
   */
  // output: string;
};

export type PhotoSettingDesc = typeof photoSettingDesc;

export const photoSettingConverter = (
  settings: Setting<PhotoSettingDesc>,
): Record<string, unknown> => ({ ...settings, thumb: '320:240:35' });
