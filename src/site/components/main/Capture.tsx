import * as React from 'react';
import styled from 'styled-components';
import { RaspiControlStatus } from '../../../shared/settings/types';

//#region styled

const CaptureContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;

  align-items: center;
  justify-content: flex-end;
  padding: 1em;
  margin: 3em;

  @media (orientation: portrait) {
    flex-direction: column;
  }
`;

interface ActionButtonProps {
  running?: boolean;
}

const CaptureButton = styled.button<ActionButtonProps>`
  width: 3em;
  height: 3em;
  outline: none;
  pointer-events: all;
  border: 3px solid ${(p) => p.theme.Foreground};
  border-radius: ${(p) => (p.running ? '15%' : '50%')};
  background: ${(p) => (p.running ? 'rgba(255,0,0,0.5)' : 'transparent')};
  filter: drop-shadow(0px 0px 2px ${(p) => p.theme.Background});

  :not(:active) {
    transition: background-color 0.5s;
  }
  :active {
    background: white;
  }
`;

//#endregion

const useCaptureAction = (status: RaspiControlStatus, refresh: () => void): [() => void] => {
  const action = React.useCallback(() => {
    const requestUrl = status.running ? '/api/stop' : '/api/start';
    fetch(requestUrl)
      .finally(refresh)
      .catch((error) => console.error('Start/stop failed', error));
  }, [status.running, refresh]);

  return [action];
};

export interface CaptureProps {
  status: RaspiControlStatus;
  refresh: () => void;
}

export const Capture: React.FC<CaptureProps> = ({ status, refresh }) => {
  const [captureAction] = useCaptureAction(status, refresh);
  return (
    <CaptureContainer>
      <CaptureButton running={status.running} onClick={captureAction} />
    </CaptureContainer>
  );
};
