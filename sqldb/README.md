### mysql-server-setup

## How to Start and Enter Docker Container

1. Double click on "sql-setup.sh" to run the bash script
   - If double clicking doesn't work, open git bash and type 'sh sql-setup.sh'
   - This script will create a docker image called "mysql-server-img" from Dockerfile
   - Then a container called "lif-sql-server" will be created from the new image
2. On your terminal of choice, type 'docker start lif-sql-server'
   - This will start the mysql server docker container
3. Finally type 'docker exec -it lif-sql-server bash'
   - This will allow you enter the docker container and access the docker bash prompt
4. Once you enter the container and see the bash prompt, type 'mysql -p' and enter the password
5. You've entered the MySQL server, congratulations!!!

## MySQL Workbench Setup

1. Download and Install MySQL Workbench (recommended version 8.0)
2. Click on the plus icon to Setup New Connection
3. Enter Connection Name, this is the name displayed on the home page
4. Hostname = 127.0.0.1, Port = 4000
5. Username = root
6. Password -> Store in Vault -> Enter the MySQL Server password
7. Press 'OK'
8. Your MySQK Connection should appear in the home page, congratulations!

## SQL Server Initialization Scripts

1. The docker container is setup to run the scripts under 'sql-init-scripts' folder
2. Feel free to add/remove/edit the init scripts
3. Script #05. has been commented out by default as it is the drop table script
