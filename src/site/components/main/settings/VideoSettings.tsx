import React from 'react';
import { VidSetting, VidSettingDesc } from '../../../../shared/settings/vid';
import { BooleanSetting } from './common/BooleanSetting';
import { EnumDropdownSetting } from './common/EnumDropdownSetting';
import { EnumSlider } from './common/EnumSlider';
import { restoreSettings, updateTypedField } from './common/helperFunctions';
import { NumberSetting } from './common/NumberSetting';
import { SettingsExpander, SettingsExpanderHeader } from './common/SettingsExpander';
import {
  SettingsHeader,
  SettingsHeaderText,
  SettingsRestoreButton,
  SettingsWrapper,
} from './common/Styled';
import { TimeSetting } from './common/TimeSetting';

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

const timeoutPresets = [
  { name: 'endless', value: 0 },
  { name: '5 sec', value: 5000 },
  { name: '10 sec', value: 10 * 1000 },
  { name: '1 min', value: 60 * 1000 },
  { name: '5 min', value: 5 * 60 * 1000 },
  { name: '10 min', value: 10 * 60 * 1000 },
];

export interface VidSettingsProps {
  data: VidSettingDesc;
  updateData: (data: VidSetting) => void;
}

export const VideoSettings: React.FC<VidSettingsProps> = ({ data, updateData }) => {
  const updateField = updateTypedField(updateData);

  return (
    <SettingsWrapper>
      <SettingsHeader fontSize="m">
        <SettingsHeaderText>Video</SettingsHeaderText>
        <SettingsRestoreButton
          type="SettingsRestore"
          onClick={() => updateData(restoreSettings(data))}
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
      </SettingsExpander>

      <SettingsExpander
        header={
          <EnumSlider
            name="Duration"
            items={timeoutPresets}
            predicate={(x) => x.value === data.timeout.value}
            displayValue={(x) => x.name}
            update={(x) => updateData({ timeout: x.value })}
          />
        }
      >
        <TimeSetting {...data.timeout} update={updateField('timeout')} />
      </SettingsExpander>

      <SettingsExpander header={<SettingsExpanderHeader>Other</SettingsExpanderHeader>}>
        <EnumDropdownSetting {...data.codec} update={updateField('codec')} />
        <EnumDropdownSetting {...data.profile} update={updateField('profile')} />
        <EnumDropdownSetting {...data.level} update={updateField('level')} />
        <EnumDropdownSetting {...data.irefresh} update={updateField('irefresh')} />
        <BooleanSetting {...data.inline} update={updateField('inline')} />
        <BooleanSetting {...data.spstimings} update={updateField('spstimings')} />
        <BooleanSetting {...data.flush} update={updateField('flush')} />
      </SettingsExpander>
    </SettingsWrapper>
  );
};
