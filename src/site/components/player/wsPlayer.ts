import { shallowEqualObjects } from '../../../shared/heperFunctions';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Player = require('../../../../broadway/Player');

export interface PlayerSize {
  width: number;
  height: number;
}

export interface PlayerStats {
  width?: number;
  height?: number;
  running: boolean;
  dropFrames: boolean;
  frames: number;
  avgFps: number;
}

export interface PlayerOptions {
  url: string;
  reconnect?: number;
  dropFrames?: number;
  useWorker?: boolean;
  webgl?: boolean;
  size?: PlayerSize;
  statsPerSecond?: number;
  onStats?: (stats: PlayerStats) => void;
}

export interface Player {
  connect: () => void;
  close: () => void;
  canvas: HTMLCanvasElement;
}

const wsPlayer = (playerOptions: PlayerOptions): Player => {
  const options: Required<PlayerOptions> = {
    useWorker: true,
    webgl: true,
    size: { width: 640, height: 480 },
    reconnect: 1000,
    dropFrames: 10,
    statsPerSecond: 5,
    onStats: () => undefined,
    ...playerOptions,
  };

  const stats: PlayerStats = { avgFps: 0, frames: 0, running: false, dropFrames: false };
  let frames: Uint8Array[] = [];

  const createPlayer = () => {
    const { useWorker, webgl, size } = options;
    return new Player({ useWorker, webgl, size });
  };

  const createWebSocket = () => {
    let ws: WebSocket | undefined;

    const connect = () => {
      ws = new WebSocket(options.url);
      ws.binaryType = 'arraybuffer';

      ws.onopen = () => {
        console.info('websocket connected');
      };

      ws.onmessage = (msg: MessageEvent<any>) => {
        frames.push(new Uint8Array(msg.data));
        setTimeout(decodeFrame, 1);
      };

      ws.onclose = () => {
        console.info('websocket disconnected');
        setTimeout(() => connect(), options.reconnect);
      };
    };

    const close = () => ws?.close();

    connect();

    return { connect, close };
  };

  const decodeFrame = (): void => {
    if (frames.length > options.dropFrames) {
      stats.dropFrames = true;
      // TODO check if it's worth to wait until the next SPS frame
      // const nextSpsIndex = frames.findIndex((x) => (x[4] & 0x1f) === 7);
      // frames = frames.slice(nextSpsIndex);
      frames = [];
    }

    const frame = frames.shift();

    if (frame) {
      if (stats.dropFrames) {
        parseFragmentType(frame);
      }
      player.decode(frame);
      requestAnimationFrame(decodeFrame);
    }
  };

  const fragmentTypes: { [key: number]: string } = { 5: 'IDR', 6: 'SEI', 7: 'SPS', 8: 'PPS' };
  const parseFragmentType = (frame: Uint8Array) => {
    const fragment = frame[4] & 0x1f;
    const type = fragmentTypes[fragment];
    if (type === 'IDR') stats.dropFrames = false;
    // if (type) console.log(fragmentTypes[fragment]);
  };

  const player = createPlayer();
  const canvas = player.canvas as HTMLCanvasElement;

  const webSocket = createWebSocket();

  player.onPictureDecoded = (_: Buffer, width: number, height: number) => {
    stats.width = width;
    stats.height = height;
    stats.frames++;
  };

  const fpsCaluclator = (seconds: number) => {
    const fpsBuffer: number[] = [];
    const fpsBufferLength = options.statsPerSecond * seconds;
    let fpsSum = 0;

    return (frames: number) => {
      fpsBuffer.push(stats.frames);
      fpsSum += frames;
      fpsSum -= fpsBuffer.length > fpsBufferLength ? fpsBuffer.shift() || 0 : 0;
      return Math.floor(fpsSum / seconds);
    };
  };

  const fpcCalcAvg = fpsCaluclator(3);
  const fpcCalc = fpsCaluclator(1);

  let prevStats: PlayerStats;

  setInterval(() => {
    const avgFps = fpcCalcAvg(stats.frames);
    const running = fpcCalc(stats.frames) > 0;
    const newStats = { ...stats, avgFps, running };
    stats.frames = 0;

    if (!shallowEqualObjects(newStats, prevStats)) {
      options.onStats(newStats);
    }

    prevStats = newStats;
  }, 1000 / options.statsPerSecond);

  return { ...webSocket, canvas };
};

export default wsPlayer;
