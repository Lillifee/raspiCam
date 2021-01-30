import * as React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { useFullscreen } from './common/hooks/useFullscreen';
import { Player } from './player/Player';
import {
  // VidSettings,
  CameraSettings,
  // StillSettings,
  // PreviewSettings,
} from './settings/StreamSettings';
import { GlobalStyle, theme } from './theme';

const AppContainer = styled.div`
  flex: 1;
  flex-direction: column;
  display: flex;
  overflow: hidden;
`;

const Wrapper = styled.section`
  flex: 1;
  flex-direction: column;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const Settings = styled.div`
  flex: 1;
  flex-direction: column;
  display: flex;
  position: absolute;
  overflow: auto;
  left: 0;
  height: 100%;
`;

export const App: React.FC = () => {
  const appRef = React.useRef<HTMLDivElement>(null);
  const [loading, setLoading] = React.useState(false);
  const [isFullscreen, setFullscreen] = useFullscreen(appRef);
  console.log(isFullscreen);

  return (
    <AppContainer ref={appRef} onDoubleClick={() => setFullscreen()}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Wrapper>
          <Player loading={loading} />
          <Settings>
            <CameraSettings url="/api/camera" setLoading={setLoading} />
            {/* <VidSettings url="/api/stream" />
        <VidSettings url="/api/vid" />
        <StillSettings url="/api/still" />
        <PreviewSettings url="/api/preview" /> */}
          </Settings>
        </Wrapper>
      </ThemeProvider>
    </AppContainer>
  );
};
