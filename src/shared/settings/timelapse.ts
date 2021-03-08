import { numberSetting } from './helper';

/**
 * Still settings
 * https://www.raspberrypi.org/documentation/raspbian/applications/camera.md
 */
export const timelapseSettingDesc = {
  /**
   * time-lapse mode
   * The specific value is the time between shots in milliseconds.
   * Note that you should specify %04d at the point in the filename where you want a frame count number to appear.
   * -t 30000 -tl 2000 -o image%04d.jpg
   */
  timelapse: numberSetting('Timelapse', 0, 60 * 60 * 24 * 1000, 3000, 1000),

  /**
   * Time before the camera takes picture and shuts down.
   * The program will run for the specified length of time, entered in milliseconds.
   * It then takes the capture and saves it if an output is specified.
   * If a timeout value is not specified, then it is set to 5 seconds (-t 5000).
   * Note that low values (less than 500ms, although it can depend on other settings)
   * may not give enough time for the camera to start up and provide enough frames
   * for the automatic algorithms like AWB and AGC to provide accurate results.
   */
  timeout: numberSetting('Duration', 0, 60 * 60 * 24 * 1000, 0, 1000),
};

export type TimelapseSettingDesc = typeof timelapseSettingDesc;
