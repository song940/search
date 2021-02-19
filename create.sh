#!/bin/sh

curl -X POST -H 'content-type: application/json' 'https://elasticsearch.lsong.me/websearch/pages' -d '
{
  "title": "Node.js Cluster",
  "description": "A single instance of Node.js runs in a single thread. To take advantage of multi-core systems, the user will sometimes want to launch a cluster of Node.js processes to handle the load.",
  "url": "https://nodejs.org/dist/latest-v14.x/docs/api/cluster.html"
}'