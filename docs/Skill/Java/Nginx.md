---
id: nginx
slug: /nginx
title: Nginx
date: 2024-06-21
tags: [路由匹配, 反向代理, 负载均衡, 跨域, 黑白名单, 限流, HTTPS, 压缩, 重试策略]
keywords: [路由匹配, 反向代理, 负载均衡, 跨域, 黑白名单, 限流, HTTPS, 压缩, 重试策略]
---

## 介绍
### 特点

1. 处理响应请求快（异步非阻塞I/O，零拷贝，mmap，缓存机制）
2. 扩展性好（模块化设计）
3. 内存消耗低（异步非阻塞，多阶段处理）
4. 可靠性好
5. 热部署
6. 高并发连接（事件驱动模型，多进程机制）
7. 自由的 BSD 许可协议（可以自己修改代码后发布）

### 架构

![20240621230217](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240621230217.png)

**Nginx特点**：

1. 事件驱动&异步非阻塞：事件驱动机制就是指当有读/写/连接事件就绪时 再去做读/写/接受连接这些事情，而不是一直在那里傻傻的等，基于事件驱动思想设计的多路复用I/O（如select/poll，epoll），相对于传统I/O模型，达到了异步非阻塞的效果
2. 多进程机制：Nginx 有两种类型的进程，一种是Master主进程，一种是Worker工作进程。主进程主要负责3项工作：加载配置、启动工作进程及非停升级。另外work进程是主进程启动后，fork而来的。假设 Nginx fork 了多个 Worker 进程，并且在 Master 进程中通过 socket 套接字监听（listen）80端口。然后每个worker 进程都可以去 accept 这个监听的 socket。 当一个连接进来后，所有 Worker 进程，都会收到消息，但是只有一个 Worker 进程可以 accept 这个连接，其它的则 accept 失败，Nginx 保证只有一个Worker去accept的方式就是加锁（accept_mutex）。有了锁之后，在同一时刻，就只会有一个Worker进程去 accpet 连接，在 Worker 进程拿到 Http 请求后，就开始按照worker进程内的预置模块去处理该 Http 请求，最后返回响应结果并断开连接
3. Proxy Cache（服务端缓存）：Nginx 服务器在接收到被代理服务器的响应数据之后，一方面将数据传递给客户端，另一方面根据 Proxy Cache 的配置将这些数据缓存到本地硬盘上。当客户端再次访问相同的数据时，Nginx 服务器直接从硬盘检索到相应的数据返回给用户，从而减少与被代理服务器交互的时间。在缓存数据时，运用了零拷贝以及 mmap 技术，使得数据 copy 性能大幅提升
4. 反向代理：通过反向代理，可以隐藏真正的服务，增加其安全性，同时便于统一管理处理请求，另外可以很容易的做个负载均衡，更好的面对高并发的场景

### 模块

Nginx 模块图如下：

![20240621230234](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240621230234.png)

- **核心模块**：Nginx 服务器正常运行不可缺少的部分，提供错误日志解析、配置文件解析、事件驱动机制、进程管理等核心功能
- **标准HTTP模块**：提供 HTTP 协议相关的功能，如：端口配置、网页编码配置、HTTP 响应头设置等
- **可选HTTP模块**：用户拓展标准的 HTTP 功能，让 Nginx 能处理一些特殊的服务，如：Flash 多媒体传输、解析 GeoIP 请求、SSL 支持等
- **邮件服务模块**：主要用于支持 Nginx 的邮件服务，包括对 POP3 协议、IMAP 协议和 SMTP 协议的支持
- **第三方模块**：JSON 支持、Lua 支持等

### 常见应用场景

- 反向代理
- 负载均衡
- 缓存
- 限流
- 静态资源服务
- 跨域
- 防盗链
- 高可用

## 目录

