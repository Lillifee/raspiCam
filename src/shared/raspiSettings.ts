// For more information check:
// https://www.raspberrypi.org/documentation/raspbian/applications/camera.md

/**
 * Camera settings
 */
export interface RaspiCameraSettings {
  /** Set image sharpness (-100 - 100) */
  sharpness: number;

  /** Set image contrast (-100 - 100) */
  contrast: number;

  /** Set image brightness (0 - 100) */
  brightness: number;

  /** Set image saturation (-100 - 100) */
  saturation: number;

  /** Set capture ISO (100 - 800) */
  ISO: number;

  /** Turn on video stabilisation */
  vstab: boolean;

  /** Set EV compensation (-10 - 10) */
  ev: number;

  /** Set exposure mode */
  exposure:
    | 'auto'
    | 'night'
    | 'nightpreview'
    | 'backlight'
    | 'spotlight'
    | 'sports'
    | 'snow'
    | 'beach'
    | 'verylong'
    | 'fixedfps'
    | 'antishake'
    | 'fireworks';

  /** Set flicker avoidance mode */
  flicker: 'off' | 'auto' | '50hz' | '60hz';

  /**Set Automatic White Balance (AWB) mode */
  awb:
    | 'off'
    | 'auto'
    | 'sun'
    | 'cloud'
    | 'shade'
    | 'tungsten'
    | 'fluorescent'
    | 'incandescent'
    | 'flash'
    | 'horizon'
    | 'greyworld';

  /** Set image effect*/
  imxfx:
    | 'none'
    | 'negative'
    | 'solarise'
    | 'posterise'
    | 'whiteboard'
    | 'blackboard'
    | 'sketch'
    | 'denoise'
    | 'emboss'
    | 'oilpaint'
    | 'hatch'
    | 'gpen'
    | 'pastel'
    | 'watercolour'
    | 'film'
    | 'blur'
    | 'saturation'
    | 'colourswap'
    | 'washedout'
    | 'colourpoint'
    | 'colourbalance'
    | 'cartoon';

  /** Set colour effect <U:V> e.g. 128:128 */
  colfx: string;

  /** Set metering mode */
  metering: 'average' | 'spot' | 'backlit' | 'matrix';

  /** Set horizontal flip */
  hflip: boolean;

  /** Set vertical flip */
  vflip: boolean;

  /** Set sensor region of interest e.g. 0.5,0.5,0.25,0.25  */
  roi: string;

  /** Set shutter speed/time in microseconds */
  shutter: number;

  /** Enable/disable dynamic range compression */
  drc: 'off' | 'low' | 'med' | 'high';

  /** Use stills capture frame for image statistics */
  stats: boolean;

  /** Sets blue and red gains (as floating point numbers) to be applied when -awb off is set e.g. -awbg 1.5,1.2 */
  awbgains: string;

  /** Sets the analog gain value directly on the sensor  */
  analoggain: number;

  /** Sets the digital gain value applied by the ISP 1.0 to 64.0 (over about 4.0 will produce overexposed images) */
  digitalgain: number;

  /** Sets a specified sensor mode  */
  mode:
    | '0' // automatic selection
    | '1' // 2028x1080	169:90	0.1-50fps	Partial	2x2 binned
    | '2' // 2028x1520	4:3	0.1-50fps	Full	2x2 binned
    | '3' // 4056x3040	4:3	0.005-10fps	Full	None
    | '4'; // 1332x990	74:55	50.1-120fps	Partial	2x2 binned

  /** Selects which camera to use on a multi-camera system. Use 0 or 1. */
  camselect: number;

  /** Selects which camera to use on a multi-camera system. Use 0 or 1. */
  annotate:
    | string
    | '4' //	Time	20:09:33
    | '8' //	Date	10/28/15
    | '12' //	4+8=12 Show the date(4) and time(8)	20:09:33 10/28/15
    | '16' //	Shutter Settings
    | '32' //	CAF Settings
    | '64' //	Gain Settings
    | '128' //	Lens Settings
    | '256' //	Motion Settings
    | '512' //	Frame Number
    | '1024'; //	Black Background

  /** Specifies annotation size, text colour, and background colour. e.g. 32,0xff,0x808000 */
  annotateex: string;

  /** Select the specified stereo imaging mode */
  stereo: 'off' | 'sbs' | 'tb';

  /** Halves the width and height of the stereo image. */
  decimate: 'off' | 'sbs' | 'tb';

  /** Retrieves the current camera settings and writes them to stdout */
  settings: boolean;
}

