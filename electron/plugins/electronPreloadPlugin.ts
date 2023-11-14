/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Options } from 'tsup';
import { bundleRequire } from 'bundle-require'; // deps of tsup

/**
 * for preload/index.js,
 * preload amins to setup the context bridge between electron and renderer but it cannot load nodejs module.
 * This plugin is resolve the preload/index.ts and replace all the ipc module into empty object.
 * So that the nodejs module will not be included and it get keys for setup the handlers
 * if you found some issues that the plugin cannot be solved, you can manually defined the key inside preload/index.ts
 * instead of import from 'ipc'
 */
export const electronPreloadPlugin: NonNullable<Options['esbuildPlugins']>[number] = {
  name: `electronPreloadPlugin`,
  setup(build) {
    build.onLoad({ filter: /ipc/ }, async args => {
      const { mod } = await bundleRequire({
        filepath: args.path,
        format: 'cjs'
      });

      // should be same as the exports from electron/src/ipc/index.ts
      const contents = JSON.stringify({
        r2mIpc: Object.keys(mod.r2mIpc).reduce<object>((p, c) => ({ ...p, [c]: {} }), {}),
        r2rIpc: Object.keys(mod.r2rIpc).reduce<object>((p, c) => ({ ...p, [c]: {} }), {}),
        m2rIpc: Object.keys(mod.m2rIpc).reduce<object>((p, c) => ({ ...p, [c]: {} }), {}),
        m2rWithReplyDefinition: Object.keys(mod.m2rWithReplyDefinition).reduce<object>(
          (p, c) => ({ ...p, [c]: {} }),
          {}
        )
      });

      return {
        contents,
        loader: 'json'
      };
    });
  }
};
