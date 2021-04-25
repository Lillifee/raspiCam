import * as cocossd from '@tensorflow-models/coco-ssd';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as tf from '@tensorflow/tfjs';
import * as React from 'react';
import styled from 'styled-components';
import { PlayerStats, createPlayerStats, player } from '../Player';

// #region styled

const Container = styled.div`
  display: flex;
  overflow: hidden;
  position: relative;
`;

const VideoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Video = styled.video`
  max-width: 100%;
  max-height: 100%;
`;

interface BlurOverlayProps {
  blur: boolean;
}

const BlurOverlay = styled.div<BlurOverlayProps>`
  backdrop-filter: ${(p) => (p.blur ? 'blur(10px)' : '')};
  background-color: ${(p) => (p.blur ? 'rgba(0, 0, 0, 0.5)' : '')};
  transition: backdrop-filter ease-in-out 0.3s, background-color ease-in-out 0.3s;
  position: absolute;
  width: 100%;
  height: 100%;
`;

const CanvasOverlay = styled.canvas`
  position: absolute;
  object-fit: contain;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
`;

// #endregion

/**
 * Player hook
 * Creates a JMuxer player instance and append it to the passed container
 *
 * @param {string} url websocket url without (e.g. 192.168.1.10:8081)
 * @param {React.RefObject<HTMLElement>} container html reference object
 */
const usePlayer = (url: string) => {
  const [stats, setStats] = React.useState<PlayerStats>(createPlayerStats());

  // TODO create player in a separate effect and start/stop based on stream running
  React.useEffect(() => {
    console.log('usePlayer');
    const bwPlayer = player({ url, onStats: setStats });

    return () => {
      bwPlayer.stop();
    };
  }, [url]);

  return [stats];
};

const tensorflow = async (video: HTMLVideoElement, canvas: HTMLCanvasElement) => {
  console.log('Load model');

  const mobileModel = await mobilenet.load();
  const cocoModel = await cocossd.load();
  const canvasContext = canvas.getContext('2d');

  console.log('Successfully loaded model');

  let detection: DetectedObject[] = [];

  const classify = async () => {
    const result = await mobileModel.classify(video);

    const filterResult = result.filter((x) => x.probability > 0.7);
    if (filterResult.length > 0) {
      console.log(filterResult.map((x) => `${x.className} ${x.probability * 100}%`).join(','));
    }

    await tf.nextFrame();
  };

  const classifyLoop = async () => {
    await classify();
    await classifyLoop();
  };

  const getBox = (bbox: [number, number, number, number]) => {
    const [left, top, width, height] = bbox;
    return {
      left,
      top,
      width,
      height,
      right: () => left + width,
      bottom: () => top + height,
      area: () => width * height,
    };
  };

  type Box = ReturnType<typeof getBox>;

  interface DetectedObject {
    class: string;
    score: number;
    opacity: number;
    box: Box;
  }

  const createDetectedObject = (obj: cocossd.DetectedObject): DetectedObject => ({
    class: obj.class,
    score: obj.score,
    opacity: 0.2,
    box: getBox(obj.bbox),
  });

  const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

  const boxOverlap = (a: Box, b: Box) => {
    const ovX = Math.max(0, Math.min(a.right(), b.right()) - Math.max(a.left, b.left));
    const ovY = Math.max(0, Math.min(a.bottom(), b.bottom()) - Math.max(a.top, b.top));
    const ovArea = ovX * ovY;
    const avgArea = (a.area() + b.area()) / 2;
    const ovPercent = ovArea / avgArea;
    return ovPercent > 0.3;
  };

  const boxTransition = (a: Box, b: Box, t = 0.15) =>
    getBox([
      lerp(a.left, b.left, t),
      lerp(a.top, b.top, t),
      lerp(a.width, b.width, t),
      lerp(a.height, b.height, t),
    ]);

  const addDetectedObjects = (objects: cocossd.DetectedObject[]) =>
    objects.reduce<DetectedObject[]>((result, object) => {
      const detectedObject = createDetectedObject(object);

      const foundObject = result.find(
        (x) => x.class === detectedObject.class && boxOverlap(x.box, detectedObject.box),
      );

      if (!foundObject) {
        result.push(detectedObject);
        console.log('new object');
      } else {
        foundObject.score = detectedObject.score;
        foundObject.opacity = Math.min(foundObject.opacity + 0.15, 1);
        foundObject.box = boxTransition(foundObject.box, detectedObject.box);
      }

      return result;
    }, detection);

  const drawDetection = (canvasRenderContext: CanvasRenderingContext2D, object: DetectedObject) => {
    // Set styling
    const color = `rgba(255, 255, 255, ${object.opacity})`;
    canvasRenderContext.strokeStyle = color;
    canvasRenderContext.font = '18px Roboto';

    const { left, top, width, height } = object.box;

    // draw rectangle
    canvasRenderContext.beginPath();
    canvasRenderContext.fillStyle = `rgba(255, 255, 255, 0.1)`;
    canvasRenderContext.fillRect(left, top, width, height);
    canvasRenderContext.rect(left, top, width, height);
    canvasRenderContext.stroke();

    // text
    const text = `${object.class} ${Math.round(object.score * 10) * 10}%`;
    const textPos = { x: Math.max(left + 6, 20), y: Math.max(top + 19, 20) };

    // shaddow text
    canvasRenderContext.fillStyle = `rgba(0, 0, 0, ${object.opacity / 2})`;
    canvasRenderContext.fillText(text, textPos.x + 1, textPos.y + 1);

    // text
    canvasRenderContext.fillStyle = color;
    canvasRenderContext.fillText(text, textPos.x, textPos.y);
  };

  const detect = async () => {
    if (!canvasContext) return;
    const detectedObjects = await cocoModel.detect(video);

    detection.forEach((x) => (x.opacity -= 0.1));
    detection = detection.filter((x) => x.opacity > 0);

    addDetectedObjects(detectedObjects);

    canvasContext.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas height and width
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    detection.forEach((x) => drawDetection(canvasContext, x));

    await tf.nextFrame();
  };

  const wait = async (duration: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, duration));

  const detectLoop = async () => {
    await detect().catch(() => wait(1000));
    await detectLoop();
  };

  return { classifyLoop, detectLoop };
};

