# helper script for upgrade package json version
# argument $1 is equals to npm version xxxx, e.g. npm version patch

VERSION=$(npm version $1 --no-git-tag-version)
VERSION="${VERSION:1}" # remove first character "v"

# set version and stage the file
setversion() {
  sed -i '' 's/"version": ".*"/"version": "'"$VERSION"'"/' $1
  git add $1
}

setversion electron/package.json
setversion renderer/package.json

git add package.json
git commit -m "$VERSION" --no-verify
git tag v$VERSION