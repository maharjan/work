Redis Cluster(Master-Slave) Steps:

1) Installation 
Unzip the tar file
move unziped redis directory to desired location : 
eg: mv redis-3.2.9 /usr/sw

Rename redis direcroty 
eg: mv /usr/sw/redis-3.2.9 /usr/sw/redis-master/

CD /usr/sw/redis-master/
run 'make'
run 'make test'
run 'sudo make install'
CD redis-master/utils
execute 'sudo ./install_server.sh'
Define port (default 6379)
Define conf file location: eg '/usr/sw/redis-master/conf/redis.conf'
Define log file location: eg '/usr/sw/redis-master/logs/redis.log'
Define data file location: eg '/usr/sw/redis-master/data/redis.conf'
Define executable location: eg '/usr/local/bin/redis-server'

2) To check if redis is working fine
sudo service redis_port restart
redis-master/src/redis-cli -p port
SET test:info "content:this is redis test"
GET test:info
[* Repeat above step for another redis instance]

3) Redis instance as Master:
Edit redis-master/redis.conf
update to 'tcp-keepalive 60'  [#for more, read redis.conf]
comment out 'bind 127.0.0.1' or add new network address
update 'requirepass' with very strong master password
update 'maxmemory-policy' to 'allkeys-lru' 
#uncomment and if max assigned memory is reached this removes the keys based on LRU Algorithm.
Update to
 appendonly yes
appendfilename "redis-master-prod-aof.aof"

#this allows redis to write/append data to files and regarded as durable in case  of failure. More on http://redis.io/topics/persistence

4) Redis instance as Slave:
Edit redis-slave/redis.conf
update to 'tcp-keepalive 60'
comment out 'bind 127.0.0.1' or add network address
update 'requirepass' with very strong slave password
update 'maxmemory-policy' to 'allkeys-lru'
Update to
appendonly yes
appendfilename "redis-slave-prod-aof.aof"

update 'slaveof master_ip master_port'
update 'masterauth master_redis_pass'

5) Restart master and slave redis
redis-master/src/redis-cli -p 6300 -a master_password -h master_ip
shutdown
quit 
sudo service redis_6300 start

redis-slave/src/redis-cli -p 6301 -a slave_password -h slave_ip
shutdown
quit
sudo service redis_6301 start

6) Verify Replication Status
execute command:
redis-master/src/redis-cli -p 6300 -a master_password -h master_ip

execute command: INFO
Then check for line with
# Replication
role:master
connected_slaves:1

execute command:
redis-slave/src/redis-cli -p 6301 -a slave_password -h slave_ip

execute command: INFO
Then check for line with
# Replication
role:slave
.....
master_link_status:up
master_last_io_seconds_ago:3
master_sync_in_progress:0

7) Verify Data Replication
execute command: 
redis-master/src/redis-cli -p 6300 -a master_password -h master_ip
set user:test "say hello"
get user:test

execute command: 
redis-slave/src/redis-cli -p 6301 -a slave_password -h slave_ip
get user:test

#Output from both master and slave should be same!

Verifying data expiry on master
set user:exp "Expiry check"
expire user:exp 30    #expires data after 30 sec

Verify data and again check data on slave after 30 sec
get user:exp

8) To turn slave into master
redis-slave/src/redis-cli -p 6301 -a slave_password -h slave_ip
slaveof no one
info
# Replication
role:master

# now this instance is master and data of previous master will not be replicated. Shutting down and restarting this instance however will again make it slave. All master data will be synced.


9) Reference:
1. https://www.digitalocean.com/community/tutorials/how-to-install-and-use-redis
2. https://www.digitalocean.com/community/tutorials/how-to-configure-a-redis-cluster-on-ubuntu-14-04#step-2-—-configure-redis-master