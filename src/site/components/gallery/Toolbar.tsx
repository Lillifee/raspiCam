import * as React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ButtonIcon } from '../styled/ButtonIcon';

const ToolbarContainer = styled.div`
  display: flex;
  flex-direction: row;
  backdrop-filter: blur(5px);
  background-color: ${(p) => p.theme.LayerBackground};
  pointer-events: all;
  position: sticky;
  top: 0px;
`;

const Button = styled(ButtonIcon)`
  padding: 0.8em;
`;

export const Toolbar: React.FC = () => (
  <ToolbarContainer>
    <Link to="/">
      <Button type="PhotoCamera" />
    </Link>
  </ToolbarContainer>
);
