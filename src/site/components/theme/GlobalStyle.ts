import { createGlobalStyle } from 'styled-components';
import { normalize } from 'styled-normalize';

export const GlobalStyle = createGlobalStyle`
  ${normalize}

  html, body, #root {
    margin: 0;
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    user-select: none;
    background: ${(p) => p.theme.RootBackground};
  }

  body {
    margin: 0;
    font-family: Roboto, Helvetica, Arial, sans-serif;
  }

  *::-webkit-scrollbar {
    width: 5px;
  }

  *::-webkit-scrollbar-track {
    background: ${(p) => p.theme.LayerBackground};
  }

  *::-webkit-scrollbar-thumb {
    background-color: ${(p) => p.theme.Background};
    border-radius: 0px;
    border: 0;
  }
`;
