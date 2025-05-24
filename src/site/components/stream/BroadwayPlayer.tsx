import * as React from 'react';
import styled from 'styled-components';
import { BlurOverlay } from './Common.js';
import { createPlayerOptions, player, Player, PlayerOptions } from './player.js';
import { PlayerStatistics } from './PlayerStatistics.js';
import { createInitialPlayerStats, PlayerStats } from './stats.js';
import { streamBroadway } from './streamBroadway.js';

// #region styled

const Container = styled.div`
  display: flex;
  overflow: hidden;
  position: relative;
`;

const VideoContainer = styled.div`
  display: flex;
  margin: 0 auto;
  justify-content: center;

  > canvas {
    max-width: 100%;
    max-height: 100%;
  }
`;

// #endregion

export interface CanvasPlayer extends Player {
  canvas: HTMLCanvasElement;
}

const broadwayPlayer = (playerOptions: PlayerOptions): CanvasPlayer => {
  const options = createPlayerOptions(playerOptions);
  const stats = createInitialPlayerStats();

  const decoder = streamBroadway(options, stats);
  const broadway = player(decoder, options, stats);

  return { ...broadway, canvas: decoder.canvas };
};

/**
 * Player hook
 * Creates a broadway player instance and append it to the passed container
 *
 * @param {string} url websocket url without (e.g. 192.168.1.10:8081)
 * @param {React.RefObject<HTMLElement>} container html reference object
 */
const usePlayer = (url: string, container: React.RefObject<HTMLElement | null>) => {
  const [stats, setStats] = React.useState<PlayerStats>(createInitialPlayerStats());

  React.useEffect(() => {
    const element = container.current;
    if (!element) return;

    const player = broadwayPlayer({ url, useWorker: true, onStats: setStats });
    element.appendChild(player.canvas);

    return () => {
      element.removeChild(player.canvas);
      player.stop();
    };
  }, [container, url]);

  return [stats];
};

export interface PlayerProps {
  loading: boolean;
  showStats?: boolean;
}

/**
 * Player to display the live stream
 */
export const BroadwayPlayer: React.FC<PlayerProps> = ({ loading, showStats }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [stats] = usePlayer('/api/stream/live', containerRef);

  return (
    <Container>
      <VideoContainer ref={containerRef} />

      <BlurOverlay
        $blur={loading || !stats.streamRunning || !stats.playerRunning || stats.droppingFrames}
      />

      {showStats && <PlayerStatistics loading={loading} stats={stats} />}
    </Container>
  );
};
