/**
 * Type guard function to remove undefined and null values
 */
export const isDefined = <T>(obj: T | undefined | null): obj is T =>
  obj !== undefined && obj !== null;
