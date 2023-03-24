import * as React from 'react';
import styled from 'styled-components';
import { Input } from './Input';

const TimeStyled = styled(Input)`
  &::-webkit-calendar-picker-indicator {
    filter: ${(p) => (p.theme.Name === 'dark' ? 'invert(1)' : 'invert(0)')};
  }
`;

export const Time: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ ...rest }) => (
  <TimeStyled type="time" {...rest} />
);
