import React from 'react';
import { SettingHorizontalWrapper, SettingName } from '.';
import { isDefined } from '../../../../shared/helperFunctions';
import { EnumTypeSetting } from '../../../../shared/settings';
import { Select } from '../../styled/Select';

export interface EnumSettingProps extends EnumTypeSetting {
  update: (value: string) => void;
}

export const EnumSetting: React.FC<EnumSettingProps> = ({
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
