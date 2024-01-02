import { abbreviateNumber, appendUnit } from '../helperFunctions';
import { booleanSetting, numberSetting } from './helper';
import { streamSettingDesc } from './stream';
import { Setting } from './types';

/**
 * Video settings
 * https://www.raspberrypi.org/documentation/raspbian/applications/camera.md
 */
export const videoSettingDesc = {
  ...streamSettingDesc,
  /**
   * Width of resulting video. This should be between 64 and 1920.
   */
  width: numberSetting('Width', 64, 2304, 1920, 1, appendUnit('px')),

  /**
   * Height of resulting video. This should be between 64 and 1080.
   */
  height: numberSetting('Height', 64, 1520, 1080, 1, appendUnit('px')),

  /**
   * Use bits per second, so 10Mbits/s would be -b 10000000.
   * For H264, 1080p30 a high quality bitrate would be 15Mbits/s or more.
   * Maximum bitrate is 25Mbits/s (-b 25000000), but much over 17Mbits/s
   * won't show noticeable improvement at 1080p30.
   */
  bitrate: numberSetting('Bitrate', 0, 25000000, 15000000, 1000000, abbreviateNumber('bits/s', 0)),

  /**
   * The total length of time that the program will run for.
   * If not specified, the default is 5000ms (5 seconds).
   * If set to 0, the application will run indefinitely until stopped with Ctrl-C.
   */
  timeout: numberSetting('Duration', 0, 60000000, 0, 1000),

  /**
   * Insert PPS, SPS headers (IH)
   * Forces the stream to include PPS and SPS headers on every I-frame.
   * Needed for certain streaming cases e.g. Apple HLS.
   * These headers are small, so don't greatly increase the file size.
   */
  inline: booleanSetting('Insert PPS, SPS headers', false),

  /**
   * Forces a flush of output data buffers as soon as video data is written.
   * This bypasses any OS caching of written data, and can decrease latency.
   */
  flush: booleanSetting('Flush output buffers', false),
};

export type VideoSettingDesc = typeof videoSettingDesc;
export type VideoSetting = Setting<VideoSettingDesc>;
