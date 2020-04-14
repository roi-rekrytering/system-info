#!/usr/bin/env bash

docker build -t roirek/system-info -t roirek/system-info:$1 .
docker push roirek/system-info
docker push roirek/system-info:$1
