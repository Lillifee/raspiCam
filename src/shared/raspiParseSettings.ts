import {
  RaspiCameraSettings,
  RaspiPreviewSettings,
  RaspiVidSettings,
  RaspiStillSettings,
} from './raspiSettings';

interface BaseTypeSetting {
  name: string;
  description?: string;
}

export interface StringTypeSetting extends BaseTypeSetting {
  type: 'STRING';
  defaultValue: string;
  maxLength: number;
  convert: (value: string) => string;
}

export interface NumberTypeSetting extends BaseTypeSetting {
  type: 'NUMBER';
  defaultValue: number;
  minValue: number;
  maxValue: number;
  stepValue: number;
  convert: (value: string) => number;
}

export interface EnumTypeSetting extends BaseTypeSetting {
  type: 'ENUM';
  defaultValue: string;
  possibleValues: string[];
  convert: (value: string) => string;
}

export interface BooleanTypeSetting extends BaseTypeSetting {
  type: 'BOOLEAN';
  defaultValue: boolean;
  convert: (value: string) => boolean;
}

export type ParseSetting =
  | BooleanTypeSetting
  | StringTypeSetting
  | NumberTypeSetting
  | EnumTypeSetting;

export type ParseSettings<T> = {
  [K in keyof T]: ParseSetting;
};

export type ParseSettingTypes = ParseSetting['type'];

const parseBool = (value: string) => value === 'true';

const parseEnum = <T extends string>(enums: T[], fallback: T) => (value: string): T => {
  const index = enums.findIndex((x) => x === value);
  return index >= 0 ? enums[index] : fallback;
};

const numberSetting = (
  name: string,
  minValue: number,
  maxValue: number,
  defaultValue: number,
  stepValue: number,
): NumberTypeSetting => ({
  name,
  minValue,
  maxValue,
  defaultValue,
  stepValue,
  type: 'NUMBER',
  convert: parseFloat,
});

const booleanSetting = (name: string, defaultValue = false): BooleanTypeSetting => ({
  name,
  defaultValue,
  type: 'BOOLEAN',
  convert: parseBool,
});

const enumSetting = (
  name: string,
  possibleValues: string[],
  defaultValue: string,
): EnumTypeSetting => ({
  name,
  possibleValues,
  defaultValue,
  type: 'ENUM',
  convert: parseEnum(possibleValues, defaultValue),
});

// const stringSetting = (name: string, defaultValue = '', maxLength = 50): StringTypeSetting => ({
//   name,
//   maxLength,
//   defaultValue,
//   type: 'STRING',
//   convert: (x) => x,
// });

export type RaspiCameraParseSettings = Partial<ParseSettings<RaspiCameraSettings>>;
export type RaspiPreviewParseSettings = Partial<ParseSettings<RaspiPreviewSettings>>;
export type RaspiVidParseSettings = Partial<ParseSettings<RaspiVidSettings>>;
export type RaspiStillParseSettings = Partial<ParseSettings<RaspiStillSettings>>;

