// eslint-disable-next-line @typescript-eslint/no-var-requires
const Player = require('../../../broadway/Player');

export interface PlayerSize {
  width: number;
  height: number;
}

export interface PlayerOptions {
  url: string;
  reconnect?: number;
  dropFrames?: number;
  useWorker?: boolean;
  webgl?: boolean;
  size?: PlayerSize;
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
    ...playerOptions,
  };

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
      console.log('drop frames', frames.length);
      // TODO check if it's worth to wait until the next SPS frame
      // const nextSpsIndex = frames.findIndex((x) => (x[4] & 0x1f) === 7);
      // frames = frames.slice(nextSpsIndex);
      frames = [];
    }

    const frame = frames.shift();

    if (frame) {
      // debugFragmentType(frame);
      player.decode(frame);
      requestAnimationFrame(decodeFrame);
    }
  };

  // const fragmentTypes: { [key: number]: string } = { 5: 'IDR', 6: 'SEI', 7: 'SPS', 8: 'PPS' };
  // const debugFragmentType = (frame: Uint8Array) => {
  //   const fragment = frame[4] & 0x1f;
  //   const type = fragmentTypes[fragment];
  //   if (type) console.log(fragmentTypes[fragment]);
  // };

  const player = createPlayer();
  const webSocket = createWebSocket();

  return { ...webSocket, canvas: player.canvas };
};

export default wsPlayer;
