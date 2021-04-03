declare module 'jmuxer' {
  interface JMuxerOptions {
    /**
     * String ID of a video tag / Reference of the HTMLVideoElement.
     * Required field for browsers.
     */
    node: string;

    /**
     * Available values are: both, video and audio.
     * Default is both
     */
    mode?: 'both' | 'video' | 'audio';

    /**
     * Buffer flushing time in seconds.
     * Default value is 1500 miliseconds.
     */
    flushingTime?: number;

    /**
     * Either it will clear played media buffer automatically or not. Default is true.
     */
    clearBuffer?: boolean;

    /**
     * Frame rate of the video if it is known/fixed value.
     * It will be used to find frame duration if chunk duration is not available with provided media data.
     */
    fps?: number;

    /**
     * Will be called once MSE is ready.
     */
    onReady?: () => void;

    /**
     * Will print debug log in browser console. Default is false.
     */
    debug?: boolean;
  }

  interface JMuxerFeedArgs {
    /**
     * autio - AAC buffer
     */
    audio?: Uint8Array;

    /**
     * video - h264 buffer
     */
    video?: Uint8Array;

    /**
     * duration in miliseconds of the provided chunk.
     * If duration is not provided, it will calculate frame duration wtih the provided frame rate (fps).
     */
    duration?: number;
  }

  declare class JMuxer {
    /**
     * Creates an instance of JMuxer.
     */
    constructor(options: JMuxerOptions);

    /**
     * Object properites may have audio, video and duration.
     * At least one media property i.e audio or video must be provided.
     * If no duration is provided, it will calculate duration based on fps value
     */
    feed(args: JMuxerFeedArgs): void;

    /**
     * Destroy the jmuxer instance and release the resources
     */
    destroy(): void;
  }

  export = JMuxer;
}
