import { generatePath as defaultGeneratePath, Path, NavigateOptions } from 'react-router-dom';
import { Params } from './types';
import { router, PathPatterns, StaticPaths } from './router';

type TP<P> = P | (Omit<Partial<Path>, 'path'> & { pathname: P });
type NOpts = Omit<NavigateOptions, 'relative'>;
export type GeneratedPath = typeof __generated;

const __generated = '__generated';

export function generatePath<AP extends PathPatterns, PS extends Params<AP>>(
  pathname: AP,
  ...[params]: PS extends never ? [Record<string, string | null>?] : [PS]
) {
  return defaultGeneratePath<string>(pathname, params) as GeneratedPath;
}

export function navigate(to: number): Promise<void>;
export function navigate(to: StaticPaths): Promise<void>;
export function navigate(to: GeneratedPath): Promise<void>;
export function navigate<AP extends PathPatterns, PS extends Params<AP>>(
  to: TP<AP>,
  ...[params, options]: PS extends never ? [Record<string, string | null>?, NOpts?] : [PS, NOpts?]
): Promise<void>;
export function navigate<AP extends PathPatterns, PS extends Params<AP>>(
  to: number | GeneratedPath | TP<AP>,
  ...[params, options]: PS extends never ? [Record<string, string | null>?, NOpts?] : [PS, NOpts?]
): Promise<void> {
  // The navigate function has strict type guard
  // It accept static paths or dynamic paths with params, but not accept path from generatePath function
  // The type `GeneratedPath` is used to bypass the type gurd
  if (to === __generated) {
    throw new Error(`${__generated} is not a valid path`);
  }

  if (typeof to === 'number') {
    return router.navigate(to);
  }

  const path: Partial<Path> = typeof to === 'string' ? { pathname: to } : to;
  path.pathname = path.pathname && defaultGeneratePath<string>(path.pathname, params || {});
  return router.navigate(path, options);
}
