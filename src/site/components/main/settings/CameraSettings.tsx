import React from 'react';
import { CameraSetting, CameraSettingDesc } from '../../../../shared/settings/camera.js';
import { BooleanSetting } from './common/BooleanSetting.js';
import { EnumDropdownSetting } from './common/EnumDropdownSetting.js';
import { EnumSlider } from './common/EnumSlider.js';
import { EnumSliderSetting } from './common/EnumSliderSetting.js';
import { restoreSettings, updateTypedField } from './common/helperFunctions.js';
import { NumberSetting } from './common/NumberSetting.js';
import { SettingsExpander, SettingsExpanderHeader } from './common/SettingsExpander.js';
import { SettingsRestore } from './common/SettingsRestore.js';
import { SettingsHeader, SettingsHeaderText, SettingsWrapper } from './common/Styled.js';

const secToMicro = (seconds: number) => Math.round(seconds * 1e6);

const shutterPresets = [
  { name: 'auto', time: undefined },
  { name: '1⁄1000 s', time: secToMicro(1 / 1000) },
  { name: '1⁄500 s', time: secToMicro(1 / 500) },
  { name: '1⁄250 s', time: secToMicro(1 / 250) },
  { name: '​1⁄125 s', time: secToMicro(1 / 125) },
  { name: '​1⁄60 s', time: secToMicro(1 / 60) },
  { name: '​1⁄30 s', time: secToMicro(1 / 30) },
  { name: '​1⁄15 s', time: secToMicro(1 / 15) },
  { name: '1⁄8 s', time: secToMicro(1 / 8) },
  { name: '​1⁄4 s', time: secToMicro(1 / 4) },
  { name: '​​1⁄2 s', time: secToMicro(1 / 2) },
  { name: '1 s', time: secToMicro(1) },
  { name: '1.5 s', time: secToMicro(1.5) },
  { name: '2 s', time: secToMicro(2) },
  { name: '2.5 s', time: secToMicro(2.5) },
];

interface DigitalZoomPreset {
  name: string;
  roi: CameraSetting['roi'];
}

const digitalZoomPresets: DigitalZoomPreset[] = [
  { name: '1x', roi: undefined },
  { name: '2x', roi: '0.25,0.25,0.5,0.5' },
  { name: '5x', roi: '0.4,0.4,0.2,0.2' },
  { name: '10x', roi: '0.45,0.45,0.1,0.1' },
];

export interface CameraSettingsProps {
  camera: CameraSettingDesc;
  updateCamera: (data: CameraSetting) => void;
}

export const ExposureSetting: React.FC<CameraSettingsProps> = ({ camera, updateCamera }) => (
  <React.Fragment>
    <EnumSliderSetting {...camera.exposure} update={(x) => updateCamera({ exposure: x })} />
    <NumberSetting {...camera.ev} update={(x) => updateCamera({ ev: x })} />
  </React.Fragment>
);

export const ShutterSetting: React.FC<CameraSettingsProps> = ({ camera, updateCamera }) => (
  <EnumSlider
    name={camera.shutter.name}
    items={shutterPresets}
    predicate={(x) => x.time === camera.shutter.value}
    displayValue={(x) => x.name}
    update={(x) => updateCamera({ shutter: x.time })}
  />
);

export const AwbSetting: React.FC<CameraSettingsProps> = ({ camera, updateCamera }) => (
  <React.Fragment>
    <EnumSliderSetting {...camera.awb} update={(x) => updateCamera({ awb: x })} />

    {camera.awb.value === 'manual' && (
      <React.Fragment>
        <NumberSetting {...camera.awbb} update={(x) => updateCamera({ awbb: x })} />
        <NumberSetting {...camera.awbr} update={(x) => updateCamera({ awbr: x })} />
      </React.Fragment>
    )}
  </React.Fragment>
);

export const CameraSettings: React.FC<CameraSettingsProps> = ({ camera, updateCamera }) => {
  const updateField = updateTypedField(updateCamera);

  return (
    <SettingsWrapper>
      <SettingsHeader fontSize="m">
        <SettingsHeaderText>Camera</SettingsHeaderText>
        <SettingsRestore
          name="Camera"
          updateSettings={() => updateCamera(restoreSettings(camera))}
        />
      </SettingsHeader>

      <SettingsExpander header={<SettingsExpanderHeader>General</SettingsExpanderHeader>}>
        <NumberSetting {...camera.sharpness} update={updateField('sharpness')} />
        <NumberSetting {...camera.contrast} update={updateField('contrast')} />
        <NumberSetting {...camera.brightness} update={updateField('brightness')} />
        <NumberSetting {...camera.saturation} update={updateField('saturation')} />
      </SettingsExpander>

      <SettingsExpander header={<SettingsExpanderHeader>Exposure</SettingsExpanderHeader>}>
        <ShutterSetting camera={camera} updateCamera={updateCamera} />
        <ExposureSetting camera={camera} updateCamera={updateCamera} />
        <EnumDropdownSetting {...camera.denoise} update={updateField('denoise')} />
        <NumberSetting {...camera.gain} update={updateField('gain')} />
        <EnumSliderSetting {...camera.metering} update={updateField('metering')} />
      </SettingsExpander>

      <SettingsExpander header={<SettingsExpanderHeader>White Balance</SettingsExpanderHeader>}>
        <AwbSetting camera={camera} updateCamera={updateCamera} />
      </SettingsExpander>

      <SettingsExpander header={<SettingsExpanderHeader>Other</SettingsExpanderHeader>}>
        <BooleanSetting {...camera.hdr} update={updateField('hdr')} />
        <NumberSetting {...camera.rotation} update={updateField('rotation')} />
        <BooleanSetting {...camera.hflip} update={updateField('hflip')} />
        <BooleanSetting {...camera.vflip} update={updateField('vflip')} />
        <EnumSlider
          name="Digital zoom"
          items={digitalZoomPresets}
          predicate={(x) => x.roi === camera.roi.value}
          displayValue={(x) => x.name}
          update={(x) => updateCamera({ roi: x.roi })}
        />
        <EnumDropdownSetting {...camera.camera} update={updateField('camera')} />
      </SettingsExpander>

      <SettingsExpander header={<SettingsExpanderHeader>Autofocus</SettingsExpanderHeader>}>
        <EnumDropdownSetting {...camera['autofocus-mode']} update={updateField('autofocus-mode')} />
        <EnumDropdownSetting
          {...camera['autofocus-range']}
          update={updateField('autofocus-range')}
        />
        <EnumDropdownSetting
          {...camera['autofocus-speed']}
          update={updateField('autofocus-speed')}
        />
        <EnumDropdownSetting
          {...camera['autofocus-window']}
          update={updateField('autofocus-window')}
        />
        <NumberSetting {...camera['lens-position']} update={updateField('lens-position')} />
      </SettingsExpander>
    </SettingsWrapper>
  );
};
