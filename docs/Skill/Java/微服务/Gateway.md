---
id: gateway
slug: /gateway
title: Gateway
date: 2024-07-05
tags: [gateway, 网关]
keywords: [gateway, 网关]
---

## 功能

- 身份认证和权限校验
- 服务路由、负载均衡
- 请求限流

## 搭建网关服务

1、创建新的 Module，引入 Spring Cloud Gateway 的依赖和 Nacos 的服务发现依赖

```xml
<!--nacos服务注册发现依赖-->
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
<!--网关gateway依赖-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-gateway</artifactId>
</dependency>
```

2、编写路由配置及 Nacos 地址

```yaml
spring:
  application:
    name: gateway # 服务名称
  cloud:
    nacos:
      server-addr: nacos:8848 # nacos地址
    gateway:
      routes: # 路由网关配置
        - id: user-service # 路由标示，必须唯一
          # uri: http://127.0.0.1:8081 # 路由的目标地址 http就是固定地址
          uri: lb://userservice # 路由的目标地址 lb就是负载均衡，后面跟服务名称
          predicates: # 路由断言，判断请求是否符合规则
            - Path=/user/** # 路径断言，判断路径是否是以/user开头，如果是则符合
```

## 路由断言工厂

Route Predicate Factory

路由网关可以配置的内容包括：

- 路由 id：路由唯一标识
- uri：路由目的地，支持 lb 和 http 两种
- predicate：路由断言，判断请求是否符合要求，符合则转发到路由目的地
- filters：路由过滤器，处理请求或响应

在配置文件中写的断言规则只是字符串，这下字符串会被 Predicate Factory 读取并处理，转变为路由判断的条件

例如 Path=/user/** 是按照路径匹配，这个规则是由`org.springrframework.cloud.gateway.handler.predicate.PathRoutePredicateFactory`类来处理的

这样的断言工厂在 SpringCloudGateway 还有十几个

Spring 提供的11种基本的 Predicate 工厂：

![20240705224944](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240705224944.png)

## 路由过滤器

GatewayFilter 是网关中提供的一种过滤器，可以对进入网关的请求和微服务返回的响应做处理：

![20240705224953](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240705224953.png)

Spring 提供了31种不同的路由过滤器工厂

![20240705225000](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240705225000.png)

例如：给进入 userservice 的请求添加一个请求头

![20240705225009](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240705225009.png)

### 默认过滤器

如果要对所有的路由生效，则可以将过滤器工厂写到 default 下。格式如下：

```yaml
spring:
  application:
    name: gateway
  cloud:
    nacos:
      server-addr: nacos:8848 # nacos地址
    gateway:
      routes:
        - id: user-service # 路由标示，必须唯一
          uri: lb://userservice # 路由的目标地址
          predicates: # 路由断言，判断请求是否符合规则
            - Path=/user/** # 路径断言，判断路径是否是以/user开头，如果是则符合
        - id: order-service
          uri: lb://orderservice
          predicates:
            - Path=/order/**
      default-filters:
        - AddRequestHeader=Truth,Itcast is freaking awesome!
```

## 全局过滤器

全局过滤器与 GatewayFilter 作用一样

区别在于 GatewayFilter 通过配置定义，处理逻辑是固定的，而 GlobalFilter 的逻辑需要自己写代码实现

定义方式是实现 GlobalFilter 接口

```java
public interface GlobalFilter {
    /**
    * exchange 请求上下文，里面可以获取 Request、Response 等信息
    * chain 用来把请求委托给下一个过滤器
    */
    Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain);
}
```

例子：定义全局过滤器，拦截并判断用户身份

```java
@Component
public class AuthorizeFilter implements GlobalFilter, Ordered {
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        // 1.获取请求参数
        ServerHttpRequest request = exchange.getRequest();
        MultiValueMap<String, String> params = request.getQueryParams();
        // 2.获取参数中的 authorization 参数
        String auth = params.getFirst("authorization");
        // 3.判断参数值是否等于 admin
        if ("admin".equals(auth)) {
            // 4.是，放行
            return chain.filter(exchange);
        }
        // 5.否，拦截
        // 5.1.设置状态码
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        // 5.2.拦截请求
        return exchange.getResponse().setComplete();
    }

    @Override
    public int getOrder() {
        return -1;
    }
}
```

定义过滤器顺序：

1. 在类上添加 @Order 注解，里面的参数越小，优先级越高
2. 实现 Ordered 接口，重写 getOrder 方法

## 过滤器执行顺序

![20240705225032](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240705225032.png)

![20240705225043](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240705225043.png)

## 跨域配置
使用 CORS 解决，通过配置实现

![20240705225050](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240705225050.png)


