import { Options, defineConfig } from 'tsup';
import { electronPreloadPlugin } from './plugins/electronPreloadPlugin';
import { env, isEnvDevelopment, isEnvProduction } from './env';
import { Configuration } from 'electron-builder';
import _config from '../electron-builder.js';

const config: Configuration = _config;

const options: Options = {
  splitting: false,
  clean: isEnvProduction,
  sourcemap: isEnvProduction,
  minify: isEnvProduction,
  keepNames: true,
  format: ['cjs'],
  external: [/electron/],
  // convert esm module to cjs
  noExternal: [/file-type/],
  define: {
    APP_ID: JSON.stringify(config.appId),
    ...Object.entries(env).reduce(
      (e, [k, v]) => ({ ...e, [`process.env.${k}`]: JSON.stringify(v) }),
      {} as Record<string, string>
    )
  }
};

export default defineConfig([
  { ...options, entry: ['src/preload/index.ts'], outDir: 'dist/preload', esbuildPlugins: [electronPreloadPlugin] },
  {
    ...options,
    entry: ['src/**/*.ts', '!src/preload/**'],
    outDir: 'dist',
    bundle: false,
    onSuccess: isEnvDevelopment && 'npx electron .'
  }
]);
