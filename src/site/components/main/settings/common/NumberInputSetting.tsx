import React, { useState } from 'react';
import { NumberTypeSetting } from '../../../../../shared/settings/types.js';
import { SettingHorizontalWrapper, SettingName } from './Styled.js';
import { Input } from '../../../styled/Input.js';
import { styled } from 'styled-components';

const NumberInput = styled(Input)`
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
  }
`;

export interface NumberInputSettingProps extends NumberTypeSetting {
  update: (value: number) => void;
}

export const NumberInputSetting: React.FC<NumberInputSettingProps> = ({ name, value, update }) => {
  const [inputValue, setInputValue] = useState<string | undefined>();

  const updateValue = () => {
    if (inputValue) update(parseFloat(inputValue));
    setInputValue(undefined);
  };

  return (
    <SettingHorizontalWrapper>
      <SettingName fontSize="s">{name}</SettingName>
      <NumberInput
        type="number"
        value={inputValue || value || ''}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={updateValue}
      />
    </SettingHorizontalWrapper>
  );
};
