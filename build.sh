#!/bin/bash

docker compose down
sudo rm -rf ./master/data/* ./master/data/.gitkeep
sudo rm -rf ./slave1/data/* ./slave1/data/.gitkeep
sudo rm -rf ./slave2/data/* ./slave2/data/.gitkeep
sudo rm -rf ./slave3/data/* ./slave3/data/.gitkeep
chmod 044 ./master/conf/mysql.conf.cnf
chmod 044 ./slave1/conf/mysql.conf.cnf
chmod 044 ./slave2/conf/mysql.conf.cnf
chmod 044 ./slave3/conf/mysql.conf.cnf
docker compose build
docker compose up -d

until docker exec mysql_master sh -c 'export MYSQL_PWD=111; mysql -u root -e ";"'
do
    echo "Waiting for mysql_master database connection..."
    sleep 4
done

slave1_priv_stmt='GRANT REPLICATION SLAVE ON *.* TO "mydb_slave1_user"@"%" IDENTIFIED BY "mydb_slave1_pwd"; FLUSH PRIVILEGES;'
docker exec mysql_master sh -c "export MYSQL_PWD=111; mysql -u root -e '$slave1_priv_stmt'"

slave2_priv_stmt='GRANT REPLICATION SLAVE ON *.* TO "mydb_slave2_user"@"%" IDENTIFIED BY "mydb_slave2_pwd"; FLUSH PRIVILEGES;'
docker exec mysql_master sh -c "export MYSQL_PWD=111; mysql -u root -e '$slave2_priv_stmt'"

slave3_priv_stmt='GRANT REPLICATION SLAVE ON *.* TO "mydb_slave3_user"@"%" IDENTIFIED BY "mydb_slave3_pwd"; FLUSH PRIVILEGES;'
docker exec mysql_master sh -c "export MYSQL_PWD=111; mysql -u root -e '$slave3_priv_stmt'"

until docker-compose exec mysql_slave1 sh -c 'export MYSQL_PWD=111; mysql -u root -e ";"'
do
    echo "Waiting for mysql_slave1 database connection..."
    sleep 4
done

until docker-compose exec mysql_slave2 sh -c 'export MYSQL_PWD=111; mysql -u root -e ";"'
do
    echo "Waiting for mysql_slave2 database connection..."
    sleep 4
done

until docker-compose exec mysql_slave3 sh -c 'export MYSQL_PWD=111; mysql -u root -e ";"'
do
    echo "Waiting for mysql_slave3 database connection..."
    sleep 4
done

docker-ip() {
    docker inspect --format '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' "$@"
}

MS_STATUS=`docker exec mysql_master sh -c 'export MYSQL_PWD=111; mysql -u root -e "SHOW MASTER STATUS"'`
CURRENT_LOG=`echo $MS_STATUS | awk '{print $5}'`
CURRENT_POS=`echo $MS_STATUS | awk '{print $6}'`

start_slave1_stmt="RESET SLAVE;CHANGE MASTER TO MASTER_HOST='$(docker-ip mysql_master)',MASTER_USER='mydb_slave1_user',MASTER_PASSWORD='mydb_slave1_pwd',MASTER_LOG_FILE='$CURRENT_LOG',MASTER_LOG_POS=$CURRENT_POS; START SLAVE;"
start_slave1_cmd='export MYSQL_PWD=111; mysql -u root -e "'
start_slave1_cmd+="$start_slave1_stmt"
start_slave1_cmd+='"'
echo "$start_slave1_cmd"
docker exec mysql_slave1 sh -c "$start_slave1_cmd"

start_slave2_stmt="RESET SLAVE;CHANGE MASTER TO MASTER_HOST='$(docker-ip mysql_master)',MASTER_USER='mydb_slave2_user',MASTER_PASSWORD='mydb_slave2_pwd',MASTER_LOG_FILE='$CURRENT_LOG',MASTER_LOG_POS=$CURRENT_POS; START SLAVE;"
start_slave2_cmd='export MYSQL_PWD=111; mysql -u root -e "'
start_slave2_cmd+="$start_slave2_stmt"
start_slave2_cmd+='"'
echo "$start_slave2_cmd"
docker exec mysql_slave2 sh -c "$start_slave2_cmd"

start_slave3_stmt="RESET SLAVE;CHANGE MASTER TO MASTER_HOST='$(docker-ip mysql_master)',MASTER_USER='mydb_slave3_user',MASTER_PASSWORD='mydb_slave3_pwd',MASTER_LOG_FILE='$CURRENT_LOG',MASTER_LOG_POS=$CURRENT_POS; START SLAVE;"
start_slave3_cmd='export MYSQL_PWD=111; mysql -u root -e "'
start_slave3_cmd+="$start_slave3_stmt"
start_slave3_cmd+='"'
echo "$start_slave3_cmd"
docker exec mysql_slave3 sh -c "$start_slave3_cmd"

docker exec mysql_master sh -c "export MYSQL_PWD=111; mysql -u root mydb < /db/mydb.sql"
docker exec mysql_slave1 sh -c "export MYSQL_PWD=111; mysql -u root -e 'SHOW SLAVE STATUS \G'"
docker exec mysql_slave2 sh -c "export MYSQL_PWD=111; mysql -u root -e 'SHOW SLAVE STATUS \G'"
docker exec mysql_slave3 sh -c "export MYSQL_PWD=111; mysql -u root -e 'SHOW SLAVE STATUS \G'"
