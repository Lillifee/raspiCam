import React from 'react';
import styled from 'styled-components';
import { IconMap, IconProps } from '../common/Icon.js';

export type ButtonIconProps = React.HTMLProps<HTMLButtonElement> & IconProps;

/* Button icon */
export const ButtonIconElement: React.FC<ButtonIconProps> = ({ type, ...rest }) => (
  <button {...rest}>{IconMap[type]}</button>
);

export const ButtonIcon = styled(ButtonIconElement)`
  border: 0;
  outline: none;
  display: flex;
  fill: ${(props) => props.theme.Foreground};
  background: transparent;

  padding: 0.5em;
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
