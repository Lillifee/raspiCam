import React from 'react';
import styled from 'styled-components';
import { IconProps, IconMap } from '../common/icons';

/* Button icon */
export const ButtonIconElement: React.FC<React.HTMLProps<HTMLButtonElement> & IconProps> = ({
  type,
  ...rest
}) => <button {...rest}>{IconMap[type]}</button>;

export const ButtonIcon = styled(ButtonIconElement)`
  border: 0;
  outline: none;
  display: flex;
  fill: ${(props) => props.theme.Foreground};
  background: transparent;

  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  > svg {
    width: 24px;
    height: 24px;
  }

  :disabled {
    opacity: 0.5;
  }

  :active {
    background: ${(props) => props.theme.SelectedBackground};
    color: ${(props) => props.theme.SelectedForeground};
    fill: ${(props) => props.theme.SelectedForeground};
  }
`;
