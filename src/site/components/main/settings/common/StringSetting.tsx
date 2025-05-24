import React, { useState } from 'react';
import { StringTypeSetting } from '../../../../../shared/settings/types.js';
import { Input } from '../../../styled/Input.js';
import { SettingHorizontalWrapper, SettingName } from './Styled.js';

export interface StringSettingProps extends StringTypeSetting {
  update: (value: string) => void;
}

export const StringSetting: React.FC<StringSettingProps> = ({ name, value, update }) => {
  const [inputValue, setInputValue] = useState<string>();

  const updateValue = () => {
    if (inputValue) update(inputValue);
    setInputValue(undefined);
  };

  return (
    <SettingHorizontalWrapper>
      <SettingName fontSize="s">{name}</SettingName>
      <Input
        value={inputValue || value || ''}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={updateValue}
      />
    </SettingHorizontalWrapper>
  );
};
