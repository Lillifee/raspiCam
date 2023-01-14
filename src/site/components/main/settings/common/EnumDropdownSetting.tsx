import React from 'react';
import { isDefined } from '../../../../../shared/helperFunctions.js';
import { EnumTypeSetting } from '../../../../../shared/settings/types.js';
import { Select } from '../../../styled/Select.js';
import { SettingHorizontalWrapper, SettingName } from './Styled.js';

export interface EnumDropdownSettingProps<T> extends EnumTypeSetting<T> {
  update: (value: T) => void;
}

export const EnumDropdownSetting = <T extends string>({
  name,
  value,
  defaultValue,
  possibleValues,
  format,
  update,
}: EnumDropdownSettingProps<T>) => (
  <SettingHorizontalWrapper>
    <SettingName fontSize="s">{name}</SettingName>
    <Select
      value={format(isDefined(value) ? value : defaultValue)}
      onChange={(e) => update(e.target.value as T)}
    >
      {possibleValues.map((value) => (
        <option key={value} value={value}>
          {format(value)}
        </option>
      ))}
    </Select>
  </SettingHorizontalWrapper>
);
