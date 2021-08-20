#!/bin/bash
set -e
if [[ ! -d ui/bin ]]; then
    mkdir -p ui/bin
fi
cd cli
docker run --rm -v $(pwd):/app/sbwcli sbw2csv-builder:latest
cp webbuild/sbw2csv ../ui/bin

cd ../services
rsync -avc --delete --exclude node_modules --exclude '.*' ./ ../ui/services/
cd ../ui/services
yarn install --production --ignore-optional --force

cd ..
yarn build