const useTensorflow = (
  video: React.RefObject<HTMLVideoElement>,
  canvas: React.RefObject<HTMLCanvasElement>,
) => {
  React.useEffect(() => {
    if (!video.current || !canvas.current) return;
    tensorflow(video.current, canvas.current)
      .then((x) => x.detectLoop())
      .catch((err) => console.log('Error on load model', err));
  }, [video, canvas]);
};

export interface PlayerProps {
  loading: boolean;
}

/**
 * Player to display the live stream
 */
const PlayerComponent: React.FC<PlayerProps> = ({ loading }) => {
  const [stats] = usePlayer('/api/stream/live');
  const video = React.useRef<HTMLVideoElement>(null);
  const canvas = React.useRef<HTMLCanvasElement>(null);

  // Load the model.
  useTensorflow(video, canvas);

  return (
    <Container>
      <VideoContainer>
        <Video ref={video} id="player" muted={true} autoPlay={true} />
      </VideoContainer>

      <CanvasOverlay ref={canvas} />

      <BlurOverlay
        blur={loading || !stats.streamRunning || !stats.playerRunning || stats.droppingFrames}
      >
        {/* <div>dropped: {stats.totalDroppedFrames}</div>
          <div>frames: {stats.framesPerCycle}</div>
          <div>avgFps: {stats.avgFps}</div>
          <div>avgSize: {abbreviateNumber('bit/s')(roundToSignificant(stats.avgSize, 2))}</div>
          {loading && <div>loading</div>}
          {!stats.playerRunning && <div>player not running</div>}
          {!stats.streamRunning && <div>stream not running</div>}
          {stats.droppingFrames && <div>drop frames</div>} */}
      </BlurOverlay>
    </Container>
  );
};

export const Player = React.memo(PlayerComponent);
