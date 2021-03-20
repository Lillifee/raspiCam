import * as React from 'react';
import styled from 'styled-components';
import { abbreviateNumber, roundToSignificant } from '../../../shared/helperFunctions';
import { createPlayerStats, player, PlayerStats } from '../bwPlayer';

// #region styled

const Container = styled.div`
  display: flex;
  overflow: hidden;
  position: relative;
`;

const PlayerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  > canvas {
    max-width: 100%;
    max-height: 100%;
  }
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

// #endregion

/**
 * Player hook
 * Creates a webSocket Broadway player instance and append it to the passed container
 *
 * @param {string} url websocket url without (e.g. 192.168.1.10:8081)
 * @param {React.RefObject<HTMLElement>} container html reference object
 */
const usePlayer = (url: string, container: React.RefObject<HTMLElement>) => {
  const [stats, setStats] = React.useState<PlayerStats>(createPlayerStats());

  // TODO create player in a separate effect and start/stop based on stream running
  React.useEffect(() => {
    const element = container.current;
    if (!element) return;

    const bwPlayer = player({ url, onStats: setStats });
    element.appendChild(bwPlayer.canvas);

    return () => {
      element.removeChild(bwPlayer.canvas);
      bwPlayer.stop();
    };
  }, [url, container]);

  return [stats];
};

export interface PlayerProps {
  loading: boolean;
}

/**
 * Player to display the live stream
 */
export const Player: React.FC<PlayerProps> = ({ loading }) => {
  const playerWrapperRef = React.useRef<HTMLDivElement>(null);
  const [stats] = usePlayer('/api/stream/live', playerWrapperRef);

  return (
    <Container>
      <PlayerWrapper ref={playerWrapperRef} />
      <BlurOverlay
        blur={loading || !stats.streamRunning || !stats.playerRunning || stats.droppingFrames}
      >
        <div>dropped: {stats.totalDroppedFrames}</div>
        <div>frames: {stats.framesPerCycle}</div>
        <div>avgFps: {stats.avgFps}</div>
        <div>avgSize: {abbreviateNumber('bit/s')(roundToSignificant(stats.avgSize, 2))}</div>
        {loading && <div>loading</div>}
        {!stats.playerRunning && <div>player not running</div>}
        {!stats.streamRunning && <div>stream not running</div>}
        {stats.droppingFrames && <div>drop frames</div>}
      </BlurOverlay>
    </Container>
  );
};
