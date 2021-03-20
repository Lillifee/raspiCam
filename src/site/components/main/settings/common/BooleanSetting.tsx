import React from 'react';
import { isDefined } from '../../../../../shared/helperFunctions';
import { BooleanTypeSetting } from '../../../../../shared/settings/types';
import { Toggle } from '../../../styled/Toggle';
import { SettingHorizontalWrapper, SettingName } from './Styled';

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
