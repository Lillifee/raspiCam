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
    background: #0d0e1b;
  }

  body {
    margin: 0;
    font-family: Roboto, Helvetica, Arial, sans-serif;
  }

  // TODO Check if needed
  /* input, select {
    font-family: inherit;
    font-size: inherit;
  } */
`;
