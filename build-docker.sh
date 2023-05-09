#!/bin/bash
yarn build
docker build -t ligson/wchatgpt-fe:1.0 .
docker push ligson/wchatgpt-fe:1.0