```java
[root@localhost /]# tree  /usr/local/nginx/  -L 2
/usr/local/nginx/
├── conf                        #存放一系列配置文件的目录
│   ├── fastcgi.conf           #fastcgi程序相关配置文件
│   ├── fastcgi.conf.default   #fastcgi程序相关配置文件备份
│   ├── fastcgi_params         #fastcgi程序参数文件
│   ├── fastcgi_params.default #fastcgi程序参数文件备份
│   ├── koi-utf           #编码映射文件
│   ├── koi-win           #编码映射文件
│   ├── mime.types        #媒体类型控制文件
│   ├── mime.types.default#媒体类型控制文件备份
│   ├── nginx.conf        #主配置文件
│   ├── nginx.conf.default#主配置文件备份
│   ├── scgi_params      #scgi程序相关配置文件
│   ├── scgi_params.default #scgi程序相关配置文件备份
│   ├── uwsgi_params       #uwsgi程序相关配置文件
│   ├── uwsgi_params.default#uwsgi程序相关配置文件备份
│   └── win-utf          #编码映射文件
├── html                 #存放网页文档
│   ├── 50x.html         #错误页码显示网页文件
│   └── index.html       #网页的首页文件
├── logs                 #存放nginx的日志文件
├── sbin                #存放启动程序
│   ├── nginx           #nginx启动程序
│   └── nginx.old       
└── test                # 我自己建的目录，不用管这个
    ├── abc
    └── cba

15 directories, 26 files

```


## nginx.conf

`nginx.conf`文件是由一个一个的指令块组成的，用`{}`标识一个指令块

指令块有：

- 全局块
- events 块
- http 块
- location 块
- upstream 块

```java
全局模块
event模块
http模块
    upstream模块
    
    server模块
        location块
        location块
        ....
    server模块
        location块
        location块
        ...
    ....    

```

1. **全局模块：**配置影响 Nginx 全局的指令，比如运行 Nginx 的用户名、进程 pid 存放路径、日志存放路径、配置文件引入、worker 进程数等
2. **events 模块：**配置影响 Nginx 服务器或与其他用户的网络连接，例如：每个进程的最大连接数，选取哪种时间驱动模型（select/poll epoll 或者是其他 Nginx 支持的）来处理连接请求，是否允许同时接受多个网络连接，开启多个网络连接序列化等
3. **http 模块：**可以嵌套多个 server，配置代理、缓存、日志格式等绝大多数功能和第三方模块的配置。如：文件引入、mime-type 定义、日志自定义、是否使用 sendfile 传输文件、连接超时时间、单连接请求数等
4. **server 模块：**配置虚拟主机的相关参数比如域名端口等，一个 http 中可以有多个 server
5. **localtion 块：**配置 url 路由规则
6. **upstream 块：**配置上游服务器的地址以及负载均衡策略和重试策略等

