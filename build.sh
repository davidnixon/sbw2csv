#!/bin/bash
set -e
set -x

mkdir -p build/cf
rsync  -avc --delete --delete-excluded cf/ build/cf/

mkdir -p build/action
rsync  -avc --delete --delete-excluded \
    --exclude=uploads \
    --exclude=converted \
    --exclude=node_modules \
    --exclude '.*' \
    --exclude '*.zip' \
    --exclude 'bin' \
    services/ build/action/
yarn --ignore-optional --production --cwd build/action/

mkdir -p build/action/bin
pushd cli
docker run --rm -v $(pwd):/app/sbwcli sbw2csv-builder:latest
cp webbuild/sbw2csv ../build/action/bin
popd

pushd build/action/
zip -r app.zip . 
popd

yarn --production --cwd ui/ build


