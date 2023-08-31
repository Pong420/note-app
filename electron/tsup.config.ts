import { Options, defineConfig } from 'tsup';
import { electronPreloadPlugin } from './plugins/electronPreloadPlugin';
import { env, isEnvProduction } from './env';

const options: Options = {
  splitting: false,
  clean: isEnvProduction,
  sourcemap: isEnvProduction,
  minify: isEnvProduction,
  keepNames: true,
  format: ['cjs'],
  external: [/electron/],
  // convert esm module to cjs
  noExternal: [],
  define: {
    ...Object.entries(env).reduce(
      (e, [k, v]) => ({ ...e, [`process.env.${k}`]: JSON.stringify(v) }),
      {} as Record<string, string>
    )
  }
};

export default defineConfig([
  { ...options, entry: ['src/**/*.ts', '!src/preload/**'], outDir: 'dist', bundle: false },
  { ...options, entry: ['src/preload/index.ts'], outDir: 'dist/preload', esbuildPlugins: [electronPreloadPlugin] }
]);
