#!/bin/sh

docker build \
       --build-arg API_PORT=3000 \
       --target production \
       -t zohranvalliani/ml-models-api-dev \
       -f ../apps/ml-api/Dockerfile \
       ..

