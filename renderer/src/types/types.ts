/* eslint-disable @typescript-eslint/no-explicit-any */

export type ValueOf<T> = T[keyof T];
export type UnionToIntercetion<U> = (U extends any ? (arg: U) => any : never) extends (arg: infer I) => any ? I : never;
export type Constructable<T> = new (...args: any[]) => T;

/**
 * https://github.com/type-challenges/type-challenges/issues/7939
 */
export type ObjectKeyNode<K extends string | number, IsRoot extends boolean> = IsRoot extends true
  ? `${K}`
  : `.${Exclude<K, keyof []>}` | (K extends number ? `[${K}]` : never);

export type ObjectKeyPaths<T extends object, IsRoot extends boolean = true, K extends keyof T = keyof T> = K extends
  | string
  | number
  ?
      | ObjectKeyNode<K, IsRoot>
      | (NonNullable<T[K]> extends object
          ? `${ObjectKeyNode<K, IsRoot>}${ObjectKeyPaths<NonNullable<T[K]>, false>}`
          : never)
  : never;

/**
 * https://github.com/type-challenges/type-challenges/issues/1019
 */
export type Get<T, Paths> = Paths extends `${infer A}.${infer B}`
  ? A extends keyof T
    ? Get<T[A], B>
    : never
  : Paths extends keyof T
  ? T[Paths]
  : never;
