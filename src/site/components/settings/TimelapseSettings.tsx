import React from 'react';
import { applySettings } from '../../../shared/settings/helper';
import { timelapseSettingDesc, TimelapseSettingDesc } from '../../../shared/settings/timelapse';
import { Setting } from '../../../shared/settings/types';
import { useFetch } from '../common/hooks/useFetch';
import { EnumSlider } from './common/EnumSlider';
import { updateTypedField, restoreSettings } from './common/helperFunctions';
import { SettingsExpander } from './common/SettingsExpander';
import {
  SettingsWrapper,
  SettingsHeader,
  SettingsHeaderText,
  SettingsRestoreButton,
} from './common/Styled';
import { TimeSetting } from './common/TimeSetting';

const timelapsePresets = [
  { name: '3 sec', value: 3 * 1000 },
  { name: '10 sec', value: 10 * 1000 },
  { name: '1 min', value: 60 * 1000 },
  { name: '5 min', value: 5 * 60 * 1000 },
  { name: '10 min', value: 10 * 60 * 1000 },
];

export const TimelapseSettings: React.FC = () => {
  const [state, updateData] = useFetch<Setting<TimelapseSettingDesc>>('/api/timelapse', {});
  const data = applySettings(timelapseSettingDesc, { ...state.data, ...state.input });
  const updateField = updateTypedField(updateData);

  return (
    <SettingsWrapper>
      <SettingsHeader fontSize="m">
        <SettingsHeaderText>Timelapse</SettingsHeaderText>
        <SettingsRestoreButton
          type="SettingsRestore"
          onClick={() => updateData(restoreSettings(state.data))}
        />
      </SettingsHeader>

      <SettingsExpander
        header={
          <EnumSlider
            name="Timelapse"
            items={timelapsePresets}
            predicate={(x) => x.value === data.timelapse.value}
            displayValue={(x) => x.name}
            update={(x) => updateData({ timelapse: x.value })}
          />
        }
      >
        <TimeSetting {...data.timelapse} update={updateField('timelapse')} />
        <TimeSetting {...data.timeout} update={updateField('timeout')} />
      </SettingsExpander>
    </SettingsWrapper>
  );
};
