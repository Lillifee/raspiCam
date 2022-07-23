import * as React from 'react';
import styled from 'styled-components';

// #region styled

const Container = styled.div`
  display: flex;
  overflow: hidden;
  position: relative;
`;

const VideoContainer = styled.div`
  margin: 0 auto;
`;

const Image = styled.img`
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

      <BlurOverlay blur={loading}></BlurOverlay>
    </Container>
  );
};
