#!/bin/bash

# docker command to build the image from a Dockerfile
docker build -t mysql-server-img .

# command to create a docker container named "lif-sql-server"
# with exposing docker port 3306 to localhost port 3306
# from image "mysql-server-img"
docker create --name lif-sql-server -p 4000:3306 mysql-server-img
