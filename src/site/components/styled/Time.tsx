import * as React from 'react';
import styled from 'styled-components';

const TimeStyled = styled.input`
  padding: 0.2em 0.5em;
  background: ${(p) => p.theme.Background};
  color: ${(p) => p.theme.Foreground};
  border: 1px solid ${(p) => p.theme.Border};
  font-size: ${(p) => p.theme.FontSize.s};
  outline: none;
  &::-webkit-calendar-picker-indicator {
    filter: ${(p) => (p.theme.Name === 'Dark' ? 'invert(1)' : 'invert(0)')};
  }
`;

export const Time: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ ...rest }) => (
  <TimeStyled type="time" {...rest} />
);
