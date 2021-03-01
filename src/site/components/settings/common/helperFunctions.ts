import { GenericSettingDesc } from '../../../../shared/settings';

type RestoredSetting<T> = { [K in keyof T]: undefined };

export const restoreSettings = <T extends Record<string, unknown>>(data: T): RestoredSetting<T> =>
  Object.keys(data).reduce(
    (result, key) => ({ ...result, [key]: undefined }),
    {},
  ) as RestoredSetting<T>;

export type TypedSetting<T extends GenericSettingDesc, K extends keyof T> = T[K] & {
  update: (value: T[K]['value']) => void;
};

export const getTypedSetting = <T extends GenericSettingDesc>(
  settings: T,
  updateData: (data: Record<string, unknown>) => void,
) => <K extends keyof T>(field: K): TypedSetting<T, K> => ({
  ...settings[field],
  update: (value: T[K]['value']) => updateData({ [field]: value } as Partial<T>),
});
