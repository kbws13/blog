---
id: docker-and-seata
slug: docker-and-seata
title: SpringBoot 整合 Seata
date: 2025-02-15
tags: [Spring Cloud, Spring Cloud Alibaba, Seata, Docker]
keywords: [Spring Cloud, Spring Cloud Alibaba, Seata, Docker]
image: https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20250215230515.png
---
介绍: 本文介绍了如何使用 Docker 搭建 Seata 的分布式事务管理器，并使用 Spring Cloud Alibaba 的 Seata 集成，以及在这过程中的一些坑。

## 引入依赖

引入 Spring Cloud Alibaba 相关依赖

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-alibaba-dependencies</artifactId>
    <version>2021.0.5.0</version>
    <type>pom</type>
    <scope>import</scope>
</dependency>
```

引入 Seata 相关依赖
```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-seata</artifactId>
    <version>2021.0.5.0</version>
    <exclusions>
        <exclusion>
            <groupId>io.seata</groupId>
            <artifactId>seata-spring-boot-starter</artifactId>
        </exclusion>
        <exclusion>
            <groupId>io.seata</groupId>
            <artifactId>seata-all</artifactId>
        </exclusion>
        <exclusion>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-aop</artifactId>
        </exclusion>
    </exclusions>
</dependency>

<dependency>
    <groupId>io.seata</groupId>
    <artifactId>seata-spring-boot-starter</artifactId>
    <version>1.6.1</version>
</dependency>
```

## 使用 Docker 部署 Seata
> 注意：我使用的是 Nacos 作为注册中心，使用的是 DB 存储，所以先要把 Nacos 和 MySQL 启动起来

### 部署 MySQL

`docker-compose.yml`文件内容：
```yml
services:
  mysql:
    image: mysql:8
    container_name: mysql
    environment:
      LANG: C.UTF-8
      # 设置数据库密码
      MYSQL_ROOT_PASSWORD: 12345678
    ports:
      - "3306:3306"
    command:
      - '--character-set-server=utf8mb4'
      - '--collation-server=utf8mb4_unicode_ci'
    volumes:
      - ./mysql-data:/var/lib/mysql
    restart: always
```

### 部署 Nacos

```yml
services:
  nacos:
    image: nacos/nacos-server:v2.2.0-slim
    container_name: Nacos
    ports:
      - "8848:8848"
      - "9848:9848"
      - "9849:9849"
    volumes:
      - ./nacos-data:/home/nacos/data
    environment:
      - MODE=standalone # 单节点模式启动
      - PREFER_HOST_MODE=hostname # 支持 hostname
      - TZ=Asia/Shanghai # 控制时区
```

> 注意将服务器上面的这三个端口都放开，不然连接不上


## 部署 Seata

### 创建命名空间

在 Nacos 上创建一个新的命名空间：`distributed-transaction`，Seata 的服务和配置文件都放到这个命名空间中

![20250215224848](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20250215224848.png)

#### 创建配置文件

这里需要创建两个配置文件，`service.vgroupMapping.my_tx_group`用于指定使用的集群名字，`seataServer.properties`才是指定相关配置的文件

`service.vgroupMapping.my_tx_group`：

```
default
```

![20250215225027](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20250215225027.png)

`seataServer.properties`：

```properties
store.mode=db
#-----db-----
store.db.datasource=druid
store.db.dbType=mysql
# 需要根据mysql的版本调整driverClassName
# mysql8及以上版本对应的driver：com.mysql.cj.jdbc.Driver
# mysql8以下版本的driver：com.mysql.jdbc.Driver
store.db.driverClassName=com.mysql.cj.jdbc.Driver
store.db.url=jdbc:mysql://<服务器 IP>:3306/seata-server?useUnicode=true&&allowPublicKeyRetrieval=true&characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&useSSL=false
store.db.user=root
# 数据库密码
store.db.password=12345678
# 数据库初始连接数
store.db.minConn=1
# 数据库最大连接数
store.db.maxConn=20
# 获取连接时最大等待时间 默认5000，单位毫秒
store.db.maxWait=5000
# 全局事务表名 默认global_table
store.db.globalTable=global_table
# 分支事务表名 默认branch_table
store.db.branchTable=branch_table
# 全局锁表名 默认lock_table
store.db.lockTable=lock_table
# 查询全局事务一次的最大条数 默认100
store.db.queryLimit=100
# 指定分组名称为 default
service.vgroupMapping.my_tx_group=default

