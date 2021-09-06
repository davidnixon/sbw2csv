#!/bin/bash
#set -x
if [ -z "$1" ]; then
  echo "usage: build_image.sh tag"
  echo " example: ./build_image v4"
  exit 1;
fi
set -e
set -x
echo $PWD
if [ -f ../services/.env.local ]; then
  source ../services/.env.local
fi
if [ -z "$CLOUDANT_AUTH_TYPE" ] || [ -z "$CLOUDANT_URL" ] || [ -z "$CLOUDANT_USERNAME" ] || [ -z "$CLOUDANT_PASSWORD" ]; then
  echo CLOUDANT_AUTH_TYPE=BASIC > ../services/.env.local
  echo CLOUDANT_URL=http://localhost:8888 >> ../services/.env.local

  CLOUDANT_USERNAME=$(date +%N | base64 | sed 's/[+/=]//g'| head -c 8)
  echo CLOUDANT_USERNAME=$CLOUDANT_USERNAME > ../services/.env.local

  CLOUDANT_PASSWORD=$(date +%N | base64 | sed 's/[+/=]//g' | head -c 20)
  echo CLOUDANT_PASSWORD=$CLOUDANT_PASSWORD >> ../services/.env.local

  echo "generated settings"
  cat ../services/.env.local

fi
set -x
docker build --build-arg NODE_DB_USER=$CLOUDANT_USERNAME --build-arg NODE_DB_PASSWORD=$CLOUDANT_PASSWORD -t sbw2csv-dev/db:$1 .
