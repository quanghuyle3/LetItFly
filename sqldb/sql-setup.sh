#!/bin/bash

# stop docker container if running
docker stop lif-sql-server

# remove docker container if it exists
docker rm lif-sql-server

# remove docker image if it exists
docker rmi mysql-server-img

# docker command to build the image from a Dockerfile
docker build -t mysql-server-img .

# command to create a docker container named "lif-sql-server"
# with exposing docker port 3306 to localhost port 4000
# from image "mysql-server-img"
docker create --name lif-sql-server --network lif mysql-server-img
