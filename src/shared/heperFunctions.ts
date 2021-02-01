/**
 * Type guard function to remove undefined and null values
 */
export const isDefined = <T>(obj: T | undefined | null): obj is T =>
  obj !== undefined && obj !== null;

/**
 * Shallow compares two objects
 */
export const shallowEqualObjects = (
  objA: Record<string, any>,
  objB: Record<string, any>,
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
export const getDataTime = (): string => new Date().toISOString().replace(/[:.]/g, '-');
