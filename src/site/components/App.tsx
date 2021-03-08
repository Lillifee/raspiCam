import * as React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { RaspiControlStatus } from '../../shared/settings/types';
import { useFetch } from './common/hooks/useFetch';
import { useFullscreen } from './common/hooks/useFullscreen';
import { Main } from './Main';
import { Overlay } from './Overlay';
import { Player } from './Player';
import { GlobalStyle } from './theme/GlobalStyle';
import { theme } from './theme/themes';

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

const useControlAction = (control: RaspiControlStatus, update: () => void): [() => void] => {
  const action = React.useCallback(() => {
    const requestUrl = control.running ? '/api/stop' : '/api/start';
    fetch(requestUrl)
      .finally(update)
      .catch((error) => console.log('Start/stop failed', error));
  }, [control.running, update]);

  return [action];
};

export const App: React.FC = () => {
  const appRef = React.useRef<HTMLDivElement>(null);
  const [control, setControl, refresh] = useFetch<RaspiControlStatus>('api/control', {
    mode: 'Photo',
  });
  const [controlAction] = useControlAction(control.data, refresh);
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
          control={control.data}
          setControl={setControl}
          controlAction={controlAction}
          isFullscreen={isFullscreen}
          setFullscreen={setFullscreen}
        />
        <Overlay setLoading={setLoading} />
      </AppContainer>
    </ThemeProvider>
  );
};
