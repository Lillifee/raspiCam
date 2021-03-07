import React from 'react';
import { applySettings } from '../../../shared/settings/helper';
import { streamSettingDesc, StreamSettingDesc } from '../../../shared/settings/stream';
import { Setting } from '../../../shared/settings/types';
import { useFetch } from '../common/hooks/useFetch';
import { EnumDropdownSetting } from './common/EnumDropdownSetting';
import { EnumSlider } from './common/EnumSlider';
import { updateTypedField, restoreSettings } from './common/helperFunctions';
import { NumberSetting } from './common/NumberSetting';
import { SettingsExpander } from './common/SettingsExpander';
import {
  SettingsWrapper,
  SettingsHeader,
  SettingsHeaderText,
  SettingsRestoreButton,
} from './common/Styled';

const videoResolutionPresets = [
  { name: '240p', width: 426, height: 240 },
  { name: '360p', width: 640, height: 360 },
  { name: '480p', width: 854, height: 480 },
  { name: '720p', width: 1280, height: 720 },
  { name: '1080p', width: 1920, height: 1080 },
];

const qualityPresets = [
  { name: 'low', qp: 30 },
  { name: 'medium', qp: 20 },
  { name: 'high', qp: 15 },
];

export interface StreamSettingsProps {
  setLoading: (loading: boolean) => void;
}
export const StreamSettings: React.FC<StreamSettingsProps> = ({ setLoading }) => {
  const [state, updateData] = useFetch<Setting<StreamSettingDesc>>('/api/stream', {});
  const data = applySettings(streamSettingDesc, { ...state.data, ...state.input });
  const updateField = updateTypedField(updateData);

  React.useEffect(() => setLoading(state.isUpdating), [setLoading, state.isUpdating]);

  return (
    <SettingsWrapper>
      <SettingsHeader fontSize="m">
        <SettingsHeaderText>Stream</SettingsHeaderText>
        <SettingsRestoreButton
          type="SettingsRestore"
          onClick={() => updateData(restoreSettings(state.data))}
        />
      </SettingsHeader>

      <SettingsExpander
        header={
          <EnumSlider
            name="Resolution"
            items={videoResolutionPresets}
            predicate={(x) => x.width === data.width.value && x.height === data.height.value}
            displayValue={(x) => x.name}
            update={(x) => updateData({ width: x.width, height: x.height })}
          />
        }
      >
        <NumberSetting {...data.width} update={updateField('width')} />
        <NumberSetting {...data.height} update={updateField('height')} />
        <NumberSetting {...data.framerate} update={updateField('framerate')} />
      </SettingsExpander>

      <SettingsExpander
        header={
          <EnumSlider
            name="Quality"
            items={qualityPresets}
            predicate={(x) => x.qp === data.qp.value}
            displayValue={(x) => x.name}
            update={(x) => updateData({ qp: x.qp })}
          />
        }
      >
        <NumberSetting {...data.qp} update={updateField('qp')} />
        <NumberSetting {...data.bitrate} update={updateField('bitrate')} />
        <EnumDropdownSetting {...data.level} update={updateField('level')} />
        <EnumDropdownSetting {...data.irefresh} update={updateField('irefresh')} />
      </SettingsExpander>
    </SettingsWrapper>
  );
};
