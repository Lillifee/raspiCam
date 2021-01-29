import * as React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Player } from './player/Player';
import {
  // VidSettings,
  CameraSettings,
  // StillSettings,
  // PreviewSettings,
} from './settings/StreamSettings';
import { GlobalStyle, theme } from './theme';

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

export const App: React.FC = () => (
  <ThemeProvider theme={theme}>
    <GlobalStyle />
    <Wrapper>
      <Player />
      <Settings>
        <CameraSettings url="/api/camera" />
        {/* <VidSettings url="/api/stream" />
        <VidSettings url="/api/vid" />
        <StillSettings url="/api/still" />
        <PreviewSettings url="/api/preview" /> */}
      </Settings>
    </Wrapper>
  </ThemeProvider>
);
