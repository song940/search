#!/bin/sh

curl -X POST -H 'content-type: application/json' 'https://elasticsearch.lsong.me/websearch/pages' -d '
{
  "title": "nodejs/node: Node.js JavaScript runtime - GitHub",
  "description": "Node.js is an open-source, cross-platform, JavaScript runtime environment. It executes JavaScript code outside of a browser. For more information on using Node.js, see the Node.js Website.",
  "url": "https://github.com/nodejs/node"
}'