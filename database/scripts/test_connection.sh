#!/bin/bash
while [ ! `curl localhost:8888/_up 2> /dev/null` ]; do printf "."  >&2; sleep 1; done
#curl --silent http://localhost:8888

# make sure we have the right username/password
if [ -f ../services/.env.local ]; then
  source ../services/.env.local
fi

curl --silent --user ${CLOUDANT_USERNAME}:${CLOUDANT_PASSWORD} ${CLOUDANT_URL=http}/_all_dbs
