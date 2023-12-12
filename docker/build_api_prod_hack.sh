#!/bin/sh
docker build \
       --build-arg API_PORT=3000 \
       --target production \
       -f ../apps/ml-api/Dockerfile \
       -t registry.digitalocean.com/safekids-ai/sq-models-api \
       ..
