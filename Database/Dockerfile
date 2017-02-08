Data Location of MySQL Docker Container
# Lets see the default location where MySQL Docker container stores the data.

# Start your MySQL container as:

docker run --name mysqldb -e MYSQL_USER=mysql -e MYSQL_PASSWORD=mysql -e MYSQL_DATABASE=sample -e MYSQL_ROOT_PASSWORD=supersecret -d mysql
 
# And inspect as:

docker inspect -f {{.Volumes}} <CONTAINER_ID>
 
# Then it shows the anonymous volumes as:

map[/var/lib/mysql:/mnt/sda1/var/lib/docker/vfs/dir/78f079dae09bf052cf900951b6d71a611fcf7c72f3460a2013e6f4d941a2b256]

# If you are using Boot2Docker, then /mnt/sda1 directory is used for storing images, containers, and data. This directory is from the Boot2Docker virtual machine filesystem. 

Note : If you are using Boot2Docker, your Docker daemon only has limited access to your OSX/Windows filesystem. Boot2Docker tries to auto-share your /Users (OSX) or C:\Users (Windows) directory – and so you can mount files or directories using docker run -v /Users/<path>:/<container path> ... (OSX) or docker run -v /c/Users/<path>:/<container path ... (Windows). All other paths come from the Boot2Docker virtual machine’s filesystem.

# You can view this mounted directory on Boot2Docker by logging into the VM as:

boot2docker ssh

# Then view the directory listing as:

docker@boot2docker:~$ ls -la /mnt/sda1/var/lib/docker/
total 72
drwxr-xr-x   11 root     root          4096 Apr  9 19:45 ./
drwxr-xr-x    4 root     root          4096 Mar 27 13:58 ../
drwxr-xr-x    5 root     root          4096 Mar 27 13:59 aufs/
drwx------   10 root     root          4096 Apr  9 19:45 containers/
drwx------    3 root     root          4096 Mar 27 13:59 execdriver/
drwx------  128 root     root         20480 Apr  9 19:45 graph/
drwx------    2 root     root          4096 Apr  7 23:34 init/
-rw-r--r--    1 root     root          7168 Apr  9 19:45 linkgraph.db
-rw-------    1 root     root          2229 Apr  9 19:45 repositories-aufs
drwx------    2 root     root          4096 Apr  9 19:14 tmp/
drwx------    2 root     root          4096 Mar 27 17:56 trust/
drwx------    3 root     root          4096 Apr  9 19:45 vfs/
drwx------    4 root     root          4096 Apr  9 19:45 volumes/
 
Anonymous Volumes:
When volumes created by a container and which are not explicitly mounted, are container specific.

# Start a MySQL container as:

docker run --name mysqldb -e MYSQL_USER=mysql -e MYSQL_PASSWORD=mysql -e MYSQL_DATABASE=sample -e MYSQL_ROOT_PASSWORD=supersecret -it -p 3306:3306 mysql

# Login into the container:

docker exec -it <CONTAINER_ID> bash

# Now connect to the MySQL instance, and create a table, as:

root@04c2f54b7fe7:/# mysql --user=mysql --password=mysql
Warning: Using a password on the command line interface can be insecure.
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 2
Server version: 5.6.24 MySQL Community Server (GPL)
 
Copyright (c) 2000, 2015, Oracle and/or its affiliates. All rights reserved.
 
Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.
 
Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
 
mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| sample             |
+--------------------+
2 rows in set (0.00 sec)
 
mysql> connect sample;
Connection id:    3
Current database: sample
 
mysql> show tables;
Empty set (0.00 sec)
 
mysql> create table user(name varchar(50));
Query OK, 0 rows affected (0.00 sec)
 
mysql> show tables;
+------------------+
| Tables_in_sample |
+------------------+
| user             |
+------------------+
1 row in set (0.00 sec)

# To stop the container:

docker stop <CONTAINER_ID>

# To restart the container:

docker start <CONTAINER_ID>

# Now after connecting to the MySQL container, the database table is shown correctly. This shows that anonymous volumes can persist state across container restarts.

# Inspect the container as:

docker inspect -f {{.Volumes}} ea7b1eff9714
map[/var/lib/mysql:/mnt/sda1/var/lib/docker/vfs/dir/78f079dae09bf052cf900951b6d71a611fcf7c72f3460a2013e6f4d941a2b256]

# And then it correctly shows the same anonymous volume from /mnt/sda1 directory.

# Now lets delete the container, and start a new MySQL container. First remove the container:

docker rm -f <CONTAINER_ID>

# Now start a new container using the same command as earlier:

docker run --name mysqldb -e MYSQL_USER=mysql -e MYSQL_PASSWORD=mysql -e MYSQL_DATABASE=sample -e MYSQL_ROOT_PASSWORD=supersecret -it -p 3306:3306 mysql

# See the list of tables, its shown as empty:

mysql> connect sample;
Connection id:    3
Current database: sample
 
mysql> show tables;
Empty set (0.00 sec)

# Verify it by inspecting this command:

docker inspect -f {{.Volumes}} bde73c930275 map[/var/lib/mysql:/mnt/sda1/var/lib/docker/vfs/dir/4d0ab6d1412bfbe79541b2d87d632cf12e70044201665f859a6a678132fb323f]

Note: Any data stored in the MySQL database by one container is not available to another MySQL container, to overcome this we have to use Docker Volume.
