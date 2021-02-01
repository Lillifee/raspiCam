import * as React from 'react';
import styled from 'styled-components';
import { isDefined } from '../../../shared/helperFunctions';
import {
  BooleanTypeSetting,
  EnumTypeSetting,
  NumberTypeSetting,
  ParseSetting,
  ParseSettings,
} from '../../../shared/raspiParseSettings';
import { useFetch } from '../common/hooks/useFetch';
import { ButtonIcon } from '../common/icons';
import { Label } from '../styled/Label';
import { Select } from '../styled/Select';
import { SliderValue } from '../styled/Slider';
import { Toggle } from '../styled/Toggle';

// #region styled

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2em 3em 3em 1.5em;
`;

const SettingsHeader = styled(Label)`
  display: flex;
  padding: 0.2em 0 2em 0;
`;

const SettingVerticalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.6em 0;
`;

const SettingHorizontalWrapper = styled(SettingVerticalWrapper)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0.9em 0;
`;

const SettingNameValueContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const SettingName = styled(Label)``;
const SettingValue = styled(Label)`
  color: ${(p) => p.theme.SubForeground};
`;

// #endregion

export interface BooleanSettingProps<T> {
  field: keyof T;
  setting: BooleanTypeSetting;
  value?: boolean;
  update: (data: Partial<Partial<T>>) => void;
}

const BooleanSetting = <T,>({ field, value, setting, update }: BooleanSettingProps<T>) => (
  <SettingHorizontalWrapper>
    <SettingName fontSize="s">{setting.name}</SettingName>
    <Toggle
      checked={isDefined(value) ? value : setting.defaultValue}
      onChange={(e) => update({ [field]: e.target.checked } as any)}
    />
  </SettingHorizontalWrapper>
);

export interface NumberSettingProps<T> {
  field: keyof T;
  setting: NumberTypeSetting;
  value?: number;
  update: (data: Partial<Partial<T>>) => void;
}

const NumberSetting = <T,>({ field, value, setting, update }: NumberSettingProps<T>) => (
  <SettingVerticalWrapper>
    <SettingNameValueContainer>
      <SettingName fontSize="s">{setting.name}</SettingName>
      <SettingValue fontSize="s">{isDefined(value) ? value : setting.defaultValue}</SettingValue>
    </SettingNameValueContainer>
    <SliderValue
      value={isDefined(value) ? value : setting.defaultValue}
      min={setting.minValue}
      max={setting.maxValue}
      step={setting.stepValue}
      onChange={(e) => update({ [field]: setting.convert(e.target.value) } as any)}
    />
  </SettingVerticalWrapper>
);

export interface EnumSettingProps<T> {
  field: keyof T;
  setting: EnumTypeSetting;
  value?: number;
  update: (data: Partial<Partial<T>>) => void;
}

const EnumSetting = <T,>({ field, value, setting, update }: EnumSettingProps<T>) => (
  <SettingHorizontalWrapper>
    <SettingName fontSize="s">{setting.name}</SettingName>
    <Select
      value={isDefined(value) ? value : setting.defaultValue}
      onChange={(e) => update({ [field]: e.target.value } as any)}
    >
      {setting.possibleValues.map((value) => (
        <option key={value} value={value}>
          {value}
        </option>
      ))}
    </Select>
  </SettingHorizontalWrapper>
);

export interface SettingProps<T> {
  field: keyof T;
  setting: ParseSetting;
  value?: any;
  update: (data: Partial<Partial<T>>) => void;
}

const Setting = <T,>({ field, setting, value, update }: SettingProps<T>) => {
  switch (setting.type) {
    case 'BOOLEAN': {
      return <BooleanSetting field={field} setting={setting} value={value} update={update} />;
    }
    case 'ENUM': {
      return <EnumSetting field={field} setting={setting} value={value} update={update} />;
    }
    case 'NUMBER': {
      return <NumberSetting field={field} setting={setting} value={value} update={update} />;
    }
  }
  return <div />;
};

export interface SettingsProps<T> {
  name: string;
  url: string;
  setLoading: (loading: boolean) => void;
  parseSettings: Partial<ParseSettings<T>>;
}

export function Settings<T>({
  name,
  url,
  setLoading,
  parseSettings,
}: SettingsProps<T>): JSX.Element {
  const { state, update } = useFetch<Partial<T>>(url, {}, 2000);
  const data = { ...state.data, ...state.input };

  React.useEffect(() => {
    setLoading(state.isUpdating);
  }, [setLoading, state.isUpdating]);

  return (
    <Wrapper>
      <SettingsHeader fontSize="m">{name}</SettingsHeader>
      <ButtonIcon
        type="Brightness"
        onClick={
          () =>
            update({
              height: null,
              framerate: null,
              bitrate: null,
              qp: null,
              profile: null,
              timeout: null,
              inline: true,
              width: null,
            } as any)
          // Object.keys(parseSettings).reduce<any>(
          //   (result, key) => ({
          //     ...result,
          //     [key]: null,
          //   }),
          //   {},
          // ),
          // )
        }
      />
      {Object.entries(parseSettings).map(
        ([key, setting]: [string, any]) =>
          setting && (
            <Setting
              key={key}
              field={key as keyof T}
              setting={setting}
              value={(data as any)[key]}
              update={update}
            />
          ),
      )}
    </Wrapper>
  );
}
