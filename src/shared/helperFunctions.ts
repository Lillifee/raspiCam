/**
 * Type guard function to remove undefined and null values
 */
export const isDefined = <T>(obj: T | undefined | null): obj is T =>
  obj !== undefined && obj !== null;

/**
 * Shallow compares two objects
 */
export const shallowEqualObjects = (
  objA?: Record<string, unknown>,
  objB?: Record<string, unknown>,
): boolean => {
  if (objA === objB) {
    return true;
  }

  if (!objA || !objB) {
    return false;
  }

  const aKeys = Object.keys(objA);
  const bKeys = Object.keys(objB);
  const len = aKeys.length;

  if (bKeys.length !== len) {
    return false;
  }

  for (let i = 0; i < len; i++) {
    const key = aKeys[i];

    if (objA[key] !== objB[key] || !Object.prototype.hasOwnProperty.call(objB, key)) {
      return false;
    }
  }

  return true;
};

/**
 * Return current date time
 */
export const getIsoDataTime = (): string => new Date().toISOString().replace(/[:.]/g, '-');

const symbol = ['', 'k', 'M', 'G', 'T', 'P', 'E'];

/**
 * Abbreviate number with suffix.
 *
 * @param number number to abbreviate
 * @param [fractionDigits=-1] Digits after the decimal point. -1 = auto
 */
export const abbreviateNumber =
  (unit = '', fractionDigits = -1) =>
  (number?: number): string => {
    if (!number) return '';
    const tier = (Math.log10(Math.abs(number)) / 3) | 0;
    if (tier == 0) return `${number.toFixed(0)}${unit}`;

    const suffix = symbol[tier];
    const scale = Math.pow(10, tier * 3);

    // scale and format the number
    const scaled = number / scale;
    const usedFractionDigits =
      fractionDigits >= 0 ? fractionDigits : Math.ceil(Math.log10(Math.abs(scaled))) > 1 ? 0 : 2;
    return `${scaled.toFixed(usedFractionDigits)} ${suffix}${unit}`;
  };

/**
 * Format number and append unit
 *
 * @param number number
 * @param [unit] unit
 */
export const appendUnit =
  (unit: string) =>
  (number?: number): string =>
    number ? (unit ? `${number} ${unit}` : number.toString()) : '';

/**
 * Round a number by significants
 * e.g. 1234 with 2 significants result in 1200
 *
 * @param number number to round
 * @param [significants=2] significants
 */
export const roundToSignificant = (number: number, significants = 2): number => {
  const tier = Math.ceil(Math.log10(Math.abs(number)));
  const scale = Math.pow(10, tier - significants);
  return Math.round(number / scale) * scale;
};
