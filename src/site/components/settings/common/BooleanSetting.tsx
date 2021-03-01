import React from 'react';
import { SettingHorizontalWrapper, SettingName } from '.';
import { isDefined } from '../../../../shared/helperFunctions';
import { BooleanTypeSetting } from '../../../../shared/settings';
import { Toggle } from '../../styled/Toggle';

export interface BooleanSettingProps extends BooleanTypeSetting {
  update: (value: boolean) => void;
}

export const BooleanSetting: React.FC<BooleanSettingProps> = ({
  name,
  value,
  defaultValue,
  update,
}) => (
  <SettingHorizontalWrapper>
    <SettingName fontSize="s">{name}</SettingName>
    <Toggle checked={isDefined(value) ? value : defaultValue} onChange={() => update(!value)} />
  </SettingHorizontalWrapper>
);