# undo保留天数 默认7天,log_status=1（附录3）和未正常清理的undo
server.undo.logSaveDays=7
# undo清理线程间隔时间 默认86400000，单位毫秒
server.undo.logDeletePeriod=86400000
# 二阶段提交重试超时时长 单位ms,s,m,h,d,对应毫秒,秒,分,小时,天,默认毫秒。默认值-1表示无限重试
# 公式: timeout>=now-globalTransactionBeginTime,true表示超时则不再重试
# 注: 达到超时时间后将不会做任何重试,有数据不一致风险,除非业务自行可校准数据,否者慎用
server.maxCommitRetryTimeout=-1
# 二阶段回滚重试超时时长
server.maxRollbackRetryTimeout=-1
# 二阶段提交未完成状态全局事务重试提交线程间隔时间 默认1000，单位毫秒
server.recovery.committingRetryPeriod=1000
# 二阶段异步提交状态重试提交线程间隔时间 默认1000，单位毫秒
server.recovery.asynCommittingRetryPeriod=1000
# 二阶段回滚状态重试回滚线程间隔时间  默认1000，单位毫秒
server.recovery.rollbackingRetryPeriod=1000
# 超时状态检测重试线程间隔时间 默认1000，单位毫秒，检测出超时将全局事务置入回滚会话管理器
server.recovery.timeoutRetryPeriod=1000
```

### 部署 Seata

在 Seata 目录中创建 Seata 的配置文件：`application.yml`

> Seata 的服务端和客户端要注册到相同的命名空间，相同的分组，相同的应用（本文章没有设置）

```yml
server:
  port: 7091

spring:
  application:
    name: seata-server

logging:
  config: classpath:logback-spring.xml
  file:
    path: ${user.home}/logs/seata
  extend:
    logstash-appender:
      destination: 127.0.0.1:4560
    kafka-appender:
      bootstrap-servers: 127.0.0.1:9092
      topic: logback_to_logstash

console:
  user:
    username: seata
    password: seata

seata:
  config:
    # support: nacos, consul, apollo, zk, etcd3
    type: nacos
    nacos:
      server-addr: <服务器 IP>:8848
      # Seata 配置文件所在的命名空间也就是 distributed-transaction 的命名空间 ID
      namespace: d0274e72-b2c5-428b-ad36-22463f048c7b
      group: DEFAULT_GROUP
      username: nacos
      password: nacos
      # Seata 配置文件名
      data-id: seataServer.properties

  registry:
    # support: nacos, eureka, redis, zk, consul, etcd3, sofa
    type: nacos
    nacos:
      application: seata-server
      server-addr: <服务器 IP>:8848
      group: DEFAULT_GROUP
      # Seata 配置文件所在的命名空间
      namespace: d0274e72-b2c5-428b-ad36-22463f048c7b
      # tc集群名称
      cluster: default
      username: nacos
      password: nacos
#  server:
#    service-port: 8091 #If not configured, the default is '${server.port} + 1000'
  security:
    secretKey: SeataSecretKey0c382ef121d778043159209298fd40bf3850a017
    tokenValidityInMilliseconds: 1800000
    ignore:
      urls: /,/**/*.css,/**/*.js,/**/*.html,/**/*.map,/**/*.svg,/**/*.png,/**/*.ico,/console-fe/public/**,/api/v1/auth/login
```

创建文件：`docker-compose.yml`

```yml
version: '3.8'

services:
  seata-server:
    image: seataio/seata-server:1.7.0
    container_name: seata-server
    ports:
        # 这些端口都要放行
      - "7091:7091"
      - "8091:8091"    # Seata Server
      - "18091:18091"  # Seata Server
    volumes:
      - "./seata-data:/seata/data"
      - "./application.yml:/seata-server/resources/application.yml"
      - "/usr/share/zoneinfo/Asia/Shanghai:/etc/localtime"        #设置系统时区
    environment:
        # 注意，这里要设置服务器I P，不然注册到 Nacos 的是 Seata 所在 Docker 容器的 IP
      - SEATA_IP=<服务器 IP>
      - SEATA_PORT=8091
      - MODE=db
    logging:
      driver: "json-file"
      options:
        max-size: "500m" 
        max-file: "5" 
```

上面的配置文件创建完成后就可以开始启动 Seata 了
在`docker-compose.yml`文件所在的目录下执行命令：

```shell
docker-compose up -d
```

一起没问题的话，可以在 Nacos 中看到 Seata 服务了

![20250215225509](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20250215225509.png)

## 项目配置

在项目中配置如下：
```yml
seata:
  enabled: true
  enable-auto-data-source-proxy: true
  tx-service-group: my_tx_group
  service:
    vgroup-mapping:
      my_tx_group: default
  config:
    type: nacos
    nacos:
      server-addr: <服务器 IP>:8848
      username: nacos
      password: nacos
      # 配置文件的名字
      data-id: seataServer.properties
      # 命名空间的 ID
      namespace: d0274e72-b2c5-428b-ad36-22463f048c7b
      # 指定所在的分组
      group: DEFAULT_GROUP
  registry:
    type: nacos
    nacos:
      server-addr: <服务器 IP>:8848
      application: seata-server
      username: nacos
      password: nacos
      # 命名空间的 ID
      namespace: d0274e72-b2c5-428b-ad36-22463f048c7b
      # 指定所在的分组
      group: DEFAULT_GROUP
```

## 测试执行

运行项目，输出日志如下并且没有报错，即为成功

```
25-02-15.22:25:40.547 [timeoutChecker_2_1] INFO  RmNettyRemotingClient  [] register RM success. client version:1.6.1, server version:1.7.0,
```

