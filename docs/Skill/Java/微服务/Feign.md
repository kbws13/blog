---
id: feign
slug: /feign
title: Feign
date: 2024-06-16
tags: [Feign, 远程调用]
keywords: [Feign, 远程调用]
---

## 介绍

Feign 是一个声明式的 HTTP 客户端，其作用是帮助我们优雅的实现 HTTP 请求的发送

## 定义和使用Feign客户端

1、引入依赖

```xml
<!--feign客户端依赖-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```

2、在启动类上添加注解，开启 Feign 功能

```java
@SpringBootApplication
@EnableFeignClients
public class OrderApplication {
    public static void main(String[] args) {
        SpringApplication.run(OrderApplication.class, args);
    }
}
```

3、编写 Feign 客户端

```java
@FeignClient(value = "userservice")
public interface UserClient {

    @GetMapping("/user/{id}")
    User findById(@PathVariable("id") Long id);
}
```

主要是基于 Spring MVC 的注解来声明远程调用的信息，例如

- 服务名称：userservice
- 请求方式：GET
- 请求路径：/user/{id}
- 请求参数：Long id
- 返回值类型：User

## 自定义配置

Feign 运行自定义配置来覆盖默认配置，可以修改的配置如下：

![20240616190319](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240616190319.png)

一般我们需要配置的是日志级别

配置 Feign 的日志有两种方式：

方式一：配置文件

① 全局生效：

```yaml
feign:
	client:
  	config:
    	default: # 这里使用 default 就是全局配置，如果是写服务名称，则是针对某个服务的配置
      	loggerLevel: FULL # 日志级别
```

② 局部生效：

```yaml
feign:
	client:
  	config:
    	userservice: # 这里使用 default 就是全局配置，如果是写服务名称，则是针对某个服务的配置
      	loggerLevel: FULL # 日志级别
```

方式二：Java 代码方式，需要先声明一个 Bean

```java
public class FeignClientConfiguration {
    @Bean
    public Logger.Level logLevel(){
        return Logger.Level.BASIC;
    }
}
```

① 如果要全局配置，就把它放在 @EnableFeignClients 这个注解中：

```java
@EnableFeignClients(defaultConfiguration = FeignClientConfiguration.class)
```

② 如果是局部配置，则把它放在 @FeignClient 这个注解中：

```java
@FeignClient(value = "userservice", configuration = FeignClientConfiguration.class)
```

## 性能优化

Feign 底层的客户端实现：

- URLConnection：默认实现，不支持连接池
- Apache HttpClient：支持连接池
- OKHttp：支持连接池

因此，优化 Feign 的性能主要包括：

1. 使用连接池代理默认的 URLConnection
2. 日志级别，最好用 Basic 或 none

Feign 添加对 HttpClient 的支持：

引入依赖：

```xml
<!--引入HttpClient依赖-->
<dependency>
    <groupId>io.github.openfeign</groupId>
    <artifactId>feign-httpclient</artifactId>
</dependency>
```

配置连接池：

```yaml
feign:
	client:
  	config:
    	default:
      	loggerLevel: BASIC
  httpclient:
    enabled: true # 支持HttpClient的开关
    max-connections: 200 # 最大连接数
    max-connections-per-route: 50 # 单个路径的最大连接数
```

## Feign的最佳实践

方式一（继承）：给消费者的 FeignClient 和提供者的 Controller 定义统一的父接口作为标准

![20240616190401](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240616190401.png)

> 不推荐使用这种方式，这会导致紧耦合，父接口参数列表中的映射不会被继承

方式二（抽取）：将 FeignClient 抽取作为独立的模块，并且把接口有关的 POJO、默认的 Feign 配置都放在这个模块中，提供给所有消费者使用

![20240616190408](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240616190408.png)

1. 创建一个 Module，命名为 feign-api，然后引入 Fiegn 的 starter 依赖
2. 将编写好的 UserClient、User、DefaultFeignConfiguration 都复制到 feign-api 项目中
3. 在原来的项目引入 feign-api 的依赖
4. 修改 import 部分
5. 重启测试

当定义的 Feign Client 不在 SpringBootApplication 的扫描包范围时，这下 FeignClient 无法使用。有两种方法解决：

方法一：指定 FeignClient 所在的包

```java
@EnableFeignClients(basePackages = "xyz.kbws.clients")
```

方式二：指定 FeignClient 的字节码

```java
@EnableFeignClients(clients = {UserClient.class})
```

