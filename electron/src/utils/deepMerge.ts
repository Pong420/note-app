export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export const deepMerge = <A extends object, B extends object>(
  a: A,
  b: B,
  fn: (key: string, a: unknown, b: unknown) => unknown = (key, a, b) => {
    return Array.isArray(a) && Array.isArray(b)
      ? b
      : typeof a === 'object' || typeof b === 'object'
      ? Object.assign({}, a, b || {})
      : typeof b === 'undefined'
      ? a
      : b;
  }
) =>
  [...new Set([...Object.keys(a), ...Object.keys(b)])].reduce(
    (acc, key) => ({ ...acc, [key]: fn(key, a[key as keyof typeof a], b[key as keyof typeof b]) }),
    {}
  ) as A & B;
