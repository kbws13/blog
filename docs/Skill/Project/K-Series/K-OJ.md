---
id: k-oj
slug: /k-oj
title: K-OJ
keywords:
  - oj
  - Online Judge
  - 项目
  - Java
---
## 项目介绍
K-OJ 在线判题系统

该项目是一个基于 Spring Cloud 微服务 + MQ + Docker 的编程题目测评系统。该系统可以根据题目用例对用户提交的代码进行执行和测评。此外，该系统还提供了一个独立的**自主实现的代码沙箱**，供其他开发者调用。
### 项目内容

- 设计了判题机模块的架构，通过采用**静态工厂模式 + Spring 配置化**的方式，实现了对多种代码沙箱的灵活调用
- 采用**代理模式**对代码沙箱接口进行增强，统一实现了对代码沙箱调用前后的日志记录，减少了重复代码
- 使用 Docker 代码沙箱，实现了环境隔离、内存限制、网络隔离，并设置超时时间来及时释放资源
- 使用 Redisson 实现用户提交题目限流，限制单个用户的提交频率
- 引入 RabbitMQ 实现消息异步消费，并添加死信队列，避免重复消费
- 通过使用Java安全管理器和自定义的**安全管理器**，对用户提交的代码进行权限控制。进一步提升代码沙箱的安全性
- 使用 SSE 实现判题状态实时通知
## 技术栈
### 环境

- Java 8
- Node 18.16
- MySQL 8
- Redis 6
- RabbitMQ 3.12.8
- Nacos 2.2.0
### 后端

- Spring Cloud Alibaba 微服务
- Nacos 注册中心
- OpenFeign 客户端调用
- Redission 限流
- GateWay 网关
- Docker 代码沙箱
- RabbitMQ 消息队列
- Knife4j 聚合文档
- Process 进程管理
- SecurityManager 安全管理器
- 设计模式
   - 策略模式
   - 工厂模式
   - 代理模式
   - 模板方法模式
- JVM 相关知识
### 前端

- Vue 3
- TypeScript
- Vue-Cli 脚手架
- Vuex 状态管理库
- Acro Design 组件库
- MarkDown 富文本编辑器
- Monaco Editor 代码编辑器
- OpenAPI 前端代码生成
## 核心业务流程
![20240307125916](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240307125916.png)

![20240307125926](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240307125926.png)

判题服务：获取题目信息、输入输出用例，返回给题目服务：用户提交的代码是否正确

代码沙箱：只负责运行代码，返回运行结果，判断结果是否正确是判题服务要做的事
## 功能

1. 题目模块
   1. 创建题目
   2. 删除题目
   3. 修改题目
   4. 搜索题目
   5. 在线做题
   6. 提交代码
2. 用户模块
   1. 注册
   2. 登录
   3. 修改个人信息
   4. 管理用户
3. 判题模块
   1. 提交判题
   2. 错误处理
   3. **自主实现** 代码沙箱
   4. 开放接口
4. 文件模块
   1. 负责上传文件（用户头像）
## 模块划分

![20240307125957](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240307125957.png)

依赖服务：

- 注册中心：Nacos
- 微服务网关（oj-backend-gateway）：Gateway 聚合所有的接口，统一接收处理前端的请求

公共模块：

- common 公共模块（oj-backend-common）：全局异常处理器、请求响应工具类、工具类等
- model 模块（oj-backend-model）：所有服务公共的实体类
- 公用接口模块（oj-backend-service-client）：只存放接口，不存放实现类（多个服务之间共享）

业务功能：

- 用户服务（oj-backend-user-serivce：8102）
   - 注册
   - 登录
   - 修改个人信息
   - 用户管理
- 题目服务（oj-backend-question-service：8103）
   - 创建题目
   - 删除题目
   - 修改题目
   - 搜索题目
   - 在线做题
   - 提交代码
   - 用户提交限流
- 判题服务（oj-backend-judge-service：8104）
   - 执行判题
   - 错误处理
   - **自主实现**代码沙箱
   - 开放接口
- 文件服务（oj-backend-file-service：8108）
   - 将文件上传到 COS
> 代码沙箱是独立的服务，不需要纳入 Spring Cloud 管理中

