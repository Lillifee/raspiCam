import * as React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Gallery } from './gallery/Gallery.js';
import { Camera } from './main/Camera.js';
import { GlobalStyle } from './theme/GlobalStyle.js';
import { darkTheme } from './theme/themes.js';

export const App: React.FC = () => {
  const [theme, setTheme] = React.useState(darkTheme);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/" element={<Camera setTheme={setTheme} />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};
