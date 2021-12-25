import React from 'react';
import { isDefined } from '../../../../shared/helperFunctions';
import { CameraSetting, CameraSettingDesc } from '../../../../shared/settings/camera';
import { RadioButton, RadioContainer } from '../../styled/RadioButton';
import { BooleanSetting } from './common/BooleanSetting';
import { EnumDropdownSetting } from './common/EnumDropdownSetting';
import { EnumSlider } from './common/EnumSlider';
import { EnumSliderSetting } from './common/EnumSliderSetting';
import { restoreSettings, updateTypedField } from './common/helperFunctions';
import { NumberSetting } from './common/NumberSetting';
import { SettingsExpander, SettingsExpanderHeader } from './common/SettingsExpander';
import {
  SettingHorizontalWrapper,
  SettingsHeader,
  SettingsHeaderText,
  SettingsRestoreButton,
  SettingsWrapper,
} from './common/Styled';

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

const isoPresets = [
  { name: '100', iso: 100 },
  { name: '200', iso: 200 },
  { name: '400', iso: 400 },
  { name: '800', iso: 800 },
];

export interface CameraSettingsProps {
  data: CameraSettingDesc;
  updateData: (data: CameraSetting) => void;
}

export const ExposureSetting: React.FC<CameraSettingsProps> = ({ data, updateData }) => (
  <React.Fragment>
    <SettingHorizontalWrapper>
      <SettingsHeaderText fontSize="s">Mode</SettingsHeaderText>
      <RadioContainer>
        <RadioButton
          active={isDefined(data.ISO.value)}
          onClick={() => updateData({ ISO: data.ISO.defaultValue, exposure: undefined })}
        >
          ISO
        </RadioButton>
        <RadioButton
          active={!isDefined(data.ISO.value)}
          onClick={() => updateData({ exposure: data.exposure.defaultValue, ISO: undefined })}
        >
          EV
        </RadioButton>
      </RadioContainer>
    </SettingHorizontalWrapper>

    {isDefined(data.ISO.value) ? (
      <EnumSlider
        name={data.ISO.name}
        items={isoPresets}
        predicate={(x) => x.iso === data.ISO.value}
        displayValue={(x) => x.name}
        update={(x) => updateData({ ISO: x.iso })}
      />
    ) : (
      <React.Fragment>
        <EnumSliderSetting {...data.exposure} update={(x) => updateData({ exposure: x })} />
        <NumberSetting {...data.ev} update={(x) => updateData({ ev: x })} />
      </React.Fragment>
    )}
  </React.Fragment>
);

export const ShutterSetting: React.FC<CameraSettingsProps> = ({ data, updateData }) => (
  <EnumSlider
    name={data.shutter.name}
    items={shutterPresets}
    predicate={(x) => x.time === data.shutter.value}
    displayValue={(x) => x.name}
    update={(x) => updateData({ shutter: x.time })}
  />
);

export const AwbSetting: React.FC<CameraSettingsProps> = ({ data, updateData }) => (
  <React.Fragment>
    <EnumSliderSetting {...data.awb} update={(x) => updateData({ awb: x })} />

    {data.awb.value === 'off' && (
      <React.Fragment>
        <NumberSetting {...data.awbb} update={(x) => updateData({ awbb: x })} />
        <NumberSetting {...data.awbr} update={(x) => updateData({ awbr: x })} />
      </React.Fragment>
    )}
  </React.Fragment>
);

export const EffectSetting: React.FC<CameraSettingsProps> = ({ data, updateData }) => (
  <EnumDropdownSetting {...data.imxfx} update={(x) => updateData({ imxfx: x })} />
);

export const CameraSettings: React.FC<CameraSettingsProps> = ({ data, updateData }) => {
  const updateField = updateTypedField(updateData);

  return (
    <SettingsWrapper>
      <SettingsHeader fontSize="m">
        <SettingsHeaderText>Camera</SettingsHeaderText>
        <SettingsRestoreButton
          type="SettingsRestore"
          onClick={() => updateData(restoreSettings(data))}
        />
      </SettingsHeader>

      <SettingsExpander header={<SettingsExpanderHeader>General</SettingsExpanderHeader>}>
        <NumberSetting {...data.sharpness} update={updateField('sharpness')} />
        <NumberSetting {...data.contrast} update={updateField('contrast')} />
        <NumberSetting {...data.brightness} update={updateField('brightness')} />
        <NumberSetting {...data.saturation} update={updateField('saturation')} />
      </SettingsExpander>

      <SettingsExpander header={<SettingsExpanderHeader>Exposure</SettingsExpanderHeader>}>
        <ShutterSetting data={data} updateData={updateData} />
        <ExposureSetting data={data} updateData={updateData} />

        {isDefined(data.exposure.value) && (
          <React.Fragment>
            <NumberSetting {...data.analoggain} update={updateField('analoggain')} />
            <NumberSetting {...data.digitalgain} update={updateField('digitalgain')} />
          </React.Fragment>
        )}

        <EnumSliderSetting {...data.metering} update={updateField('metering')} />
        <EnumSliderSetting {...data.drc} update={updateField('drc')} />
      </SettingsExpander>

      <SettingsExpander header={<SettingsExpanderHeader>White Balance</SettingsExpanderHeader>}>
        <AwbSetting data={data} updateData={updateData} />
      </SettingsExpander>

      <SettingsExpander header={<SettingsExpanderHeader>Effect</SettingsExpanderHeader>}>
        <EffectSetting data={data} updateData={updateData} />
        <BooleanSetting {...data.colfxEnabled} update={updateField('colfxEnabled')} />
        {data.colfxEnabled.value && (
          <React.Fragment>
            <NumberSetting {...data.colfxu} update={updateField('colfxu')} />
            <NumberSetting {...data.colfxv} update={updateField('colfxv')} />
          </React.Fragment>
        )}
      </SettingsExpander>

      <SettingsExpander header={<SettingsExpanderHeader>Other</SettingsExpanderHeader>}>
        <NumberSetting {...data.mode} update={updateField('mode')} />
        <NumberSetting {...data.rotation} update={updateField('rotation')} />
        <BooleanSetting {...data.hflip} update={updateField('hflip')} />
        <BooleanSetting {...data.vflip} update={updateField('vflip')} />
        <EnumDropdownSetting {...data.flicker} update={updateField('flicker')} />
        <EnumDropdownSetting {...data.camselect} update={updateField('camselect')} />
      </SettingsExpander>
    </SettingsWrapper>
  );
};
