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

- [x] Saving file
- [ ] Code Block
  - [x] Basic Setup
  - [ ] Bubble menu for configure title, line-highlights
- [ ] Task List
- [ ] Table
- [ ] Image
  - [x] Resizeable
  - [x] Drop to Upload
  - [ ] Upload from url
  - [ ] Markdown patterns
  - [ ] Alignment, flot, center
- [ ] Bubble Menu
- [ ] Export PDF
- [ ] Context menu
- [ ] Spotlight
  - [x] Basic Setup
  - [ ] More actions
- [ ] Export static HTML
      - [ ] Documentation Page
- [ ] Table of content on the right hand side

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