```shell
# 注意：有些指令是可以在不同指令块使用的（需要时可以去官网看看对应指令的作用域）。我这里只是演示
# 这里我以/usr/local/nginx/conf/nginx.conf文件为例

[root@localhost /usr/local/nginx]# cat /usr/local/nginx/conf/nginx.conf

#user  nobody; # 指定Nginx Worker进程运行用户以及用户组，默认由nobody账号运行
worker_processes  1;  # 指定工作进程的个数，默认是1个。具体可以根据服务器cpu数量进行设置， 比如cpu有4个，可以设置为4。如果不知道cpu的数量，可以设置为auto。 nginx会自动判断服务器的cpu个数，并设置相应的进程数
#error_log  logs/error.log;  # 用来定义全局错误日志文件输出路径，这个设置也可以放入http块，server块，日志输出级别有debug、info、notice、warn、error、crit可供选择，其中，debug输出日志最为最详细，而crit输出日志最少。
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info; # 指定error日志位置和日志级别
#pid        logs/nginx.pid;  # 用来指定进程pid的存储文件位置

events {
    accept_mutex on;   # 设置网路连接序列化，防止惊群现象发生，默认为on
    
    # Nginx支持的工作模式有select、poll、kqueue、epoll、rtsig和/dev/poll，其中select和poll都是标准的工作模式，kqueue和epoll是高效的工作模式，不同的是epoll用在Linux平台上，而kqueue用在BSD系统中，对于Linux系统，epoll工作模式是首选
    use epoll;
    
    # 用于定义Nginx每个工作进程的最大连接数，默认是1024。最大客户端连接数由worker_processes和worker_connections决定，即Max_client=worker_processes*worker_connections在作为反向代理时，max_clients变为：max_clients = worker_processes *worker_connections/4。进程的最大连接数受Linux系统进程的最大打开文件数限制，在执行操作系统命令“ulimit -n 65536”后worker_connections的设置才能生效
    worker_connections  1024; 
}

# 对HTTP服务器相关属性的配置如下
http {
    include       mime.types; # 引入文件类型映射文件 
    default_type  application/octet-stream; # 如果没有找到指定的文件类型映射 使用默认配置 
    # 设置日志打印格式
    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';
    # 
    #access_log  logs/access.log  main; # 设置日志输出路径以及 日志级别
    sendfile        on; # 开启零拷贝 省去了内核到用户态的两次copy故在文件传输时性能会有很大提升
    #tcp_nopush     on; # 数据包会累计到一定大小之后才会发送，减小了额外开销，提高网络效率
    keepalive_timeout  65; # 设置nginx服务器与客户端会话的超时时间。超过这个时间之后服务器会关闭该连接，客户端再次发起请求，则需要再次进行三次握手。
    #gzip  on; # 开启压缩功能，减少文件传输大小，节省带宽。
    sendfile_max_chunk 100k; #每个进程每次调用传输数量不能大于设定的值，默认为0，即不设上限。
    
    # 配置你的上游服务（即被nginx代理的后端服务）的ip和端口/域名
    upstream backend_server { 
        server 172.30.128.65:8080;
        server 172.30.128.65:8081 backup; #备机
    }

    server {
        listen       80; #nginx服务器监听的端口
        server_name  localhost; #监听的地址 nginx服务器域名/ip 多个使用英文逗号分割
        #access_log  logs/host.access.log  main; # 设置日志输出路径以及 级别，会覆盖http指令块的access_log配置
        
        # location用于定义请求匹配规则。 以下是实际使用中常见的3中配置（即分为：首页，静态，动态三种）
       
        # 第一种：直接匹配网站根目录，通过域名访问网站首页比较频繁，使用这个会加速处理，一般这个规则配成网站首页，假设此时我们的网站首页文件就是： usr/local/nginx/html/index.html
        location = / {  
            root   html; # 静态资源文件的根目录 比如我的是 /usr/local/nginx/html/
            index  index.html index.htm; # 静态资源文件名称 比如：网站首页html文件
        }
        # 第二种：静态资源匹配（静态文件修改少访问频繁，可以直接放到nginx或者统一放到文件服务器，减少后端服务的压力），假设把静态文件我们这里放到了 usr/local/nginx/webroot/static/目录下
        location ^~ /static/ {
            alias /webroot/static/; 访问 ip:80/static/xxx.jpg后，将会去获取/url/local/nginx/webroot/static/xxx.jpg 文件并响应
        }
        # 第二种的另外一种方式：拦截所有 后缀名是gif,jpg,jpeg,png,css.js,ico这些 类静态的的请求，让他们都去直接访问静态文件目录即可
        location ~* \.(gif|jpg|jpeg|png|css|js|ico)$ {
            root /webroot/static/;
        }
        # 第三种：用来拦截非首页、非静态资源的动态数据请求，并转发到后端应用服务器 
        location / {
            proxy_pass http://backend_server; #请求转向 upstream是backend_server 指令块所定义的服务器列表
            deny 192.168.3.29; #拒绝的ip （黑名单）
            allow 192.168.5.10; #允许的ip（白名单）
        }
        
        # 定义错误返回的页面，凡是状态码是 500 502 503 504 总之50开头的都会返回这个 根目录下html文件夹下的50x.html文件内容
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
        
    }
    # 其余的server配置 ,如果有需要的话
    #server {
        ......
    #    location / {
               ....
    #    }
    #}
    
    # include /etc/nginx/conf.d/*.conf;  # 一般我们实际使用中有很多配置，通常的做法并不是将其直接写到nginx.conf文件，
    # 而是写到新文件 然后使用include指令 将其引入到nginx.conf即可，这样使得主配置nginx.conf文件更加清晰。
    
}

```

## location路由匹配规则

Nginx 根据用户请求的 URI 来匹配对应的 location 块，匹配到哪个 location，请求就被那个 location 块中的配置处理

location 的配置语法：`location [修饰符] pattern {......}`

**常见匹配规则如下：**

![20240621230343](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240621230343.png)

### 前缀匹配（无修饰符）

创建一个 prefix_match.html 文件，然后修改 nginx.conf 文件（给前缀是 /prefixmatch 的请求返回这个 html 文件）

![20240621230354](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240621230354.png)

观察 Nginx 服务器返回的内容如下：

![20240621230405](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240621230405.png)

```shell
curl http://www.locatest.com/prefixmatch     ✅ 301
curl http://www.locatest.com/prefixmatch?    ✅ 301
curl http://www.locatest.com/PREFIXMATCH     ❌ 404
curl http://www.locatest.com/prefixmatch/    ✅ 200
curl http://www.locatest.com/prefixmatchmmm  ❌ 404
curl http://www.locatest.com/prefixmatch/mmm ❌ 404
curl http://www.locatest.com/aaa/prefixmatch/❌ 404
```

