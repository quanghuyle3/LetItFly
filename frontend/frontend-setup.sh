#!/bin/bash

# stop docker container if running
docker stop lif-frontend

# remove docker container if it exists
docker rm lif-frontend

# remove docker image if it exists
docker rmi lif-frontend-img

# docker command to build the image from a Dockerfile
docker build -t lif-frontend-img .

# command to create a docker container from image
docker create --name lif-frontend -p 3000:3000 lif-frontend-img
