import React from 'react';
import { VideoSetting, VideoSettingDesc } from '../../../../shared/settings/video.js';
import { BooleanSetting } from './common/BooleanSetting.js';
import { EnumDropdownSetting } from './common/EnumDropdownSetting.js';
import { EnumSlider } from './common/EnumSlider.js';
import { restoreSettings, updateTypedField } from './common/helperFunctions.js';
import { NumberSetting } from './common/NumberSetting.js';
import { SettingsExpander, SettingsExpanderHeader } from './common/SettingsExpander.js';
import {
  SettingsHeader,
  SettingsHeaderText,
  SettingsRestoreButton,
  SettingsWrapper,
} from './common/Styled.js';
import { TimeSetting } from './common/TimeSetting.js';

const videoResolutionPresets = [
  { name: '240p', width: 426, height: 240 },
  { name: '360p', width: 640, height: 360 },
  { name: '480p', width: 854, height: 480 },
  { name: '720p', width: 1280, height: 720 },
  { name: '1080p', width: 1920, height: 1080 },
];

const qualityPresets = [
  { name: 'low', bitrate: 1000000 },
  { name: 'medium', bitrate: 10000000 },
  { name: 'high', bitrate: 15000000 },
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
  video: VideoSettingDesc;
  updateVideo: (data: VideoSetting) => void;
}

export const VideoSettings: React.FC<VidSettingsProps> = ({ video, updateVideo }) => {
  const updateField = updateTypedField(updateVideo);

  return (
    <SettingsWrapper>
      <SettingsHeader fontSize="m">
        <SettingsHeaderText>Video</SettingsHeaderText>
        <SettingsRestoreButton
          type="SettingsRestore"
          onClick={() => updateVideo(restoreSettings(video))}
        />
      </SettingsHeader>

      <SettingsExpander
        header={
          <EnumSlider
            name="Resolution"
            items={videoResolutionPresets}
            predicate={(x) => x.width === video.width.value && x.height === video.height.value}
            displayValue={(x) => x.name}
            update={(x) => updateVideo({ width: x.width, height: x.height })}
          />
        }
      >
        <NumberSetting {...video.width} update={updateField('width')} />
        <NumberSetting {...video.height} update={updateField('height')} />
        <NumberSetting {...video.framerate} update={updateField('framerate')} />
      </SettingsExpander>

      <SettingsExpander
        header={
          <EnumSlider
            name="Quality"
            items={qualityPresets}
            predicate={(x) => x.bitrate === video.bitrate.value}
            displayValue={(x) => x.name}
            update={(x) => updateVideo({ bitrate: x.bitrate })}
          />
        }
      >
        <NumberSetting {...video.bitrate} update={updateField('bitrate')} />
      </SettingsExpander>

      <SettingsExpander
        header={
          <EnumSlider
            name="Duration"
            items={timeoutPresets}
            predicate={(x) => x.value === video.timeout.value}
            displayValue={(x) => x.name}
            update={(x) => updateVideo({ timeout: x.value })}
          />
        }
      >
        <TimeSetting {...video.timeout} update={updateField('timeout')} />
      </SettingsExpander>

      <SettingsExpander header={<SettingsExpanderHeader>Other</SettingsExpanderHeader>}>
        <EnumDropdownSetting {...video.codec} update={updateField('codec')} />
        <EnumDropdownSetting {...video.profile} update={updateField('profile')} />
        <EnumDropdownSetting {...video.level} update={updateField('level')} />
        <BooleanSetting {...video.inline} update={updateField('inline')} />
        <BooleanSetting {...video.flush} update={updateField('flush')} />
      </SettingsExpander>
    </SettingsWrapper>
  );
};
