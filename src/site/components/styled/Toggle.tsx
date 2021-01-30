import * as React from 'react';
import styled from 'styled-components';

const CheckBoxWrapper = styled.div`
  display: flex;
  align-content: center;
  justify-content: center;
  position: relative;
`;

const CheckBoxLabel = styled.label`
  position: absolute;
  top: 0;
  left: 0;
  width: 48px;
  height: 20px;
  border-radius: 15px;
  background: ${(props) => props.theme.Background};
  border: 2px solid ${(props) => props.theme.Background};

  cursor: pointer;
  &::after {
    content: '';
    display: block;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    margin: 2px;
    background: ${(props) => props.theme.Foreground};
    box-shadow: 1px 3px 3px 1px rgba(0, 0, 0, 0.2);
    transition: 0.2s;
  }
`;

const CheckBox = styled.input`
  opacity: 0;
  z-index: 1;
  width: 54px;
  height: 24px;
  border-radius: 15px;
  &:checked + ${CheckBoxLabel} {
    background: ${(props) => props.theme.PrimaryBackground};
    &::after {
      content: '';
      display: block;
      border-radius: 50%;
      width: 16px;
      height: 16px;
      margin-left: 28px;
      transition: 0.2s;
    }
  }
`;

export type ToggleProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Toggle: React.FC<ToggleProps> = ({ ...rest }) => (
  <CheckBoxWrapper>
    <CheckBox id="checkbox" type="checkbox" {...rest} />
    <CheckBoxLabel htmlFor="checkbox" />
  </CheckBoxWrapper>
);
