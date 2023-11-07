#!/bin/bash

echo "Starting project build..."
echo ". . . ."

echo "Building sqldb..."
bash sqldb/sql-setup.sh
docker start lif-sql-server
echo "Finished building sqldb!!!"
echo ". . . ."

# echo "Building backend..."
# backend/backend-setup.sh
# docker start lif-backend
# echo "Finished building backend!!!"
# echo ". . . ."

# echo "Building frontend..."
# frontend/frontend-setup.sh
# docker start lif-frontend
# echo "Finished building frontend!!!"
# echo ". . . ."

# echo "Finished building project!  :)"