可以看到`域名/prefixmatch`和`域名/prefixmatch?`返回了301 ，原因在于prefixmatch映射的 /etc/nginx/locatest/ 是个目录，而不是个文件所以nginx提示 301

### 精准匹配（=）

在 nginx.conf 中添加一个配置

![20240621230423](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240621230423.png)

实际效果如下：

![20240621230432](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240621230432.png)

```shell
http://www.locatest.com/exactmatch      ✅ 200
http://www.locatest.com/exactmatch？    ✅ 200
http://www.locatest.com/exactmatch/     ❌ 404
http://www.locatest.com/exactmatchmmmm  ❌ 404
http://www.locatest.com/EXACTMATCH      ❌ 404
```

### 前缀匹配（^~）

添加 Nginx 配置

![20240621230446](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240621230446.png)

效果如下：

![20240621230456](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240621230456.png)

```shell
curl http://www.locatest.com/exactprefixmatch     ✅ 200
curl http://www.locatest.com/exactprefixmatch/    ✅ 200
curl http://www.locatest.com/exactprefixmatch?    ✅ 200
curl http://www.locatest.com/exactprefixmatchmmm  ✅ 200
curl http://www.locatest.com/exactprefixmatch/mmm ✅ 200
curl http://www.locatest.com/aaa/exactprefixmatch ❌ 404
curl http://www.locatest.com/EXACTPREFIXMATCH     ❌ 404
```

可以看到带修饰符（^~）的前缀匹配 像：`域名/exactprefixmatchmmm`和`域名/exactprefixmatch/mmm`是可以匹配上的，而不带修饰符的前缀匹配这两个类型的url是匹配不上的直接返回了404 ，其他的和不带修饰符的前缀匹配似乎都差不多

### 正则匹配（~区分大小写）

添加 location 并配置，如下（^ 表示开头，$ 表示结尾）

![20240621230513](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240621230513.png)

效果如下：

![20240621230522](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240621230522.png)

```shell
curl http://www.locatest.com/regexmatch      ✅ 200
curl http://www.locatest.com/regexmatch/     ❌ 404
curl http://www.locatest.com/regexmatch?     ✅ 200
curl http://www.locatest.com/regexmatchmmm   ❌ 404
curl http://www.locatest.com/regexmatch/mmm  ❌ 404
curl http://www.locatest.com/REGEXMATCH      ❌ 404
curl http://www.locatest.com/aaa/regexmatch  ❌ 404
curl http://www.locatest.com/bbbregexmatch   ❌ 404
```

可以看到~修饰的正则是区分大小写的

### 正则匹配（~* 不区分大小写）

在 location 的 ~ 修饰符后面加个 *

![20240621230536](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240621230536.png)

效果如下：

![20240621230545](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240621230545.png)

### 通用匹配（/）

通用匹配用一个 / 表示，可以匹配所有请求，一般 Nginx 配置文件最后都有一个 通用匹配规则，当其他匹配规则都失效时，请求会被通用匹配规则给处理，如果没有通用匹配规则兜底，Nginx 会返回 404 错误

![20240621230559](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240621230559.png)

实际效果：

![20240621230605](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240621230605.png)

### 关于location匹配优先级

**对location匹配优先级的总结如下：**

1. 优先走`精确匹配`，精确匹配命中时，直接走对应的 location，停止之后的匹配动作
2. `无修饰符类型的前缀匹配`和`^~ 类型的前缀匹配`命中时，收集命中的匹配，对比出最长的那一条并存起来（最长指的是与请求 url 匹配度最高的那个 location）
3. 如果步骤2中最长的那一条匹配是`^~类型`的前缀匹配，直接走此条匹配对应的 location 并停止后续匹配动作；如果步骤2最长的那一条匹配不是`^~类型`的前缀匹配（也就是无修饰符的前缀匹配），则继续往下匹配
4. 按 location 的声明顺序，执行正则匹配，当找到第一个命中的正则 location 时，停止后续匹配
5. 都没匹配到，走通用匹配（ / ）（如果有配置的话），如果没配置通用匹配的话，上边也都没匹配上，到这里就是404了

如果非要给修饰符排个序的话就是：`= > ^~ > 正则 > 无修饰符的前缀匹配 > /`

## 反向代理

![20240621230618](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240621230618.png)

### 服务准备

自己准备一个 Java 服务，跑在 8081 端口

### 修改nginx.conf

