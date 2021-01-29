import * as React from 'react';
import styled from 'styled-components';
import { Label } from './Label';

export const Slider = styled.input`
  flex: 1;
  appearance: none;
  outline: none;

  border-radius: 3px;
  margin: 1em 0.5em;
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

const SliderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const SliderLabel = styled(Label)`
  display: flex;
  flex-basis: 2em;

  border-radius: 20px;
  padding: 0.6em 0.2em;

  justify-content: center;
  align-items: center;
`;

export const SliderValue: React.FC<SliderValueProps> = ({ ...rest }) => (
  <SliderWrapper>
    <Slider type="range" {...rest} />
    <SliderLabel fontSize="s">{rest.value}</SliderLabel>
  </SliderWrapper>
);
