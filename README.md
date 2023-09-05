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
- [ ] Code Block
  - [ ] bubble menu to configure title, line-highlight etc
- [ ] Task List
- [ ] Table
- [ ] Resizeable Image, drop to upload
- [ ] Bubble Menu
- [ ] Export PDF
- [ ] Context menu
- [ ] Spotlight
- [ ] Export static HTML

## Features

### Code Block

- language
  ````
  ```ts
  ```tsx
  ```javascript
  ````
- line highlight
  ````
  ```ts {1,2,5-10}
  ````
- filename
  ````
  ```ts title="test.ts"
  ````
