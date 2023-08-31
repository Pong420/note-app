import { RouteObject } from 'react-router-dom';

// https://github.com/type-challenges/type-challenges/issues/3721
type Split<S extends string, SEP extends string> = string extends S
  ? string[]
  : S extends `${infer A}${SEP}${infer B}`
  ? [A, ...(B extends '' ? [] : Split<B, SEP>)]
  : SEP extends ''
  ? []
  : [S];

export type PathJoin<Paths extends unknown[], U extends string | number, R extends string = ''> = Paths extends [
  infer F,
  ...infer Rest
]
  ? F extends string
    ? F extends `` | '*'
      ? PathJoin<Rest, U, `${R}${F}`>
      : PathJoin<Rest, U, `${R}${U}${RemoveQuestionMark<F>}`> | (F extends `:${string}?` ? Exclude<R, ''> : never)
    : never
  : R;

type HasIndexRoute<T extends RouteObject[]> = Extract<T[number], { index: true }> extends never ? false : true;

/**
 * Transform route objects into an array of string
 */
export type RouteObjectParser<T, R extends unknown[] = []> = T extends {
  path?: string;
  children: infer P extends RouteObject[];
}
  ?
      | (HasIndexRoute<P> extends true ? [...R, T['path']] : never)
      | RouteObjectParser<
          P[number],
          T['path'] extends string // parent path
            ? [...R, ...Split<T['path'], '/'>]
            : R // for layout routes
        >
  : T extends { path: string }
  ? PathJoin<[...R, ...Split<T['path'], '/'>], '/'>
  : never;

// https://lihautan.com/extract-parameters-type-from-string-literal-types-with-typescript/#splitting-a-string-literal-type
type IsParameter<Part> = Part extends '*' ? Part : Part extends `:${infer ParamName}` ? ParamName : never;

export type FilteredParts<Path> = Path extends `${infer PartA}/${infer PartB}`
  ? IsParameter<PartA> | FilteredParts<PartB>
  : IsParameter<Path>;

type RemoveQuestionMark<T extends string> = T extends `${infer ParamName}?` ? ParamName : T;

export type Params<Path extends string> = FilteredParts<Path> extends never
  ? never
  : {
      [K in Exclude<FilteredParts<Path>, `${string}?`>]: string;
    } & {
      [K in Extract<FilteredParts<Path>, `${string}?`> as RemoveQuestionMark<K>]?: string;
    };
