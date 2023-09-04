# Note Taking App

> :warning: Working In Progress

![screenshot](./screenshot.png)

## Development

```
pnpm install
npm run dev
```

## Build and Release

1. Upgrade the version number of all `package.json`
   ```sh
   # sh scripts/version.sh [<newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease | from-git]
   sh scripts/version.sh patch
   ```
2. Run the command below and check `/release`

   ```sh
   npm run package
   ```

   For other platforms, please check [electron-builder](https://www.electron.build/index.html) for more details

## TODO:

- [ ] Saving file
- [ ] Task List
- [ ] Table
- [ ] Resizeable Image, drop to upload
- [ ] Bubble Menu
- [ ] Export pdf
