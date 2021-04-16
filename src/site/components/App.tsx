import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Main as Gallery } from './gallery/Gallery';
import { Main as Camera } from './main/Main';
import { GlobalStyle } from './theme/GlobalStyle';
import { darkTheme } from './theme/themes';

export const App: React.FC = () => {
  const [theme, setTheme] = React.useState(darkTheme);
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <BrowserRouter>
        <Switch>
          <Route path="/gallery">
            <Gallery />
          </Route>
          <Route path="/">
            <Camera setTheme={setTheme} />
          </Route>
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
};
