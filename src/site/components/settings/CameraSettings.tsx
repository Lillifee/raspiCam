import React from 'react';
import { isDefined } from '../../../shared/helperFunctions';
import {
  applySettings,
  CameraSettingDesc,
  cameraSettingDesc,
  Setting,
} from '../../../shared/settings';
import { useFetch } from '../common/hooks/useFetch';
import { RadioButton, RadioContainer } from '../styled/RadioButton';
import {
  SettingsWrapper,
  SettingsHeader,
  SettingsHeaderText,
  SettingsRestoreButton,
  restoreSettings,
  NumberSetting,
  EnumDropdownSetting,
  SettingsExpander,
  SettingsExpanderHeader,
  EnumSliderSetting,
  BooleanSetting,
  EnumSlider,
  SettingHorizontalWrapper,
  updateTypedField,
} from './common';

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
  setLoading: (loading: boolean) => void;
}

export const CameraSettings: React.FC<CameraSettingsProps> = ({ setLoading }) => {
  const [state, updateData] = useFetch<Setting<CameraSettingDesc>>('/api/camera', {}, 2000);
  const data = applySettings(cameraSettingDesc, { ...state.data, ...state.input });
  const updateField = updateTypedField(updateData);

  React.useEffect(() => setLoading(state.isUpdating), [setLoading, state.isUpdating]);

  return (
    <SettingsWrapper>
      <SettingsHeader fontSize="m">
        <SettingsHeaderText>Camera</SettingsHeaderText>
        <SettingsRestoreButton
          type="SettingsRestore"
          onClick={() => updateData(restoreSettings(state.data))}
        />
      </SettingsHeader>

      <SettingsExpander header={<SettingsExpanderHeader>General</SettingsExpanderHeader>}>
        <NumberSetting {...data.sharpness} update={updateField('sharpness')} />
        <NumberSetting {...data.contrast} update={updateField('contrast')} />
        <NumberSetting {...data.brightness} update={updateField('brightness')} />
        <NumberSetting {...data.saturation} update={updateField('saturation')} />
      </SettingsExpander>

      <SettingsExpander header={<SettingsExpanderHeader>Exposure</SettingsExpanderHeader>}>
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
              active={isDefined(data.exposure.value)}
              onClick={() => updateData({ exposure: data.exposure.defaultValue, ISO: undefined })}
            >
              EV
            </RadioButton>
          </RadioContainer>
        </SettingHorizontalWrapper>

        <EnumSlider
          name={data.shutter.name}
          items={shutterPresets}
          predicate={(x) => x.time === data.shutter.value}
          displayValue={(x) => x.name}
          update={(x) => updateField('shutter')(x.time)}
        />

        {isDefined(data.ISO.value) && (
          <EnumSlider
            name={data.ISO.name}
            items={isoPresets}
            predicate={(x) => x.iso === data.ISO.value}
            displayValue={(x) => x.name}
            update={(x) => updateField('ISO')(x.iso)}
          />
        )}

        {isDefined(data.exposure.value) && (
          <React.Fragment>
            <EnumSliderSetting {...data.exposure} update={updateField('exposure')} />
            <NumberSetting {...data.ev} update={updateField('ev')} />

            <NumberSetting {...data.analoggain} update={updateField('analoggain')} />
            <NumberSetting {...data.digitalgain} update={updateField('digitalgain')} />
          </React.Fragment>
        )}
        <EnumSliderSetting {...data.metering} update={updateField('metering')} />
        <EnumSliderSetting {...data.drc} update={updateField('drc')} />
      </SettingsExpander>

      <SettingsExpander header={<SettingsExpanderHeader>White Balance</SettingsExpanderHeader>}>
        <EnumSliderSetting {...data.awb} update={updateField('awb')} />

        {data.awb.value === 'off' && (
          <React.Fragment>
            <NumberSetting {...data.awbb} update={updateField('awbb')} />
            <NumberSetting {...data.awbr} update={updateField('awbr')} />
          </React.Fragment>
        )}
      </SettingsExpander>

      <SettingsExpander header={<SettingsExpanderHeader>Effect</SettingsExpanderHeader>}>
        <EnumDropdownSetting {...data.imxfx} update={updateField('imxfx')} />
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
        <BooleanSetting {...data.hflip} update={updateField('hflip')} />
        <BooleanSetting {...data.vflip} update={updateField('vflip')} />
        <EnumDropdownSetting {...data.flicker} update={updateField('flicker')} />
        <EnumDropdownSetting {...data.camselect} update={updateField('camselect')} />
      </SettingsExpander>
    </SettingsWrapper>
  );
};
