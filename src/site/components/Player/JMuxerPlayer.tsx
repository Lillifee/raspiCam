import * as React from 'react';
import styled from 'styled-components';
import { BlurOverlay } from './Common';
import { createPlayerOptions, player, Player, PlayerOptions } from './player';
import { createInitialPlayerStats, PlayerStats } from './stats';
import { streamJMuxer } from './streamJMuxer';

// #region styled

const Container = styled.div`
  display: flex;
  overflow: hidden;
  position: relative;
`;

const VideoContainer = styled.div`
  display: flex;
  margin: 0 auto;
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
 * @param {string} url websocket url without (e.g. 192.168.1.10:8081)
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
}

/**
 * Player to display the live stream
 */
export const JMuxerPlayer: React.FC<PlayerProps> = ({ loading }) => {
  const [stats] = usePlayer('/api/stream/live');

  return (
    <Container>
      <VideoContainer>
        <Video id="player" muted={true} autoPlay={true} />
      </VideoContainer>

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
