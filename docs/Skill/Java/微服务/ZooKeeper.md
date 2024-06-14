---
id: zookeeper
slug: /zookeeper
title: ZooKeeper
date: 2024-06-14
tags: [注册中心, 分布式锁, 事件监听]
keywords: [注册中心, 分布式锁, 事件监听]
---

## 概述

Zookeeper 是 Apache Hadoop 项目下的一个子项目，是一个树形目录服务

Zookeeper 是一个分布式的、开源的分布式应用程序的协调服务

Zookeeper 提供的功能主要包括：

- 配置管理
- 分布式锁
- 集群管理


## 安装和配置

Windows 安装：

[Windows 安装 Zookeeper 详细步骤_wzieprk-CSDN博客](https://blog.csdn.net/wxw1997a/article/details/119998932)

Ubuntu 安装：

[https://www.cnblogs.com/r1-12king/p/16299241.html](https://www.cnblogs.com/r1-12king/p/16299241.html)

## 命令操作

### 数据模型

Zookeeper 是一个树形目录结构，其数据模型和 Unix 的文件系统目录树很类似，拥有一个层次化结构

这里面每一个节点都被称为：ZNode，每个节点上都会保存自己的数据和节点信息

节点可以拥有自己的子节点，同时也允许少量（1MB）数据存储在该节点下

节点可以分为四大类：

- Persistent 持久化节点
- Ephemeral 临时节点：-e
- Persistent_Sequential：持久化顺序节点：-s
- Ephemeral_Sequential：临时顺序节点：-es

![20240614221150](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240614221150.png)


### 服务端常用命令

启动 Zookeeper 服务

```shell
./zkServer.sh start
```

查看 Zookeeper 服务状态

```shell
./zkServer.sh status
```

停止 Zookeeper 服务

```shell
./zkServer.sh stop
```

重启 Zookeeper 服务

```shell
./zkServer.sh restart
```

### 客户端命令

连接 Zookeeper 服务端

```shell
./zkCli.sh server ip:host
```

断开连接

```shell
quit
```

显示指定目录下节点

```shell
ls 目录
```

创建节点

```shell
create /节点path value
```

获取节点值

```shell
get /节点path
```

设置节点值

```shell
set /节点path value
```

删除单个节点

```shell
delete /节点path
```

删除带有子节点的节点

```shell
deleteall /节点path
```

查看命令帮助
```shell
help
```

创建临时节点

```shell
create -e /节点path value
```

创建顺序节点

```shell
create -s /节点path value
```

查询节点详细信息

```shell
ls -s /节点path
```

## Java API操作

### 导入依赖

```xml
<dependencies>
    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.10</version>
        <scope>test</scope>
    </dependency>
    <!--curator-->
    <dependency>
        <groupId>org.apache.curator</groupId>
        <artifactId>curator-framework</artifactId>
        <version>4.0.0</version>
    </dependency>

    <dependency>
        <groupId>org.apache.curator</groupId>
        <artifactId>curator-recipes</artifactId>
        <version>4.0.0</version>
    </dependency>
    <!--日志-->
    <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-api</artifactId>
        <version>1.7.21</version>
    </dependency>

    <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-log4j12</artifactId>
        <version>1.7.21</version>
    </dependency>
</dependencies>

<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.1</version>
            <configuration>
                <source>1.8</source>
                <target>1.8</target>
            </configuration>
        </plugin>
    </plugins>
</build>
```

### 常用操作

#### 建立连接

第一种方式

```java
@Test
public void testConnect(){
    // 重试策略
    RetryPolicy retryPolicy = new ExponentialBackoffRetry(3000,10);
    // 第一种方式
    CuratorFramework client = CuratorFrameworkFactory.newClient("localhost:2181",60 * 1000, 15 * 1000, retryPolicy);
    // 开启连接
    client.start();
}
```

第二种方式

```java
@Test
public void testConnect(){
    // 重试策略
    RetryPolicy retryPolicy = new ExponentialBackoffRetry(3000,10);
    // 第二种方式
    CuratorFramework client = CuratorFrameworkFactory.builder().connectString("localhost:2181")
            .sessionTimeoutMs(60 * 1000)
            .connectionTimeoutMs(15 * 1000)
            .retryPolicy(retryPolicy).namespace("kbws").build();
    // 开启连接
    client.start();
}
```

namespace 命名空间，设置这个参数之后，后面所有的操作默认是在该命名空间下进行的

#### 创建节点

```java
@Test
public void testCreate() throws Exception {
    // 1.基本创建
    // 如果创建节点，没有指定数据，则默认将当前客户端的ip作为数据存储
    String path = client.create().forPath("/app1");
    System.out.println(path);

    // 2.创建节点，带有数据
    client.create().forPath("/app2","hsy".getBytes());

    // 3.设置节点的类型
    // 默认类型：持久化
    client.create().withMode(CreateMode.EPHEMERAL).forPath("/app3");

    // 4.创建多级节点
    // creatingParentsIfNeeded：如果父节点不存在，则创建父节点
    client.create().creatingParentsIfNeeded().forPath("/app4/p1");
}
```

#### 删除节点

```java
@Test
public void testDelete() throws Exception {
    // 1.删除单个节点
    client.delete().forPath("/app1");

    // 2.删除带有子节点的节点
    client.delete().deletingChildrenIfNeeded().forPath("/app1");

    // 3.必须删除成功，防止因网络波动造成删除命令传达失败
    client.delete().guaranteed().forPath("/app2");

    // 4.回调，绑定一个回调函数，删除成功后自动执行该方法
    client.delete().inBackground(new BackgroundCallback() {
        @Override
        public void processResult(CuratorFramework curatorFramework, CuratorEvent curatorEvent) throws Exception {
            System.out.println("删除成功");
            System.out.println(curatorEvent);
        }
    }).forPath("/app1");
}
```

#### 修改节点

```java
@Test
public void testSet() throws Exception {
    // 1.修改数据
    client.setData().forPath("/app1");

    // 2.根据版本修改数据
    Stat status = new Stat();
    client.setData().withVersion(status.getVersion()).forPath("/app1","test".getBytes());
    
}
```

#### 查询节点

```java
@Test
public void testGet() throws Exception {
    // 1.查询数据
    byte[] data = client.getData().forPath("/app1");
    System.out.println(new String(data));

    // 2.查询子节点
    List<String> list = client.getChildren().forPath("/");

    // 3.查询节点状态信息
    Stat status = new Stat();
    client.getData().storingStatIn(status).forPath("/app1");
    System.out.println(status);
}
```

#### Watch事件监听

Zookeeper 允许用户在指定节点上注册一些 Watcher，并且在一些特定事件触发的适合，Zookeeper 服务端会将事件通知到感兴趣的客户端上去，该机制是 Zookeeper 实现分布式协调服务的重要特性

Zookeeper 中引入了 Watcher 机制来实现了订阅/发布功能，能够让多个订阅者同时监听同一个对象，当一个对象自身状态变化时，会通知所有订阅者

Curator 引入了 Cache 来实现对 Zookeeper 服务端事件的监听

Zookeeper 提供了三种 Watcher：

- NodeCache：只是监听某个特定的节点
- PathChildrenCache：监控一个 ZNode 的子节点
- TreeCache：可以监控整个树上的节点，类似于 PathChildrenCache 和 NodeCache 的组合

##### NodeCache

```java
/**
 * 给指定一个节点注册监听器
 */
@Test
public void testNodeCache() throws Exception {
    // 1.创建一个NodeCache对象
    NodeCache nodeCache = new NodeCache(client,"/app1");
    // 2.注册监听
    nodeCache.getListenable().addListener(new NodeCacheListener() {
        @Override
        public void nodeChanged() throws Exception {
            System.out.println("节点发生了变化");
            // 获取修改节点后的数据
            byte[] data = nodeCache.getCurrentData().getData();
            System.out.println(new String(data));
        }
    });
    // 3.开启监听，如果设置为true，则开启监听时，加载缓冲数据
    nodeCache.start(true);
}
```

##### PathChildrenCache

```java
/**
 * 监听某个节点的所有子节点们
 */
@Test
public void testPathChildrenCache() throws Exception {
    // 1.创建一个NodeCache对象
    PathChildrenCache nodeCache = new PathChildrenCache(client,"/app1", true);
    // 2.注册监听
    nodeCache.getListenable().addListener(new PathChildrenCacheListener() {
        @Override
        public void childEvent(CuratorFramework curatorFramework, PathChildrenCacheEvent pathChildrenCacheEvent) throws Exception {
            System.out.println("子节点发生变化");
            System.out.println(pathChildrenCacheEvent);
            // 监听子节点的数据变化，并且拿到变更后的数据
            // 1.获取类型
            PathChildrenCacheEvent.Type type = pathChildrenCacheEvent.getType();
            // 2.判断类型是否是update
            if (type.equals(PathChildrenCacheEvent.Type.CHILD_UPDATED)) {
                byte[] data = pathChildrenCacheEvent.getData().getData();
                System.out.println(new String(data));
            }
        }
    });
    // 3.开启监听，如果设置为true，则开启监听时，加载缓冲数据
    nodeCache.start(true);
}
```

##### TreeCache

```java
/**
 * 监听某个节点自己和所有子节点们
 */
@Test
public void testTreeCache() throws Exception {
    // 1.创建监听器
    TreeCache treeCache = new TreeCache(client,"/app2");

    // 2.注册监听
    treeCache.getListenable().addListener(new TreeCacheListener() {
        @Override
        public void childEvent(CuratorFramework curatorFramework, TreeCacheEvent treeCacheEvent) throws Exception {
            System.out.println("节点变化了");
            System.out.println(treeCacheEvent);
        }
    });

    // 3.开启
    treeCache.start();
}
```

### 分布式锁

在进行单机开发，涉及到并发同步时，往往采用 synchronized 或者 Lock 的方式来解决多线程的代码同步问题，这时多个线程都运行在一个 JVM 中，没有任何问题

当应用是分布式集群工作的情况下，属于多 JVM 的工作环境，跨 JVM 之间已经无法通过多线程的锁解决同步问题

这么就需要一种更高级的锁机制，来**解决跨机器的进制之间的数据同步问题**——这就是分布式锁

##### Zookeeper分布式锁原理

![20240614221308](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240614221308.png)

核心思想：当客户端要获取锁，则创建节点，使用完锁，则删除该节点

1. 客户端获取锁时，在 lock 节点下创建**临时顺序**节点
2. 然后获取 lock 下面的所有子节点，客户端获取所有子节点后，如果发现自己创建的子节点序号最小，那么就认为该客户端拿到了锁，使用完锁之后，将该节点删除
3. 如果发现自己创建的节点并非 lock 所有子节点中最小的，说明自己没有获取到锁，此时客户端需要找到比自己小的那个节点，同时对其注册事件监听器，监听删除事件
4. 如果发现比自己小的节点被删除，则客户端的 Watcher 会收到相应通知，此时再判断自己创建的节点是否是 lock 子节点中序号最小的，如果是则获取到了锁，如果不是则重复以上步骤继续获取比自己小的一个节点，并进行注册监听


### 模拟12306售票案例

##### Curator实现分布式锁API

在 Curator 中有五种锁方案：

- InterProcessSemahoreMutex：分布式排他锁（非可重入锁）
- InterProcessMutex：分布式可重入排他锁
- InterProcessReadWriteLock：分布式读写锁
- InterProcessMultiLock：将多个锁作为单个实体管理的容器
- InterProcessSemaphoreV2：共享信号量

**实体类**

```java
public class Ticket implements Runnable{

    private int tickets = 10;
    private InterProcessMutex lock;

    public Ticket() {
        // 重试策略
        RetryPolicy retryPolicy = new ExponentialBackoffRetry(3000,10);

        CuratorFramework client = CuratorFrameworkFactory.builder().connectString("localhost:2181")
                .sessionTimeoutMs(60 * 1000)
                .connectionTimeoutMs(15 * 1000)
                .retryPolicy(retryPolicy).namespace("kbws").build();
        // 开启连接
        client.start();

        lock = new InterProcessMutex(client,"/lock");
    }

    @Override
    public void run() {
        while (true) {
            // 获取锁
            try {
                lock.acquire(3, TimeUnit.SECONDS);
                if (tickets > 0) {
                    System.out.println(Thread.currentThread() + ":" + tickets);
                    tickets--;
                    Thread.sleep(100);
                }
            } catch (Exception e) {
                throw new RuntimeException(e);
            }finally {
                // 释放锁
                try {
                    lock.release();
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
            }
        }
    }
}
```

**测试类**

```java
public class LockTest {
    public static void main(String[] args) {
        Ticket ticket = new Ticket();

        // 创建客户端
        Thread t1 = new Thread(ticket,"携程");
        Thread t2 = new Thread(ticket,"飞猪");

        t1.start();
        t2.start();
    }
}
```


