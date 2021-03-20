import React from 'react';
import { isDefined } from '../../../../../shared/helperFunctions';
import { EnumTypeSetting } from '../../../../../shared/settings/types';
import { Select } from '../../../styled/Select';
import { SettingHorizontalWrapper, SettingName } from './Styled';

export interface EnumDropdownSettingProps extends EnumTypeSetting {
  update: (value: string) => void;
}

export const EnumDropdownSetting: React.FC<EnumDropdownSettingProps> = ({
  name,
  value,
  defaultValue,
  possibleValues,
  format,
  update,
}) => (
  <SettingHorizontalWrapper>
    <SettingName fontSize="s">{name}</SettingName>
    <Select
      value={format(isDefined(value) ? value : defaultValue)}
      onChange={(e) => update(e.target.value)}
    >
      {possibleValues.map((value) => (
        <option key={value} value={value}>
          {format(value)}
        </option>
      ))}
    </Select>
  </SettingHorizontalWrapper>
);
