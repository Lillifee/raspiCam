import * as React from 'react';
import styled from 'styled-components';

export const Slider = styled.input`
  flex: 1;
  appearance: none;
  outline: none;
  border-radius: 3px;
  margin: 0.5em 0;
  height: 8px;
  background: ${(props) => props.theme.Background};

  ::-webkit-slider-thumb {
    cursor: pointer;
    appearance: none;
    width: 22px;
    height: 22px;
    background: ${(props) => props.theme.PrimaryBackground};
    border: 2px solid ${(props) => props.theme.SubBackground};
    border-radius: 15px;
  }
`;

export type SliderValueProps = React.InputHTMLAttributes<HTMLInputElement>;

// TODO remove?
const SliderWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const SliderValue: React.FC<SliderValueProps> = ({ ...rest }) => (
  <SliderWrapper>
    <Slider type="range" {...rest} />
  </SliderWrapper>
);
