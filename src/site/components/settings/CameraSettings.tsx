import React from 'react';
import {
  applySettings,
  CameraSettingDesc,
  cameraSettingDesc,
  Setting,
} from '../../../shared/settings';
import { useFetch } from '../common/hooks/useFetch';
import {
  getTypedSetting,
  SettingsWrapper,
  SettingsHeader,
  SettingsHeaderText,
  SettingsRestoreButton,
  restoreSettings,
  NumberSetting,
  EnumSetting,
  SettingsExpander,
  SettingsExpanderHeader,
  EnumSliderSetting,
  BooleanSetting,
  EnumSlider,
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
  { name: 'off', iso: undefined },
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
  const getSetting = getTypedSetting(data, updateData);

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
        <NumberSetting {...getSetting('sharpness')} />
        <NumberSetting {...getSetting('contrast')} />
        <NumberSetting {...getSetting('brightness')} />
        <NumberSetting {...getSetting('saturation')} />
      </SettingsExpander>

      <SettingsExpander header={<SettingsExpanderHeader>Exposure</SettingsExpanderHeader>}>
        <EnumSlider
          name={data.shutter.name}
          items={shutterPresets}
          predicate={(x) => x.time === data.shutter.value}
          displayValue={(x) => x.name}
          update={(x) => updateData({ shutter: x.time })}
        />

        <EnumSlider
          name={data.ISO.name}
          items={isoPresets}
          predicate={(x) => x.iso === data.ISO.value}
          displayValue={(x) => x.name}
          update={(x) => updateData({ ISO: x.iso })}
        />

        <React.Fragment>
          <EnumSliderSetting disabled={!!data.ISO.value} {...getSetting('exposure')} />
          <NumberSetting disabled={!!data.ISO.value} {...getSetting('ev')} />
          <NumberSetting disabled={!!data.ISO.value} {...getSetting('analoggain')} />
          <NumberSetting disabled={!!data.ISO.value} {...getSetting('digitalgain')} />

          <EnumSliderSetting disabled={!!data.ISO.value} {...getSetting('metering')} />
          <EnumSliderSetting disabled={!!data.ISO.value} {...getSetting('drc')} />
        </React.Fragment>
      </SettingsExpander>

      <SettingsExpander header={<SettingsExpanderHeader>White Balance</SettingsExpanderHeader>}>
        <EnumSliderSetting {...getSetting('awb')} />

        {data.awb.value === 'off' && (
          <React.Fragment>
            <NumberSetting {...getSetting('awbb')} />
            <NumberSetting {...getSetting('awbr')} />
          </React.Fragment>
        )}
      </SettingsExpander>

      <SettingsExpander header={<SettingsExpanderHeader>Effect</SettingsExpanderHeader>}>
        <EnumSetting {...getSetting('imxfx')} />
        <NumberSetting {...getSetting('colfxu')} />
        <NumberSetting {...getSetting('colfxv')} />
      </SettingsExpander>

      <SettingsExpander header={<SettingsExpanderHeader>Other</SettingsExpanderHeader>}>
        <NumberSetting {...getSetting('mode')} />
        <BooleanSetting {...getSetting('hflip')} />
        <BooleanSetting {...getSetting('vflip')} />
        <EnumSetting {...getSetting('flicker')} />
        <EnumSetting {...getSetting('camselect')} />
      </SettingsExpander>
    </SettingsWrapper>
  );
};
