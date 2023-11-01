import { generatePath as defaultGeneratePath, NavigateOptions } from 'react-router-dom';
import { Params } from './types';
import { router, StaticPaths, DynamicPaths } from './router';

type NOpts = Omit<NavigateOptions, 'relative'>;
export type GeneratedPath = typeof __generated;

const __generated = '__generated';

export function generatePath<AP extends DynamicPaths>(pathname: AP, params: Params<AP>) {
  return defaultGeneratePath<string>(pathname, params) as GeneratedPath;
}

export function navigate<AP extends DynamicPaths>(to: AP, params: Params<AP>, options?: NOpts): Promise<void>;
export function navigate(to: StaticPaths, options?: NOpts): Promise<void>;
export function navigate(to: GeneratedPath, options?: NOpts): Promise<void>;
export function navigate(to: number): Promise<void>;
export function navigate(to: number | string, ...args: unknown[]): Promise<void> {
  // The navigate function has strict type guard
  // It accept static paths or dynamic paths with params, but not accept path from generatePath function
  // The type `GeneratedPath` is used to bypass the type gurd
  if (to === __generated) {
    throw new Error(`${__generated} is not a valid path`);
  }

  const [params, options] = (args.length === 2 ? [args[0], args[1]] : [args[0], args[0]]) as [
    Record<string, unknown>?,
    NOpts?
  ];

  if (typeof to === 'number') {
    return router.navigate(to);
  }

  const pathname = params ? defaultGeneratePath<string>(to, params) : to;
  return router.navigate(pathname, options);
}