1. 通过 upstream 指令块来定义上游服务（即被代理的服务）
2. 通过 location 指令块中的 proxy_pass 指令，指定该 location 要路由到哪个 upstream

![20240621230630](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240621230630.png)

> 上面的`http://mybackendserver/`后面这个斜杠加和不加的差别很大，加的话不会拼接`/backend`，而不加的话会拼接`/backend`

### 测试

![20240621230640](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240621230640.png)

使用`tail -n +1 -f access.log`观察 Nginx 的日志输出如下：

![20240621230649](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240621230649.png)

### 反向代理原理和流程

![20240621230658](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240621230658.png)

## 负载均衡

负载均衡就是：避免高并发流量时请求都聚集到某一个服务或某几个服务上，而是让其均匀的分配（或者能者多劳），从而减少高并发带来的系统压力，从而服务更稳定。对于 Nginx 来说，负载均衡就是从`upstream`模块定义的后端服务器列表中按照配置的负载策略选取一台服务器接收用户的请求

### 准备后端服务

先准备三个不同端口（8081、8082、8083）的服务

### Nginx常用的负载策略

![20240621230711](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240621230711.png)

#### 轮询

轮询是默认的，只需要像下面这样修改配置文件就可以

![20240621230720](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240621230720.png)

#### weight

weight 指令用于指定轮询的几率，weight 的默认值是 1，weight 的数值跟访问率成正比

![20240621230730](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240621230730.png)

权重策略下的访问结果：

![20240621230737](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240621230737.png)

#### ip_hash

直接在`upstream`中设置`ip_hash`就行

![20240621230747](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240621230747.png)

重启后查看效果：

![20240621230754](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240621230754.png)

#### least_conn

跟`ip_hash`一样

![20240621230804](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240621230804.png)

## 动静分离

![20240621230810](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240621230810.png)

配置文件为：

![20240621230818](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240621230818.png)

演示：

![20240621230829](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240621230829.png)

![20240621230836](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240621230836.png)

![20240621230842](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240621230842.png)

查看 Nginx 日志可以看到两次请求的输出

![20240621230853](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240621230853.png)

## 跨域

### 跨域的原因

同源策略：为了保证用户信息安全，防止恶意网站窃取数据。**协议+域名+端口**相同的两个请求，可以被看做是同源的，如果任意一点不同，则是两个不同源的请求，会限制两个不同源之间的资源交互从而减少数据安全问题

### 演示

![20240621230904](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240621230904.png)

![20240621230911](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240621230911.png)

### Nginx解决跨域

将前后端的代理放在一个 server 中，因为一个 server 支持多个 location 配置

![20240621230921](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240621230921.png)

![20240621230928](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240621230928.png)

## 黑白名单

allow 配置白名单，deny 配置黑名单。在实际使用中，一般都会建个黑名单和白名单的文件然后在`nginx.conf`中 include 一下，这样可以保持主配置文件的整洁，也好管理

### 语法作用域

官网示例

![20240621230943](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240621230943.png)

ip 既可以是 ipv4 也可以是 ipv6 也可以按照网段来配置，ip 的黑白配置可以在 http、server、location 和 limit_except这几个作用域都可以，区别在于作用力度大小不同，Nginx 建议使用`ngx_http_geo_module`这个库，`ngx_http_geo_module`库支持按地区、国家进行屏蔽，并且提供了 IP 库，当需要配置的名单比较多或者根据地区国家屏蔽时这个库可以帮上大忙

### 黑白名单演示

允许任何 ip 访问前端，然后禁止`172.30.128.64`访问后端，`nginx.conf`文件如下

![20240621231034](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240621231034.png)

## 限流

Nginx 限流有两种方式：按并发连接数限流（ngx_http_limit_conn_module），按请求速率限流（ngx_http_limit_req_module 使用的令牌桶算法）

关于`ngx_http_limit_req_module`模块，里面有很多限流指令，官网资料如下

![20240621231049](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240621231049.png)

下面使用`ngx_http_limit_req_module`模块中的`limit_req_zone`和`limit_req`两个指令来达到限制单个 IP 的**请求速率**的目的

### Nginx限流配置解释

在`nginx.conf`中添加限流配置如下

```nginx
http{
    ...
    # 对请求速率限流
    limit_req_zone $binary_remote_addr zone=myRateLimit:10m rate=5r/s;
    
    server{
        location /interface{
            ...
            limit_req zone=myRateLimit burst=5  nodelay;
            limit_req_status 520;
            limit_req_log_level info;
        }
    }
}


```

