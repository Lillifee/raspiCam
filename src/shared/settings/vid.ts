import { appendUnit } from '../helperFunctions';
import { enumSetting, numberSetting, booleanSetting } from './helper';
import { streamSettingDesc } from './stream';

/**
 * Vid settings
 * https://www.raspberrypi.org/documentation/raspbian/applications/camera.md
 */
export const vidSettingDesc = {
  ...streamSettingDesc,
  /**
   * Width of resulting video. This should be between 64 and 1920.
   */
  width: numberSetting('Width', 64, 1920, 1920, 1, appendUnit('px')),

  /**
   * Height of resulting video. This should be between 64 and 1080.
   */
  height: numberSetting('Height', 64, 1080, 1080, 1, appendUnit('px')),

  /**
   * Specifies the encoder codec to use.
   * H264 can encode up to 1080p, whereas MJPEG can encode upto the sensor size,
   * but at decreased framerates due to the higher processing and storage requirements.
   */
  codec: enumSetting('Codec', ['H264', 'MJPEG'], 'H264'),

  /** Specify H264 profile to use for encoding */
  profile: enumSetting('H264 Profile', ['baseline', 'main', 'high'], 'baseline'),

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

  /** Insert timing information into the SPS block. */
  spstimings: booleanSetting('SPS timings', false),

  /**
   * Forces a flush of output data buffers as soon as video data is written.
   * This bypasses any OS caching of written data, and can decrease latency.
   */
  flush: booleanSetting('Flush ouput buffers', false),

  /**
   * Specify the output filename.
   * To connect to a remote IPv4 host, use tcp or udp followed by the required IP Address.
   * e.g. tcp://192.168.1.2:1234 or udp://192.168.1.2:1234.
   */
  // output: string;

  /**
   * When using a network connection as the data sink, this option will make the sytem wait
   * for a connection from the remote system before sending data.
   */
  // listen: boolean;

  /**
   * This options cycles through the range of camera options.
   * The time between cycles should be specified as a millisecond value.
   */
  // demo: number;

  /**  Specify the intra refresh period (key frame rate/GoP) */
  // intra: number;

  /**
   * Do timed switches between capture and pause
   * raspivid -o test.h264 -t 25000 -timed 2500,5000
   * 2.5 record – 5 pause - 2.5 record – 5 pause - 2.5 record – 5 pause – 2.5 record
   */
  // timed: string;

  /*
   * Rather than creating a single file, the file is split into segments of
   * approximately the number of milliseconds specified.
   * -o video_%c.h264
   */
  // segment: number;

  /*
   * When outputting segments, this is the maximum the segment number
   * can reach before it's reset to 1, giving the ability to keep recording segments,
   * but overwriting the oldest one. So if set to 4, in the segment example above,
   * the files produced will be video0001.h264, video0002.h264, video0003.h264, and video0004.h264.
   * Once video0004.h264 is recorded, the count will reset to 1, and video0001.h264 will be overwritten.
   */
  // wrap: number;

  /*
   * When outputting segments, this is the initial segment number, giving the ability
   * to resume a previous recording from a given segment. The default value is 1.
   */
  // start: number;

  /*
   * Specify the output file name for any raw data files requested.
   */
  // raw: boolean;

  /*
   * Specify the raw format to be used if raw output requested.
   * Options as yuv, rgb, and grey. grey simply saves the Y channel of the YUV image.
   */
  // rf: 'yuv' | 'rgb' | 'grey';
};

export type VidSettingDesc = typeof vidSettingDesc;
