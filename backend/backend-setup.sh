#!/bin/bash

# stop docker container if running
docker stop lif-backend

# remove docker container if it exists
docker rm lif-backend

# remove docker image if it exists
docker rmi lif-backend-img

# build java jar file
mvn clean install

# docker command to build the image from a Dockerfile
docker build -t lif-backend-img .

# command to create a docker container from image
docker create --name lif-backend --network lif -p 8080:8080 lif-backend-img