![20240621231106](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240621231106.png)

- `$binary_remote_addr`：表示基于 remote_addr（客户端 IP）来做限流
- `zone=myRateLimit:10m`：表示使用 myRateLimit 来作为内存区域（存储访问信息）的名字，大小为 10M，1M 能存储16000 IP 地址的访问信息，也就是说此配置可以存储 16W IP 地址访问信息
- `rate=5r/s`：vu爱事故相同 IP 每秒最多请求 5 次，Nginx 是精确到毫秒的，也就是说此配置代表每 200 毫秒处理一个请求，这意味着从上一个请求处理完之后，若后续 200 毫秒内又有请求到达，则拒绝处理该请求（如果没配置 burst 的话）
- `burst=5`：设置一个大小为 5 的缓冲队列，如果同时有 6 个请求到达，Nginx 会处理第一个请求，剩余 5 个请求放入队列，然后每隔 200 ms 从队列中获取一个请求进行处理，如果请求数大于 6，则拒绝处理多余的请求，直接返回 503
- `nodelay`：针对的是 burst 参数，`burst=5 nodelay`这个配置表示被放入缓冲队列中的这 5 个请求会立即处理，而不是每隔 200ms 取一个。要注意的是，即使这 5 个突发请求里面处理并结束，后续来了请求，也不一定会立马处理，因为请求虽然被处理了但是请求所占的坑位并不会立即释放，而是只能按 200ms 一个来释放，释放一个后才能将等待的请求入队一个
- `limit_req_status=520`：表示被限流后，Nginx 的返回码
- `limit_req_log_level_info`：表示日志级别
> 注意：如果不开启`nodelay`且开启了`burst`这个配置，会严重影响用户体验（假设 burst 队列长度为 100 的话，每 100ms 处理一个，那队列最后那个请求要等 10000ms=10s 后才能被处理，请求会超时，这时 burst 已经意义不大了）所以一般情况下建议 burst 和 nodelay 结合使用，从而尽可能达到速率稳定，但突然流量也能正常处理的效果

### Nginx限流（针对连接数量）

配置如下：

```nginx
http{
    # 针对ip  对请求连接数限流
    ...
    limit_conn_zone $binary_remote_addr zone=myConnLimit:10m; 
    ...
    
    server{
       ...
       limit_conn myConnLimit 12;
    }
}    

```

- `limit_conn_zone $binary_remote_addr zone=myConnLimit:10m`：代表基于连接数量限流，限流的对象是 ip 名称，myConnLimit 存储空间大小为 10MB（即存放某 IP 的访问记录）
- `limit_conn myConnLimit 12`：表示该 IP 最大支持 12 个连接超过则返回 503（被限流后状态码默认是 503，当然也可以像上面根据请求速率限流配置那样，自定义返回码）

## Https配置

### https_ssl模块安装

先使用`nginx -V`查看一下是否安装了`https_ssl`模块

![20240621231125](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240621231125.png)

如果没有的话，要手动进行安装

先进入 Nginx 解压目录，比如`/etc/nginx`

在该目录下执行命令

```shell
./configure --prefix=/etc/nginx --with-http_ssl_module
```

来安装 ssl 模块

然后执行`make`命令，重新编译 Nginx，make 成功后，执行下面命令

```shell
cp ./objs/nginx /etc/nginx/sbin/
```

将编译后的文件覆盖到 sbin 目录，之后执行`nginx -V`命令，就可以看到 ssl 模块安装成功了

### 配置Nginx

解析域名并下载 ssl 证书后，将证书文件上传到 certificate 目录中

然后修改 Nginx 中一个 server 的配置

```nginx
# --------------------HTTPS 配置---------------------
    server {
        #SSL 默认访问端口号为 443
        listen 443 ssl; 
        #填写绑定证书的域名 
        server_name www.hzznb-xzll.xyz hzznb-xzll.xyz; 
        #请填写证书文件的相对路径或绝对路径
        ssl_certificate /usr/local/nginx/certificate/hzznb-xzll.xyz_bundle.crt; 
        #请填写私钥文件的相对路径或绝对路径
        ssl_certificate_key /usr/local/nginx/certificate/hzznb-xzll.xyz.key; 
        #停止通信时，加密会话的有效期，在该时间段内不需要重新交换密钥
        ssl_session_timeout 5m;
        #服务器支持的TLS版本
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3; 
        #请按照以下套件配置，配置加密套件，写法遵循 openssl 标准。
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE; 
        #开启由服务器决定采用的密码套件
        ssl_prefer_server_ciphers on;
    }    

```

