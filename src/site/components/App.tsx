import * as React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Player } from './Player';
import { GlobalStyle, theme } from './theme';

const Wrapper = styled.section`
  flex: 1;
  flex-direction: column;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

export const App: React.FC = () => (
  <ThemeProvider theme={theme}>
    <GlobalStyle />
    <Wrapper>
      <Player />
    </Wrapper>
  </ThemeProvider>
);
