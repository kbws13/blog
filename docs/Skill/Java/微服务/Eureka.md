---
id: eureka
slug: /eureka
title: Eureka
date: 2024-06-04
tags: [注册中心, 服务注册, 服务发现, 负载均衡]
keywords: [注册中心, 服务注册, 服务发现, 负载均衡]
---

## 服务调用出现的问题

- 服务消费者该如何获取服务提供者的地址信息
- 如果有多个服务提供者，消费者该选择谁
- 消费者如何得知服务提供者的健康状态

## Eureka的作用

![20240604224337](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240604224337.png)

## 搭建Eureka注册中心

1、创建项目，导入 Eureka 依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
</dependency>
```

2、编写启动类，添加 @EnableEurekaServer 注解

```java
@EnableEurekaServer
@SpringBootApplication
public class EurekaApplication {
    public static void main(String[] args) {
        SpringApplication.run(EurekaApplication.class, args);
    }
}
```

3、添加 application.yml 配置文件，编写配置

```yaml
server:
  port: 10086 # 服务端口
spring:
  application:
    name: eurekaserver # eureka的服务名称
eureka:
  client:
    service-url:  # eureka的地址信息
      defaultZone: http://127.0.0.1:10086/eureka
```

## 服务注册

将服务注册到 Eureka 注册中心

1、引入依赖

```xml
<!--eureka客户端依赖-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
```

2、编写配置文件

```yaml
server:
  port: 8081
spring:
	application: 
  	name: userservice
eureka:
 client:
   service-url:  # eureka的地址信息
     defaultZone: http://127.0.0.1:10086/eureka
```

## 服务发现

服务拉取是基于服务名称获取服务列表，然后在服务列表做负载均衡

1、修改 Service 中的代码，修改访问的 Url 路径，用服务名代替 IP、端口：

```java
String url = "http://userservice/user/" + order.getUserId();
```

2、在微服务的启动类 OrderApplication 中的 RestTemplate 添加负载均衡注解

```java
/**
 * 创建RestTemplate并注入Spring容器
 */
@Bean
@LoadBalanced
public RestTemplate restTemplate() {
    return new RestTemplate();
}
```

## Ribbon负载均衡

### 负载均衡流程

![20240604224418](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240604224418.png)

### Ribbon工作流程

![20240604224426](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240604224426.png)

### 负载均衡策略

Ribbon 的负载均衡规则是一个叫做 IRule 的接口来定义的，每一个子接口都是一种规则：

![20240604224439](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240604224439.png)

![20240604224446](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240604224446.png)

通过定义 IRule 实现可以修改负载均衡规则，有两种方式：

1、代码方式：在项目中的启动类中，定义一个新的 IRule

```java
@Bean
public IRule randomRule() {
    return new RandomRule();
}
```

2、配置文件方式：在项目的 application.yml 配置文件中，添加新的配置也可以修改规则：

```yaml
userservice: # 项目名
  ribbon:
    NFLoadBalancerRuleClassName: com.alibaba.cloud.nacos.ribbon.NacosRule  # 负载均衡规则
```

### 饥饿加载

Ribbon 默认是采用懒加载，即第一次访问时才会去创建 LoadbanlanceClient，请求时间会很长。而饥饿加载则会在项目启动时创建，降低第一次访问的耗时，通过下面的配置开启饥饿加载：

```yaml
ribbon:
  eager-load:
    enabled: true # 开启饥饿加载
    clients: # 指定饥饿加载的服务名称
      - userservice
```

