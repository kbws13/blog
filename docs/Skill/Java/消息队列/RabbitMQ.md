---
id: rabbitmq
slug: /rabbitmq
title: RabbitMQ
date: 2024-05-19
tags: [RabbitMQ, 消息队列, 发布订阅模型]
keywords: [RabbitMQ, 消息队列, 发布订阅模型]
---

## 安装

RabbitMQ 是基于 Erlang 语言开发的开源消息通信中间件

在安装 RabbitMQ 之前，要先安装 Erlang 语言，因为 RabbitMQ 依赖于它，这门语言是专门为高并发设计的

Erlang 下载：[Otp 25.3.2 - Erlang/OTP](https://www.erlang.org/patches/otp-25.3.2)

![20240519231020](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240519231020.png)

安装完成后，开始安装 RabbitMQ

Windows 安装：[Installing on Windows — RabbitMQ](https://www.rabbitmq.com/install-windows.html)

![20240519231033](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240519231033.png)

win + r 输入 services.msc 后回车，打开服务菜单，查看 RabbitMQ 服务是否已启动：

![20240519231043](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240519231043.png)

安装 RabbitMQ 监控面板：

在 RabbitMQ 安装目录的 sbin 目录中打开 cmd 框，执行以下脚本

```shell
rabbitmq-plugins.bat enable rabbitmq_management
```

输入以下信息：

![20240519231055](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240519231055.png)

访问：[http://localhost:15672](http://localhost:15672/#/)，用户名密码都是 guest：

![20240519231104](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240519231104.png)

如果想要在远程服务器安装访问 rabbitmq 管理面板，你要自己创建一个管理员账号，不能用默认的 guest，否则会被拦截（官方出于安全考虑）

如果被拦截，可以自己创建管理员用户：

参考文档的 Adding a User：[https://www.rabbitmq.com/access-control.html](https://www.rabbitmq.com/access-control.html)

rabbitmq 端口占用：

5672：程序连接的端口

15672：webUI

**RabbitMQ的结构和概念**

![20240519231122](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240519231122.png)

**RabbitMQ中的概念**

- channel：操作 MQ 的工具
- exchange：路由消息到队列中
- queue：缓存消息
- virtual host：虚拟主机，是对 queue、exchange 等资源的逻辑分组

## 常见消息模型

![20240519231133](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240519231133.png)

## SpringAMQP

引入依赖

注意：使用的版本一定要和 Springboot 版本一致！

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-amqp</artifactId>
    <version>2.7.2</version>
</dependency>
```

### 消息发送

创建生产者模块 publisher

创建配置文件

```yaml
spring:
  rabbitmq:
    host: 127.0.0.1
    port: 5672
    virtual-host: /
    username: guest
    password: guest
```

编写发送信息代码

```java
@RunWith(SpringRunner.class)
@SpringBootTest
public class SpringAmqpTest {
    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Test
    public void testSimpleQueue() {
        String queueName = "simple.queue";
        String message = "Hello,World";
        rabbitTemplate.convertAndSend(queueName,message);

        System.out.println("发送成功");
    }
}
```

运行成功后，会创建队列，并且队列中有刚刚发送的消息

![20240519231156](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240519231156.png)

### 消息接受

创建监听类

```java
package xyz.kbws.listener;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

/**
 * @author kbws
 * @date 2024/1/31
 * @description:
 */
@Component
public class SpringRabbitListener {

    @RabbitListener(queues = "simple.queue")
    public void listenSimpleQueue(String msg) {
        System.out.println("消费者收到消息：【"+msg+"】");
    }
}

```

启动后，消费端会在拿到消息队列中的消息

![20240519231210](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240519231210.png)

### WorkQueue模型

工作队列

![20240519231219](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240519231219.png)

一个队列绑定多个消费者

![20240519231226](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240519231226.png)

#### 消息预取限制

修改配置文件，设置 preFetch 这个值，可以控制预取消息的上限

![20240519231236](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240519231236.png)

### 发布订阅模型

发布订阅模式是允许将同一消息发送给多个消费者。实现方式是加入了 exchange（交换机）

![20240519231247](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240519231247.png)

常见的 exchange 类型包括：

- Fanout：广播
- Direct：路由
- Topic：话题

注意：exchange 负载消息路由，而不是存储，路由失败则消息丢失

#### Fanout Exchange

Fanout Exchange 会将接受到的消息路由到每一个跟其绑定的 queue

1、在 consumer 服务中，利用代码声明队列、交换机，并将两者绑定

在一个类上添加`@Configuration`注解，并声明 FanoutExchange、Queue 和绑定关系对象 Binding，代码如下：

```java
package xyz.kbws.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.FanoutExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @author kbws
 * @date 2024/1/31
 * @description:
 */
@Configuration
public class FanoutConfig {
    // fanout
    @Bean
    public FanoutExchange fanoutExchange() {
        return new FanoutExchange("fanout");
    }

    // fanout.queue1
    @Bean
    public Queue fanoutQueue1() {
        return new Queue("fanout.queue1");
    }

    // 绑定队列1到交换机
    @Bean
    public Binding fanoutBinding1(Queue fanoutQueue1, FanoutExchange fanoutExchange) {
        return BindingBuilder
                .bind(fanoutQueue1)
                .to(fanoutExchange);
    }

    // fanout.queue2
    @Bean
    public Queue fanoutQueue2() {
        return new Queue("fanout.queue2");
    }

    // 绑定队列2到交换机
    @Bean
    public Binding fanoutBinding2(Queue fanoutQueue2, FanoutExchange fanoutExchange) {
        return BindingBuilder
                .bind(fanoutQueue2)
                .to(fanoutExchange);
    }
}

```

2、在 consumer 服务中，编写两个消费者方法，分别监听 fanout.queue1 和 fanout.queue2

```java
@RabbitListener(queues = "fanout.queue1")
public void listenFanoutQueue1(String msg) {
    System.out.println("消费者收到fanout.queue1的消息：【"+msg+"】");
}

@RabbitListener(queues = "fanout.queue2")
public void listenFanoutQueue2(String msg) {
    System.out.println("消费者收到fanout.queue2的消息：【"+msg+"】");
}
```

3、在 publisher 中编写测试方法，向 fanout 发送消息

```java
@Test
public void testSendFanoutExchange() {
    // 交换机名称
    String exchangeName = "fanout";
    // 消息
    String message = "Hello, Everyone";
    // 发送消息 参数为：交换机名称，RoutingKey（暂时为空），消息
    rabbitTemplate.convertAndSend(exchangeName,"",message);
}
```

#### Direct Exchange

Direct Exchange 会将接收到的消息根据规则路由发送到指定的 Queue，因此称为路由模式

![20240519231312](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240519231312.png)

- 每个 Queue 都与 Exchange 设置一个 BindingKey
- 发布者发送消息时，指定消息的 RoutingKey
- Exchange 将消息路由到 BindingKey 与消息 RoutingKey 一致的队列

1、使用`@RabbitListener`声明 Exchange、Queue、RoutingKey

```java
@RabbitListener(bindings = @QueueBinding(
        value = @Queue(name = "direct.queue1"),
        exchange = @Exchange(name = "direct", type = ExchangeTypes.DIRECT),
        key = {"red", "blue"}
))
public void listenDirectQueue1(String msg) {
    System.out.println("消费者收到direct.queue1的消息：【"+msg+"】");
}

@RabbitListener(bindings = @QueueBinding(
        value = @Queue(name = "direct.queue2"),
        exchange = @Exchange(name = "direct", type = ExchangeTypes.DIRECT),
        key = {"red", "yellow"}
))
public void listenDirectQueue2(String msg) {
    System.out.println("消费者收到direct.queue2的消息：【"+msg+"】");
}
```


2、在 publisher 中编写测试方法，向 direct 发送消息

```java
@Test
public void testSendDirectExchange() {
    // 交换机名称
    String exchangeName = "direct";
    // 消息
    String message = "Hello, blue";
    // 发送消息 参数为：交换机名称，RoutingKey，消息
    rabbitTemplate.convertAndSend(exchangeName,"blue",message);
}
```

#### Topic Exchange

与 Direct Exchange 类似，区别在于 RoutingKey 必须是多个单词的列表，并且以`.`分割

![20240519231328](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240519231328.png)

1、注册监听代码

```java
@RabbitListener(bindings = @QueueBinding(
        value = @Queue(name = "topic.queue1"),
        exchange = @Exchange(name = "topic", type = ExchangeTypes.TOPIC),
        key = "china.#"
))
public void listenTopicQueue1(String msg) {
    System.out.println("消费者收到topic.queue1的消息：【"+msg+"】");
}

@RabbitListener(bindings = @QueueBinding(
        value = @Queue(name = "topic.queue2"),
        exchange = @Exchange(name = "topic", type = ExchangeTypes.TOPIC),
        key = "china.#"
))
public void listenTopicQueue2(String msg) {
    System.out.println("消费者收到topic.queue2的消息：【"+msg+"】");
}
```

2、编写测试代码

```java
@Test
public void testSendTopicExchange() {
    // 交换机名称
    String exchangeName = "topic";
    // 消息
    String message = "Test,Topic";
    // 发送消息
    rabbitTemplate.convertAndSend(exchangeName,"china.news",message);
}
```

### 消息转换器

在 SpringAMQP 的发送方法中，接受消息的类型是 Object 类型，也就是可以发送任意的对象类型的消息，SpringAMQP 会自动将其序列化成字节后发送

Spring 的对消息对象的处理是由`org.springframework.amqp.support.converter.MessageConverter`来处理的，而默认实现是 SimpleMessageConverter，基于 JDK 的 ObjectOutputStream 完成序列化

如果要修改，只需要定义一个 MessageConverter 类型的 Bean 即可。推荐使用 JSON 的方式

1、在 publisher 服务引入依赖：

```xml
<dependency>
    <groupId>com.fasterxml.jackson.dataformat</groupId>
    <artifactId>jackson-dataformat-xml</artifactId>
    <version>2.9.10</version>
</dependency>
```

2、在 publisher 服务声明 MessageConverter：

```java
@Bean
public MessageConverter messageConverter() {
    return new Jackson2JsonMessageConverter();
}
```

3、定义一个消费者，监听消息并消费消息

```java
@RabbitListener(queue = "object.queue")
public void listenObjectQueue1(Map<String, Object> msg) {
    System.out.println("消费者收到object.queue的消息：【"+msg+"】");
}
```

