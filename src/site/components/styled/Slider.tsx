import * as React from 'react';
import styled from 'styled-components';

export interface SliderProps {
  unset?: boolean;
}

const SliderStyled = styled.input<SliderProps>`
  flex: 1;
  appearance: none;
  outline: none;
  border-radius: 3px;
  margin: 0.5em 0;
  height: 8px;
  background: ${(props) => props.theme.Background};

  // Disable range pointer events for mobile devices
  @media only screen and (max-width: 800px) {
    pointer-events: none;
  }

  ::-webkit-slider-thumb {
    cursor: pointer;
    pointer-events: auto;
    appearance: none;
    width: 22px;
    height: 22px;
    background: ${(props) =>
      props.unset ? props.theme.Background : props.theme.PrimaryBackground};
    border: 2px solid ${(props) => props.theme.SubBackground};
    border-radius: 15px;
  }

  &:disabled {
    opacity: 0.5;
  }
`;

export const Slider: React.FC<SliderProps & React.InputHTMLAttributes<HTMLInputElement>> = ({
  ...rest
}) => <SliderStyled type="range" {...rest} />;
