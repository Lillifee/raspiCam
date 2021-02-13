import * as React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { useFullscreen } from './common/hooks/useFullscreen';
import { Main } from './Main';
import { Overlay } from './Overlay';
import { Player } from './Player';
import { GlobalStyle, theme } from './theme';

const AppContainer = styled.div`
  flex: 1;
  flex-direction: row;
  display: flex;
  overflow: hidden;
`;

const PlayerWrapper = styled.section`
  flex: 1;
  flex-direction: column;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
`;

export type CameraMode = 'Stream' | 'Photo' | 'Video' | 'Timelapse';

export const App: React.FC = () => {
  const appRef = React.useRef<HTMLDivElement>(null);
  const [mode, setMode] = React.useState<CameraMode>('Stream');
  const [loading, setLoading] = React.useState(false);
  const [isFullscreen, setFullscreen] = useFullscreen(appRef);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AppContainer ref={appRef}>
        <PlayerWrapper>
          <Player loading={loading} />
        </PlayerWrapper>

        <Main
          mode={mode}
          setMode={setMode}
          isFullscreen={isFullscreen}
          setFullscreen={setFullscreen}
        />
        <Overlay mode={mode} setLoading={setLoading} />
      </AppContainer>
    </ThemeProvider>
  );
};
