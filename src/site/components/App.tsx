import * as React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Player } from './Player';
import { theme, GlobalStyle } from './theme';

const Wrapper = styled.section`
  flex: 1;
  flex-direction: column;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  /* background: black; */
  /* background: ${(p) => p.theme.Background}; */
`;

export const App: React.FC = () => (
  <ThemeProvider theme={theme}>
    <GlobalStyle />
    <Wrapper>
      <Player />
    </Wrapper>
  </ThemeProvider>
);