export const raspiCameraParseSettings: RaspiCameraParseSettings = {
  sharpness: numberSetting('Sharpness', -100, 100, 0, 1),
  contrast: numberSetting('Contrast', -100, 100, 0, 1),
  brightness: numberSetting('Brightness', 0, 100, 50, 1),
  saturation: numberSetting('Saturation', -100, 100, 0, 1),
  ISO: numberSetting('ISO', 100, 800, 200, 100),
  ev: numberSetting('EV compensation', -10, 10, 0, 1),
  exposure: enumSetting(
    'Exposure mode',
    [
      'auto',
      'night',
      'nightpreview',
      'backlight',
      'spotlight',
      'sports',
      'snow',
      'beach',
      'verylong',
      'fixedfps',
      'antishake',
      'fireworks',
    ],
    'auto',
  ),

  awb: enumSetting(
    'AWB',
    [
      'off',
      'auto',
      'sun',
      'cloud',
      'shade',
      'tungsten',
      'fluorescent',
      'incandescent',
      'flash',
      'horizon',
      'greyworld',
    ],
    'auto',
  ),
  imxfx: enumSetting(
    'Image effect',
    [
      'none',
      'negative',
      'solarise',
      'posterise',
      'whiteboard',
      'blackboard',
      'sketch',
      'denoise',
      'emboss',
      'oilpaint',
      'hatch',
      'gpen',
      'pastel',
      'watercolour',
      'film',
      'blur',
      'saturation',
      'colourswap',
      'washedout',
      'colourpoint',
      'colourbalance',
      'cartoon',
    ],
    'none',
  ),

  // /** Set colour effect <U:V> e.g. 128:128 */
  // colfx: string;

  metering: enumSetting('Metering mode', ['average', 'spot', 'backlit', 'matrix'], 'average'),

  // /** Set sensor region of interest e.g. 0.5,0.5,0.25,0.25  */
  // roi: string;

  drc: enumSetting('Dynamic range compression', ['off', 'low', 'med', 'high'], 'off'),
  shutter: numberSetting('Shutter time', 0, 2500000, 0, 10000), // Default??
  // /** Use stills capture frame for image statistics */
  // stats: boolean;

  // /** Sets blue and red gains (as floating point numbers) to be applied when -awb off is set e.g. -awbg 1.5,1.2 */
  // awbgains: string;

  analoggain: numberSetting('Analog gain', 0, 12, 1, 0.1),
  digitalgain: numberSetting('Digital gain', 0, 64, 1, 0.1),

  flicker: enumSetting('Flicker', ['off', 'auto', '50hz', '60hz'], 'auto'),
  vstab: booleanSetting('Video stabilisation'),
  hflip: booleanSetting('Horizontal flip', false),
  vflip: booleanSetting('Vertical flip', false),

  mode: numberSetting('Sensor mode', 0, 7, 0, 1),
  // /** Sets a specified sensor mode  */
  // mode:
  //   | '0' // automatic selection
  //   | '1' // 2028x1080	169:90	0.1-50fps	Partial	2x2 binned
  //   | '2' // 2028x1520	4:3	0.1-50fps	Full	2x2 binned
  //   | '3' // 4056x3040	4:3	0.005-10fps	Full	None
  //   | '4'; // 1332x990	74:55	50.1-120fps	Partial	2x2 binned

  camselect: enumSetting('Camera', ['0', '1'], '0'),
};

export const raspiPreviewParseSettings: RaspiPreviewParseSettings = {
  nopreview: booleanSetting('no preview', true),
  fullscreen: booleanSetting('fullscreen', false),
  opacity: numberSetting('opacity', 0, 255, 255, 1),
};

