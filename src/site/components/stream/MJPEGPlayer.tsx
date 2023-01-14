import * as React from 'react';
import { styled } from 'styled-components';
import { BlurOverlay } from './Common.js';

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

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
`;

// #endregion

export interface PlayerProps {
  loading: boolean;
}

/**
 * Player to display the mjpeg live stream
 */
export const MJPEGPlayer: React.FC<PlayerProps> = ({ loading }) => {
  const [date, setDate] = React.useState<string>('');

  // Refresh the date to trigger an update of the mjpeg image after loading
  React.useEffect(() => {
    if (!loading) setDate(new Date().valueOf().toString());
  }, [loading]);

  return (
    <Container>
      <VideoContainer>
        <Image src={`/api/stream/mjpeg?${date}`} />
      </VideoContainer>

      <BlurOverlay $blur={loading}></BlurOverlay>
    </Container>
  );
};