配置上游服务以及路由规则

![20240621231147](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240621231147.png)

### Http跳转Https

```nginx
server_name www.hzznb-xzll.xyz hzznb-xzll.xyz;
# 重定向到目标地址
return 301 https://$server_name$request_uri;

```

## 压缩

压缩功能在处理一些大文件时比较实用，gzip 是规定的三种标准 HTTP 压缩格式之一，目前绝大多数网站都在使用 gzip 传输 HTML、CSS、JavaScript 等资源文件。通过 Nginx 配置来让服务端支持 gzip，服务端返回压缩文件后浏览器进行解压缩从而展示正常内容

```nginx
http {
    # 开启/关闭 压缩机制
    gzip on;
    # 根据文件类型选择 是否开启压缩机制
    gzip_types text/plain application/javascript text/css application/xml text/javascript image/jpeg image/jpg image/gif image/png  application/json;
    # 设置压缩级别，一共9个级别  1-9   ，越高资源消耗越大 越耗时，但压缩效果越好，
    gzip_comp_level 9;
    # 设置是否携带Vary:Accept-Encoding 的响应头
    gzip_vary on;
    # 处理压缩请求的 缓冲区数量和大小
    gzip_buffers 32 64k;
    # 对于不支持压缩功能的客户端请求 不开启压缩机制
    gzip_disable "MSIE [1-6]\."; # 比如低版本的IE浏览器不支持压缩
    # 设置压缩功能所支持的HTTP最低版本
    gzip_http_version 1.1;
    # 设置触发压缩的最小阈值
    gzip_min_length 2k;
    # off/any/expired/no-cache/no-store/private/no_last_modified/no_etag/auth 根据不同配置对后端服务器的响应结果进行压缩
    gzip_proxied any;
} 

```

> 注意：虽然压缩后体积变小了，但是响应的时间会变长，因为解压缩也需要时间，有些**用时间换空间**的感觉

压缩级别是可以调整的，可以选择较低级别的，这样既能实现压缩功能使得数据包体积降下来，同时压缩时间也会缩短，这是比较折中的一种方法

## 常用指令与说明

### rewrite

rewrite 指令通过正则表达式来改变 URI，可以同时存在一个或多个指令

需要按照顺序依次对 URL 进行匹配和处理，常用于重定向功能

语法如下：

![20240621231209](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240621231209.png)

其中 flag 有如下几个值：

- `last`：本条规则匹配完成后，继续向下匹配新的 location URI 规则
- `break`：本条规则匹配完成就终止，不会再匹配后面的规则
- `redirect`：返回 302 临时重定向，浏览器地址会显示跳转新的 URL 地址
- `permanent`：返回 301 永久重定向，浏览器地址会显示跳转新的 URL 地址

conf 文件

```nginx
  server {
      listen 80 default;
      charset utf-8;
      server_name www.hzznb-xzll.xyz hzznb-xzll.xyz;

      # 临时（redirect）重定向配置
      location /temp_redir {
          rewrite ^/(.*) https://www.baidu.com redirect;
      }
      # 永久重定向（permanent）配置
      location /forever_redir {

          rewrite ^/(.*) https://www.baidu.com permanent;
      }

      # rewrite last配置
      location /1 {
        rewrite /1/(.*) /2/$1 last;
      }
      location /2 {
        rewrite /2/(.*) /3/$1 last;
      }
      location /3 {
        alias  '/usr/local/nginx/test/static/';
        index location_last_test.html;
      }
    }

```

- last 配置：访问`hzznb-xzll.xyz/1/`的请求被替换为`hzznb-xzll.xyz/2/`之后再被替换为`hzznb-xzll.xyz/3/`最后找到`/usr/local/nginx/test/static/location_last_test.html`这个文件并返回
- redirect 配置：当访问`hzznb-xzll.xyz/temp_redir/`这个请求会临时（302）重定向到百度页面
- permanent 配置：当访问`hzznb-xzll.xyz/forever_red…`这个请求会永久（301）重定向到百度页面

### if

该指令用于条件判断，并根据条件判断结果来选择不同的配置，作用于`server/location`块

可以使用 Nginx 的全局变量

```nginx
# 指定 username 参数中只要有字母 就不走nginx缓存
if ($arg_username ~ [a-z]) {
   set $cache_name "no cache";
}

```

### Nginx全局变量