/**
 * Preview settings
 */
export interface RaspiPreviewSettings {
  /**
   * Preview window settings <'x,y,w,h'>
   * Allows the user to define the size of the preview window and its location on the screen.
   * Note this will be superimposed over the top of any other windows/graphics.
   */
  preview: string;

  /**
   * Fullscreen preview mode
   * Forces the preview window to use the whole screen.
   * Note that the aspect ratio of the incoming image will be retained, so there may be bars on some edges.
   */
  fullscreen: boolean;

  /**
   * Do not display a preview window
   * Disables the preview window completely. Note that even though the preview is disabled,
   * the camera will still be producing frames, so will be using power.
   */
  nopreview: boolean;

  /**
   * Set preview window opacity
   * Sets the opacity of the preview windows. 0 = invisible, 255 = fully opaque.
   */
  opacity: number;
}

/**
 * RaspiStill settings
 */
export interface RaspiStillSettings {
  /** Set image width <size> 4056  */
  width: number;

  /** Set image height <size> 3040 */
  height: number;

  /** Set JPEG quality <0 to 100> */
  quality: number;

  /** Add raw Bayer data to JPEG metadata */
  raw: boolean;

  /**
   * Link latest frame to filename <filename>
   * Makes a file system link under this name to the latest frame.
   */
  latest: string;

  /** Output verbose information during run */
  verbose: string;

  /**
   * Time before the camera takes picture and shuts down.
   * The program will run for the specified length of time, entered in milliseconds.
   * It then takes the capture and saves it if an output is specified.
   * If a timeout value is not specified, then it is set to 5 seconds (-t 5000).
   * Note that low values (less than 500ms, although it can depend on other settings)
   * may not give enough time for the camera to start up and provide enough frames
   * for the automatic algorithms like AWB and AGC to provide accurate results.
   */
  timeout: number;

  /**
   * time-lapse mode
   * The specific value is the time between shots in milliseconds.
   * Note that you should specify %04d at the point in the filename where you want a frame count number to appear.
   * -t 30000 -tl 2000 -o image%04d.jpg
   */
  timelapse: number;

  /**
   * Specifies the first frame number in the timelapse.
   * Useful if you have already saved a number of frames, and want to start again at the next frame.
   */
  framestart: number;

  /**
   * Instead of a simple frame number, the timelapse file names will use a date/time value
   * of the format aabbccddee, where aa is the month, bb is the day of the month,
   * cc is the hour, dd is the minute, and ee is the second.
   */
  timestamp: boolean;

  /**
   * Set thumbnail parameters (x:y:quality)
   * Allows specification of the thumbnail image inserted into the JPEG file.
   * If not specified, defaults are a size of 64x48 at quality 35.
   */
  thumb: string | 'none';

  /**
   * Encoding to use for output file
   * Valid options are jpg, bmp, gif, and png. Note that unaccelerated image types (GIF, PNG, BMP)
   * will take much longer to save than jpg, which is hardware accelerated.
   * Also note that the filename suffix is completely ignored when deciding the encoding of a file.
   */
  encoding: 'jpg' | 'bmp' | 'gif' | 'png';

  /**
   * Sets the JPEG restart marker interval to a specific value.
   * Can be useful for lossy transport streams because it allows a broken JPEG file to still be partially displayed.
   */
  restart: boolean;

  /**
   * EXIF tag to apply to captures (format as 'key=value')
   * Allows the insertion of specific EXIF tags into the JPEG image. You can have up to 32 EXIF tag entries.
   */
  exif: string;

  /**
   * Full preview mode
   * This runs the preview window using the full resolution capture mode.
   * Maximum frames per second in this mode is 15fps, and the preview will have the same field of view as the capture.
   * Captures should happen more quickly, as no mode change should be required. This feature is currently under development.
   */
  fullpreview: boolean;

  /**
   * Specify the output filename.
   */
  output: string;
}

/**
 * RaspiVid settings
 */
export interface RaspiVidSettings {
  /**
   * Width of resulting video. This should be between 64 and 1920.
   */
  width: number;

  /**
   * Height of resulting video. This should be between 64 and 1080.
   */
  height: number;

  /**
   * Use bits per second, so 10Mbits/s would be -b 10000000.
   * For H264, 1080p30 a high quality bitrate would be 15Mbits/s or more.
   * Maximum bitrate is 25Mbits/s (-b 25000000), but much over 17Mbits/s
   * won't show noticeable improvement at 1080p30.
   */
  bitrate: number;

