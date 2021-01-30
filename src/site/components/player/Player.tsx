import * as React from 'react';
import styled from 'styled-components';
import wsPlayer, { PlayerStats } from './wsPlayer';

// #region styled

const Container = styled.div`
  display: flex;
  overflow: hidden;
  color: white;
  position: relative;
`;

const PlayerWrapper = styled.div`
  background: #000000;
  display: flex;
  align-items: center;
  justify-content: center;

  > canvas {
    max-width: 100%;
    max-height: 100%;
  }
`;

interface OverlayProps {
  blur: boolean;
}

const Overlay = styled.div<OverlayProps>`
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
  const [stats, setStats] = React.useState<PlayerStats>({
    avgFps: 0,
    frames: 0,
    running: false,
    dropFrames: false,
  });

  React.useEffect(() => {
    const element = container.current;
    if (!element) return;

    const player = wsPlayer({ url, onStats: setStats });
    element.appendChild(player.canvas);

    return () => {
      element.removeChild(player.canvas);
      player.close();
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
  const [stats] = usePlayer(`ws://${__WEBSOCKET__ || document.location.host}`, playerWrapperRef);

  return (
    <Container>
      <PlayerWrapper ref={playerWrapperRef} />

      <Overlay blur={loading || !stats.running || stats.dropFrames}>
        FPS {stats.avgFps}
        {stats.running && 'running'}
        width {stats.width}x {stats.height}
      </Overlay>
    </Container>
  );
};
