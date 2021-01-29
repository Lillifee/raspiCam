import * as React from 'react';
import styled from 'styled-components';
import { isDefined } from '../../../shared/heperFunctions';
import {
  NumberTypeSetting,
  ParseSetting,
  ParseSettings,
  raspiCameraParseSettings,
  raspiPreviewParseSettings,
  raspiStillParseSettings,
  raspiVidParseSettings,
} from '../../../shared/raspiParseSettings';
import { useFetch } from '../common/hooks/useFetch';
import { Label } from '../styled/Label';
import { SliderValue } from '../styled/Slider';

// #region styled

const Wrapper = styled.div`
  backdrop-filter: blur(5px);
  background-color: rgba(0, 0, 0, 0.8);
  color: ${(p) => p.theme.Foreground};
  padding: 1em;
`;

const SettingContainer = styled.div``;
const SettingName = styled(Label)``;
const SettingValueContainer = styled.div``;

// #endregion

// const BooleanSetting: React.FC<{
//   setting: BooleanTypeSetting;
//   value?: boolean;
//   update: (data: Partial<Partial<RaspiVidSettings>>) => void;
// }> = ({ setting, value }) => (
//   <SettingValueContainer>
//     {value} {setting.defaultValue}
//   </SettingValueContainer>
// );

export interface NumberSettingProps<T> {
  field: keyof T;
  setting: NumberTypeSetting;
  value?: number;
  update: (data: Partial<Partial<T>>) => void;
}

const NumberSetting = <T,>({ field, value, setting, update }: NumberSettingProps<T>) => (
  <SettingValueContainer>
    <SliderValue
      value={isDefined(value) ? value : setting.defaultValue}
      min={setting.minValue}
      max={setting.maxValue}
      step={setting.minValue}
      onChange={(e) => update({ [field]: setting.convert(e.target.value) } as any)}
    />
  </SettingValueContainer>
);

// export interface StringSettingProps {
//   key: string;
//   setting: StringTypeSetting;
//   value?: string;
//   update: (data: Partial<Partial<RaspiVidSettings>>) => void;
// }
// const StringSetting: React.FC<StringSettingProps> = ({ setting, value }) => (
//   <SettingValueContainer>
//     {value} {setting.defaultValue}
//   </SettingValueContainer>
// );

// const EnumSetting: React.FC<{ key: string, setting: EnumTypeSetting; value?: string ,update: (data: Partial<Partial<RaspiVidSettings>> }> = ({
//   setting,
//   value,
//   update
// }) => (
//   <SettingValueContainer>
//     {value} {setting.defaultValue}
//   </SettingValueContainer>
// );

// type ParseSettingComponentMap<T extends { type: string } = ParseSetting> = {
//   [P in T['type']]: React.FC<{ setting: Extract<T, { type: P }> }>;
// };

// const settingComponent: ParseSettingComponentMap = {
//   BOOLEAN: BooleanSetting,
//   STRING: StringSetting,
//   ENUM: EnumSetting,
//   NUMBER: NumberSetting,
// };

export interface SettingProps<T> {
  field: keyof T;
  setting: ParseSetting;
  value?: any;
  update: (data: Partial<Partial<T>>) => void;
}

const SettingValue = <T,>({ field, setting, value, update }: SettingProps<T>) => {
  switch (setting.type) {
    // case 'BOOLEAN': {
    //   return <BooleanSetting setting={setting} value={value} />;
    // }
    // case 'STRING': {
    //   return <StringSetting setting={setting} value={value} />;
    // }
    // case 'ENUM': {
    //   return <EnumSetting setting={setting} value={value} />;
    // }
    case 'NUMBER': {
      return <NumberSetting field={field} setting={setting} value={value} update={update} />;
    }
  }
  return <div />;
};

export interface SettingsProps {
  url: string;
}

// export const Settings = <T>()

const Settings = <T,>(parseSettings: Partial<ParseSettings<T>>): React.FC<SettingsProps> => ({
  url,
}) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { state, update } = useFetch<Partial<T>>(url, {}, 2000);
  const data = { ...state.data, ...state.userData };
  // TODO typing
  return (
    <Wrapper>
      {Object.entries(parseSettings).map(
        ([key, setting]: [string, any]) =>
          setting && (
            <SettingContainer key={key}>
              <SettingName fontSize="m">{setting.name}</SettingName>
              <SettingValue
                field={key as keyof T}
                setting={setting as ParseSetting}
                value={(data as any)[key]}
                update={update}
              />
            </SettingContainer>
          ),
      )}
    </Wrapper>
  );
};

export const VidSettings = Settings(raspiVidParseSettings);
export const StillSettings = Settings(raspiStillParseSettings);
export const PreviewSettings = Settings(raspiPreviewParseSettings);
export const CameraSettings = Settings(raspiCameraParseSettings);
