#!/bin/bash
if [ -z "$1" ]; then
  echo "usage: run_image.sh tag"
  echo " example: ./run_image v4"
  exit 1;
fi

# stop any db that may already be running
IDS=$(docker ps --quiet --filter publish=8888)
if [[ ! -z "$IDS" ]]; then 
  echo $IDS | xargs docker stop
fi
docker run --detach --rm -p 8888:5984 --label sbw2csv-dev/db=$1 sbw2csv-dev/db:$1
