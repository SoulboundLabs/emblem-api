#!/bin/bash
npm run remigrate
while true
do
    ts-node ./src/index.ts the-graph
done