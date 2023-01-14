import * as React from 'react';
import { styled } from 'styled-components';

export interface SliderProps {
  $unset?: boolean;
}

const SliderStyled = styled.input<SliderProps>`
  flex: 1;
  min-height: 25px;
  appearance: none;
  outline: none;
  background: transparent;

  // Disable range pointer events for mobile devices
  @media only screen and (max-width: 1000px) {
    pointer-events: none;
  }
  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 8px;
    cursor: pointer;
    background: ${(props) => props.theme.Background};
    border-radius: 3px;
  }

  &::-webkit-slider-thumb {
    cursor: pointer;
    pointer-events: auto;
    appearance: none;
    width: 22px;
    height: 22px;
    background: ${({ $unset, theme }) => ($unset ? theme.Background : theme.PrimaryBackground)};
    border: 1px solid ${(props) => props.theme.Border};
    border-radius: 15px;
    margin-top: -7px;
  }

  &:disabled {
    opacity: 0.5;
  }
`;

export const Slider: React.FC<SliderProps & React.InputHTMLAttributes<HTMLInputElement>> = ({
  ...rest
}) => <SliderStyled type="range" {...rest} />;
