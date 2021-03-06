#!/bin/bash
# set -x
if [ -z "$1" ]; then
  echo "usage: run_image.sh tag"
  echo " example: ./run_image v4"
  exit 1;
fi
PODMAN=$(command -v podman)
COMMAND="${PODMAN:-docker}"

# stop any db that may already be running
IDS=$($COMMAND ps --quiet --filter ancestor=localhost/sbw2csv-dev/db --filter ancestor=localhost/sbw2csv-dev/db:$1)
if [[ ! -z "$IDS" ]]; then 
  echo $IDS | xargs docker stop
fi
$COMMAND run --detach --rm -p 8888:5984 --label sbw2csv-dev/db=$1 sbw2csv-dev/db:$1