![20240621231340](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240621231340.png)

![20240621231351](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240621231351.png)

![20240621231400](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240621231400.png)

### auto_index

一般用于快速搭建静态资源网站，比如在 book 文件夹中放几本书

![20240621231409](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240621231409.png)

然后配置 Nginx

```nginx
location /book/ {
    root /usr/local/nginx/test;
    autoindex on; # 打开 autoindex，，可选参数有 on | off
    autoindex_format html; # 以html的方式进行格式化，可选参数有 html | json | xml
    autoindex_exact_size on; # 修改为off，会以KB、MB、GB显示文件大小，默认为on以bytes显示出⽂件的确切⼤⼩
    autoindex_localtime off; # 显示⽂件时间 GMT格式
}
```

> 注意：访问的时候不能丢了`/`否则会报 404

### root&alias

root 和 alias 都是用于指定静态资源目录的，但两者还是有区别的

#### root

![20240621231423](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240621231423.png)

为请求设置跟目录时，配置如下：

```nginx
location /static/ {
    root /usr/local/nginx/test;
}
```

当请求 www.xxx.xyz/static/image.jpg 时，/user/local/nginx/test/static/image.jpg 文件会作为响应内容返回给客户端，也就是说：

**root 指令会将 /static/ 拼接到 /usr/local/nginx/test 后面**

#### alias

这个跟 root 最大的区别就是**不会进行拼接**，例如

```nginx
location /static { # 注意一般 alias的 url都不带后边的/
     alias /usr/local/nginx/test/; # 使用alias时  这里的目录最后边一定要加/ 否则就404
}
```

当请求 www.xxx.xyz/static/image.jpg 时，Nginx 会去 alias 配置的路径：/usr/local/nginx/test/ 目录下找image.jpg 文件然后返回

### proxy_pass中的斜线

proxy_pass 的斜线跟 root 和 alias 类似

之前的负载均衡和动静分类，配置都是像下面这样

```nginx
proxy_pass http://mybackendserver/
```

这个`/`，如果不写，则会将 location 的 url 拼接到路径后面，如果写了则不会，下面为示例：

![20240621231446](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240621231446.png)

interface 这个location不会拼接

![20240621231454](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240621231454.png)

interface2 这个location **会拼接**

![20240621231501](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240621231501.png)

### upstream中常用指令

![20240621231508](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240621231508.png)

## 重试策略

### 服务不可用重试

重试是发生错误时不可缺少的一种手段，当某一个或者某几个服务宕机时，如果有正常服务，那么将请求重试到正常服务的机器上去

```nginx
upstream mybackendserver {
    # 60秒内 如果请求8081端口这个应用失败
    # 3次，则认为该应用宕机 时间到后再有请求进来继续尝试连接宕机应用且仅尝试 1 次，如果还是失败，
    # 则继续等待 60 秒...以此循环，直到恢复
    server 172.30.128.64:8081 fail_timeout=60s max_fails=3; 
    
    server 172.30.128.64:8082;
    server 172.30.128.64:8083;
}
```

### 错误重试

错误重试就是可以配置哪些状态下才会执行重试，例如下面的配置：

```nginx
# 指定哪些错误状态才执行 重试 比如下边的 error 超时，500,502,503 504
proxy_next_upstream error timeout http_500 http_502 http_503 http_504;
```

### backup

Nginx 支持设置备用节点，当所有线上节点都异常时才会启用备用节点，同时备用节点也会影响到失败重试的逻辑

backup 有如下特征：

1. 正常情况下，请求不会转到 backup 服务器，包括失败重试的场景
2. 当所有正常节点全部不可用时，backup 服务器生效，开始处理请求
3. 一旦有正常节点恢复，就使用已经恢复的正常节点
4. backup 服务器生效期间，不会存在所有正常节点一次性恢复的逻辑
5. 如果全部的 backup 服务器也异常，则会将所有节点一次性恢复，加入存活列表
6. 如果全部节点（包括 backup）都异常了，则 Nginx 返回 502 错误

```nginx
upstream mybackendserver {
    server 172.30.128.64:8081 fail_timeout=60s max_fails=3; # 60秒内 如果请求某一个应用失败3次，则认为该应用宕机 时间到后再有请求进来继续尝试连接宕机应用且仅尝试 1 次，如果还是失败，则继续等待 60 秒...以此循环，直到恢复
    server 172.30.128.64:8082;
    server 172.30.128.64:8083 backup; # 设置8083位备机
}
```