export const raspiVidParseSettings: RaspiVidParseSettings = {
  width: numberSetting('Width', 64, 1920, 1280, 64),
  height: numberSetting('Height', 64, 1080, 720, 64),

  /** At present, the minimum frame rate allowed is 2fps, and the maximum is 30fps. */
  // framerate: number;
  framerate: numberSetting('Framerate', 2, 30, 25, 1),
  bitrate: numberSetting('Bitrate', 0, 25000000, 15000000, 1000000),

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
  // intra: numberSetting('Intra key frame rate', 2, 30, 25),

  /**
   * Sets the initial quantisation parameter for the stream.
   * Varies from approximately 10 to 40, and will greatly affect the quality of the recording.
   * Higher values reduce quality and decrease file size. Combine this setting with a bitrate of 0 to set a completely variable bitrate.
   */
  qp: numberSetting('Quality quantisation', 2, 40, 10, 1),
  // qp: number;

  codec: enumSetting('Codec', ['H264', 'MJPEG'], 'H264'),

  profile: enumSetting('H264 Profile', ['baseline', 'main', 'high'], 'baseline'),
  level: enumSetting('H264 level', ['4', '4.1', '4.2'], '4'),

  irefresh: enumSetting(
    'H264 intra-refresh',
    ['cyclic', 'adaptive', 'both', 'cyclicrows'],
    'cyclic',
  ),

  /**
   * The total length of time that the program will run for.
   * If not specified, the default is 5000ms (5 seconds).
   * If set to 0, the application will run indefinitely until stopped with Ctrl-C.
   */
  timeout: numberSetting('Duration', 0, 60000000, 0, 1000),

  inline: booleanSetting('Insert PPS, SPS headers', false),

  spstimings: booleanSetting('SPS timings', false),

  /**
   * Do timed switches between capture and pause
   * raspivid -o test.h264 -t 25000 -timed 2500,5000
   * 2.5 record – 5 pause - 2.5 record – 5 pause - 2.5 record – 5 pause – 2.5 record
   */
  // timed: string;

  // TODO some missing.. check if we can use it.

  /**
   * Forces a flush of output data buffers as soon as video data is written.
   * This bypasses any OS caching of written data, and can decrease latency.
   */
  flush: booleanSetting('Flush ouput buffers', false),

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

  // raw: booleanSetting('Raw', false),

  // rf: enumSetting('Raw format', ['yuv', 'rgb', 'grey'], 'yuv'),
};

export const raspiStillParseSettings: RaspiStillParseSettings = {
  width: numberSetting('Width', 64, 4056, 4056, 64),
  height: numberSetting('Height', 64, 3040, 3040, 64),
  quality: numberSetting('Quality', 0, 100, 80, 5),

  timeout: numberSetting('Timeout', 1, 60000, 1, 500),
  timelapse: numberSetting('Timelapse', 0, 60000, 0, 500),

  encoding: enumSetting('Encoding', ['jpg', 'bmp', 'gif', 'png'], 'jpg'),

  /** Add raw Bayer data to JPEG metadata */
  raw: booleanSetting('Raw', false),

  /**
   * Link latest frame to filename <filename>
   * Makes a file system link under this name to the latest frame.
   */
  // latest: string;

  /** Output verbose information during run */
  // verbose: string;

  /**
   * Specifies the first frame number in the timelapse.
   * Useful if you have already saved a number of frames, and want to start again at the next frame.
   */
  // framestart: number;

  /**
   * Instead of a simple frame number, the timelapse file names will use a date/time value
   * of the format aabbccddee, where aa is the month, bb is the day of the month,
   * cc is the hour, dd is the minute, and ee is the second.
   */
  // timestamp: boolean;

  /**
   * Set thumbnail parameters (x:y:quality)
   * Allows specification of the thumbnail image inserted into the JPEG file.
   * If not specified, defaults are a size of 64x48 at quality 35.
   */
  // thumb: string | 'none';

  /**
   * Encoding to use for output file
   * Valid options are jpg, bmp, gif, and png. Note that unaccelerated image types (GIF, PNG, BMP)
   * will take much longer to save than jpg, which is hardware accelerated.
   * Also note that the filename suffix is completely ignored when deciding the encoding of a file.
   */

  /**
   * Sets the JPEG restart marker interval to a specific value.
   * Can be useful for lossy transport streams because it allows a broken JPEG file to still be partially displayed.
   */
  restart: booleanSetting('Restart', false),

  /**
   * EXIF tag to apply to captures (format as 'key=value')
   * Allows the insertion of specific EXIF tags into the JPEG image. You can have up to 32 EXIF tag entries.
   */
  // exif: string;

  /**
   * Full preview mode
   * This runs the preview window using the full resolution capture mode.
   * Maximum frames per second in this mode is 15fps, and the preview will have the same field of view as the capture.
   * Captures should happen more quickly, as no mode change should be required. This feature is currently under development.
   */
  fullpreview: booleanSetting('Full preview mode', false),

  /**
   * Specify the output filename.
   */
  // output: string;
};
