// @ts-check
const pkg = require('./electron/package.json');

const app = 'electron';

/** @type {import('electron-builder').Configuration} */
module.exports = {
  appId: 'com.notes.app',
  productName: 'Notes',
  // https://github.com/electron-userland/electron-builder/issues/3984
  electronVersion: pkg.devDependencies['electron'].replace(/^(~|\^)/, ''),
  asar: true,
  directories: {
    app,
    output: `release/${pkg.version}`,
    buildResources: 'resource'
  },
  files: ['dist/**/*', 'build/**/*'],
  mac: {
    artifactName: '${productName}_${version}.${ext}',
    target: ['dmg', 'zip']
  },
  win: {
    target: [
      {
        target: 'nsis',
        arch: ['x64']
      }
    ],
    artifactName: '${productName}_${version}.${ext}'
  },
  nsis: {
    oneClick: false,
    perMachine: false,
    allowToChangeInstallationDirectory: true,
    deleteAppDataOnUninstall: false
  },
  publish: {
    provider: 'generic',
    channel: 'latest',
    url: ''
  }
};
