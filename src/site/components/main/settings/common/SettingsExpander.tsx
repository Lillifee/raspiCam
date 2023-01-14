import React, { useState } from 'react';
import { styled } from 'styled-components';
import { ButtonIcon } from '../../../styled/ButtonIcon.js';

const Wrapper = styled.div``;

const Header = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-column-gap: 1em;
  align-items: center;
`;

const HeaderContent = styled.div`
  flex: 1;
`;

export const SettingsExpanderHeader = styled.div`
  font-size: ${(p) => p.theme.FontSize.s};
`;

const Content = styled.div`
  background: ${(p) => p.theme.SubLayerBackground};
  border-left: 3px solid ${(p) => p.theme.PrimaryBackground};
  padding: 0 0.6em;
  margin-bottom: 2em;
  border-radius: 0 6px 6px 0;
`;

export interface SettingsExpanderProps {
  header: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export const SettingsExpander: React.FC<SettingsExpanderProps> = ({
  header,
  children,
  defaultExpanded,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  return (
    <Wrapper>
      <Header>
        <HeaderContent>{header}</HeaderContent>
        <ButtonIcon
          type={expanded ? 'ExpandLess' : 'ExpandMore'}
          onClick={() => setExpanded(!expanded)}
        />
      </Header>
      {expanded && <Content>{children}</Content>}
    </Wrapper>
  );
};
