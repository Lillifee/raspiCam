import { abbreviateNumber, appendUnit } from '../helperFunctions';
import { enumSetting, numberSetting } from './helper';
import { Setting } from './types';

/**
 * Stream settings
 * https://www.raspberrypi.org/documentation/raspbian/applications/camera.md
 */
export const streamSettingDesc = {
  /**
   * Width of resulting video. This should be between 64 and 1920.
   */
  width: numberSetting('Width', 64, 1920, 1280, 1, appendUnit('px')),

  /**
   * Height of resulting video. This should be between 64 and 1080.
   */
  height: numberSetting('Height', 64, 1080, 720, 1, appendUnit('px')),

  /** At present, the minimum frame rate allowed is 2fps, and the maximum is 30fps. */
  framerate: numberSetting('Framerate', 2, 30, 25, 1, appendUnit('fps')),

  /**
   * Use bits per second, so 10Mbits/s would be -b 10000000.
   * For H264, 1080p30 a high quality bitrate would be 15Mbits/s or more.
   * Maximum bitrate is 25Mbits/s (-b 25000000), but much over 17Mbits/s
   * won't show noticeable improvement at 1080p30.
   */
  bitrate: numberSetting('Bitrate', 0, 20000000, 15000000, 1000000, abbreviateNumber('bits/s', 0)),

  /**
   * Sets the initial quantisation parameter for the stream.
   * Varies from approximately 10 to 40, and will greatly affect the quality of the recording.
   * Higher values reduce quality and decrease file size. Combine this setting with a bitrate of 0 to set a completely variable bitrate.
   */
  qp: numberSetting('Quality quantisation', 2, 40, 20, 1),

  /** Specifies the H264 encoder level to use for encoding. Options are 4, 4.1, and 4.2. */
  level: enumSetting('H264 level', ['4', '4.1', '4.2'], '4'),

  /** Sets the H264 intra-refresh type. */
  irefresh: enumSetting(
    'H264 intra-refresh',
    ['cyclic', 'adaptive', 'both', 'cyclicrows'],
    'cyclic',
  ),
};

export type StreamSettingDesc = typeof streamSettingDesc;
export type StreamSetting = Setting<StreamSettingDesc>;