  /**
   * Specify the output filename.
   * To connect to a remote IPv4 host, use tcp or udp followed by the required IP Address.
   * e.g. tcp://192.168.1.2:1234 or udp://192.168.1.2:1234.
   */
  output: string;

  /**
   * When using a network connection as the data sink, this option will make the sytem wait
   * for a connection from the remote system before sending data.
   */
  listen: boolean;

  /**
   * The total length of time that the program will run for.
   * If not specified, the default is 5000ms (5 seconds).
   * If set to 0, the application will run indefinitely until stopped with Ctrl-C.
   */
  timeout: number;

  /**
   * This options cycles through the range of camera options.
   * The time between cycles should be specified as a millisecond value.
   */
  demo: number;

  /** At present, the minimum frame rate allowed is 2fps, and the maximum is 30fps. */
  framerate: number;

  /**  Specify the intra refresh period (key frame rate/GoP) */
  intra: number;

  /**
   * Sets the initial quantisation parameter for the stream.
   * Varies from approximately 10 to 40, and will greatly affect the quality of the recording.
   * Higher values reduce quality and decrease file size. Combine this setting with a bitrate of 0 to set a completely variable bitrate.
   */
  qp: number;

  /** Specify H264 profile to use for encoding */
  profile: 'baseline' | 'main' | 'high';

  /** Specifies the H264 encoder level to use for encoding. Options are 4, 4.1, and 4.2. */
  level: '4' | '4.1' | '4.2';

  /** Sets the H264 intra-refresh type. */
  irefresh: 'cyclic' | 'adaptive' | 'both' | 'cyclicrows';

  /**
   * Insert PPS, SPS headers (IH)
   * Forces the stream to include PPS and SPS headers on every I-frame.
   * Needed for certain streaming cases e.g. Apple HLS.
   * These headers are small, so don't greatly increase the file size.
   */
  inline: boolean;

  /** Insert timing information into the SPS block. */
  spstimings: boolean;

  /**
   * Do timed switches between capture and pause
   * raspivid -o test.h264 -t 25000 -timed 2500,5000
   * 2.5 record – 5 pause - 2.5 record – 5 pause - 2.5 record – 5 pause – 2.5 record
   */
  timed: string;

  // TODO some missing.. check if we can use it.

  /**
   * Forces a flush of output data buffers as soon as video data is written.
   * This bypasses any OS caching of written data, and can decrease latency.
   */
  flush: boolean;

  /**
   * Specifies the encoder codec to use.
   * H264 can encode up to 1080p, whereas MJPEG can encode upto the sensor size,
   * but at decreased framerates due to the higher processing and storage requirements.
   */
  codec: 'H264' | 'MJPEG';

  /*
   * Rather than creating a single file, the file is split into segments of
   * approximately the number of milliseconds specified.
   * -o video_%c.h264
   */
  segment: number;

  /*
   * When outputting segments, this is the maximum the segment number
   * can reach before it's reset to 1, giving the ability to keep recording segments,
   * but overwriting the oldest one. So if set to 4, in the segment example above,
   * the files produced will be video0001.h264, video0002.h264, video0003.h264, and video0004.h264.
   * Once video0004.h264 is recorded, the count will reset to 1, and video0001.h264 will be overwritten.
   */
  wrap: number;

  /*
   * When outputting segments, this is the initial segment number, giving the ability
   * to resume a previous recording from a given segment. The default value is 1.
   */
  start: number;

  /*
   * Specify the output file name for any raw data files requested.
   */
  raw: boolean;

  /*
   * Specify the raw format to be used if raw output requested.
   * Options as yuv, rgb, and grey. grey simply saves the Y channel of the YUV image.
   */
  rf: 'yuv' | 'rgb' | 'grey';
}

export const vidSettings: Partial<RaspiVidSettings> = {
  width: 1920,
  height: 1080,
  timeout: 0,
  framerate: 30,
  profile: 'baseline',
  bitrate: 3000000,
  inline: true,
  output: 'dummy.mp4',
};

export const streamSettings: Partial<RaspiVidSettings> = {
  width: 1280,
  height: 720,
  timeout: 0,
  framerate: 25,
  profile: 'baseline',
  bitrate: 3000000,
  inline: true,
  output: '-',
};

export const stillSettings: Partial<RaspiStillSettings> = {
  width: 4056,
  height: 3040,
  timeout: 1,
  output: 'dummy.jpg',
  thumb: '320:240:35',
};

export const previewSettings: Partial<RaspiPreviewSettings> = {
  nopreview: true,
};
