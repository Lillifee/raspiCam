import { GenericSettingDesc } from '../../../../shared/settings';

type RestoredSetting<T> = { [K in keyof T]: undefined };

export const restoreSettings = <T extends Record<string, unknown>>(data: T): RestoredSetting<T> =>
  Object.keys(data).reduce(
    (result, key) => ({ ...result, [key]: undefined }),
    {},
  ) as RestoredSetting<T>;

export const updateTypedField = <T extends Record<string, unknown>>(
  updateData: (data: T) => void,
) => <K extends keyof T>(field: K) => (value: T[K]): void => updateData({ [field]: value } as T);
