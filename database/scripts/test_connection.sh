#!/bin/bash
while [ ! `curl localhost:8888/_up 2> /dev/null` ]; do printf "."  >&2; sleep 1; done
#curl --silent http://localhost:8888

# make sure we have the right username/password
AUTH_URL=$(grep NODE_DB_URL= ../services/.env.local | sed 's/NODE_DB_URL=//g')
curl --silent ${AUTH_URL}/_all_dbs
