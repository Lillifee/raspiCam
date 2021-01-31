import * as React from 'react';
import styled from 'styled-components';
import { ButtonIcon } from './common/icons';

//#region styled

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: flex-end;
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 100;
`;

const Actionbar = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1em;
`;

const ActionButton = styled(ButtonIcon)`
  filter: drop-shadow(0 0 1px black);
`;

//#endregion

export interface OverlayProps {
  isFullscreen: boolean;
  setFullscreen: () => void;
}

export const Main: React.FC<OverlayProps> = ({ isFullscreen, setFullscreen }) => {
  return (
    <Container>
      <Actionbar>
        {!isFullscreen && <ActionButton type="Fullscreen" onClick={() => setFullscreen()} />}
      </Actionbar>
    </Container>
  );
};
