import React from 'react';
import { StepperSetting, StepperSettingDesc } from '../../../../shared/settings/stepper';
import { BooleanSetting } from './common/BooleanSetting';
import { updateTypedField } from './common/helperFunctions';
import { NumberSetting } from './common/NumberSetting';
import { SettingsExpander } from './common/SettingsExpander';
import { SettingsHeader, SettingsHeaderText, SettingsWrapper } from './common/Styled';

export interface StepperAxisSettingsProps {
  axis: 'X' | 'Y';
  data: StepperSettingDesc;
  updateData: (data: StepperSetting) => void;
}

export const StepperAxisSettings: React.FC<StepperAxisSettingsProps> = ({
  axis,
  data,
  updateData,
}) => {
  const updateField = updateTypedField(updateData);

  return (
    <SettingsExpander
      header={
        <BooleanSetting {...data.enabled} update={updateField('enabled')} name={`${axis} Axis`} />
      }
    >
      <NumberSetting {...data.stepPin} update={updateField('stepPin')} />
      <NumberSetting {...data.dirPin} update={updateField('dirPin')} />
      <NumberSetting {...data.enaPin} update={updateField('enaPin')} />
      <NumberSetting {...data.maxSpeed} update={updateField('maxSpeed')} />
      {/* <NumberSetting {...data.acceleration} update={updateField('acceleration')} /> */}
    </SettingsExpander>
  );
};

export interface StepperSettingsProps {
  stepperX: StepperSettingDesc;
  stepperY: StepperSettingDesc;

  updateStepperX: (data: StepperSetting) => void;
  updateStepperY: (data: StepperSetting) => void;
}

export const StepperSettings: React.FC<StepperSettingsProps> = ({
  stepperX,
  stepperY,
  updateStepperX,
  updateStepperY,
}) => (
  <SettingsWrapper>
    <SettingsHeader fontSize="m">
      <SettingsHeaderText>Stepper</SettingsHeaderText>
    </SettingsHeader>

    <StepperAxisSettings axis="X" data={stepperX} updateData={updateStepperX} />
    <StepperAxisSettings axis="Y" data={stepperY} updateData={updateStepperY} />
  </SettingsWrapper>
);
