import * as React from 'react';
import styled from 'styled-components';
import { BlurOverlay } from './Common.js';
import { createPlayerOptions, player, Player, PlayerOptions } from './player.js';
import { PlayerStatistics } from './PlayerStatistics.js';
import { createInitialPlayerStats, PlayerStats } from './stats.js';
import { streamJMuxer } from './streamJMuxer.js';

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
`;

const Video = styled.video`
  max-width: 100%;
  max-height: 100%;
`;

// #endregion

const jMuxerPlayer = (playerOptions: PlayerOptions): Player => {
  const options = createPlayerOptions(playerOptions);
  const stats = createInitialPlayerStats();

  const jMuxer = streamJMuxer(options, stats);
  return player(jMuxer, options, stats);
};

/**
 * Player hook
 * Creates a JMuxer player instance and append it to the passed container
 *
 * @param {string} url
 */
const usePlayer = (url: string) => {
  const [stats, setStats] = React.useState<PlayerStats>(createInitialPlayerStats());

  // TODO create player in a separate effect and start/stop based on stream running
  React.useEffect(() => {
    const player = jMuxerPlayer({ url, onStats: setStats });

    return () => {
      player.stop();
    };
  }, [url]);

  return [stats];
};

export interface PlayerProps {
  loading: boolean;
  showStats?: boolean;
}

/**
 * Player to display the live stream
 */
export const JMuxerPlayer: React.FC<PlayerProps> = ({ loading, showStats }) => {
  const [stats] = usePlayer('/api/stream/live');

  return (
    <Container>
      <VideoContainer>
        <Video id="player" muted={true} autoPlay={true} />
      </VideoContainer>

      <BlurOverlay
        $blur={loading || !stats.streamRunning || !stats.playerRunning || stats.droppingFrames}
      />
      {showStats && <PlayerStatistics loading={loading} stats={stats} />}
    </Container>
  );
};
