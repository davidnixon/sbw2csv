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
if [ -z "$NODE_DB_USER" ] || [ -z "$NODE_DB_PASSWORD" ] || [ -z "$NODE_DB_URL" ]; then
  NODE_DB_USER=$(date +%N | base64 | sed 's/[+/=]//g'| head -c 8)
  echo NODE_DB_USER=$NODE_DB_USER > ../services/.env.local

  NODE_DB_PASSWORD=$(date +%N | base64 | sed 's/[+/=]//g' | head -c 20)
  echo NODE_DB_PASSWORD=$NODE_DB_PASSWORD >> ../services/.env.local

  echo NODE_DB_URL=http://${NODE_DB_USER}:$NODE_DB_PASSWORD@localhost:8888 >> ../services/.env.local

  echo "generated settings"
  cat ../services/.env.local

fi
set -x
docker build --build-arg NODE_DB_USER=$NODE_DB_USER --build-arg NODE_DB_PASSWORD=$NODE_DB_PASSWORD -t sbw2csv-dev/db:$1 .
