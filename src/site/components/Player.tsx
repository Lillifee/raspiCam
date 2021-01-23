import * as React from 'react';
import styled from 'styled-components';
import wsPlayer from './wsPlayer';

// #region styled

const Container = styled.div`
  display: flex;
  overflow: hidden;
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

// #endregion

/**
 * Player hook
 * Creates a webSocket Broadway player instance and append it to the passed container
 *
 * @param {string} url websocket url without (e.g. 192.168.1.10:8081)
 * @param {React.RefObject<HTMLElement>} container html reference object
 */
const usePlayer = (url: string, container: React.RefObject<HTMLElement>) => {
  React.useEffect(() => {
    if (!container.current) return;

    const player = wsPlayer({ url });
    container.current.appendChild(player.canvas);

    return () => {
      container.current?.removeChild(player.canvas);
      player.close();
    };
  }, [container]);
};

/**
 * Player to display the live stream
 */
export const Player: React.FC = () => {
  const playerWrapperRef = React.useRef<HTMLDivElement>(null);
  usePlayer(`ws://${__WEBSOCKET__ || document.location.host}`, playerWrapperRef);

  return (
    <Container>
      <PlayerWrapper ref={playerWrapperRef} />
    </Container>
  );
};
