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
  margin: 0 auto;
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
    const bwPlayer = player({ url, onStats: setStats });

    return () => {
      bwPlayer.stop();
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
export const H264Player: React.FC<PlayerProps> = ({ loading }) => {
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
