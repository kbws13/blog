---
id: io-and-multiplexing
slug: /io-and-multiplexing
title: I/O和多路复用
date: 2024-03-20
tags: [BIO, NIO, AIO, 多路复用]
keywords: [BIO, NIO, AIO, 多路复用]
image: https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240320221135.png
---
## I/O方式

![20240320221135](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240320221135.png)

### 同步阻塞I/O（BIO）

**定义与特点**

在 BIO 模型中，当一个线程执行 I/O 操作，如读写数据时，该线程会被阻塞，直到 I/O 操作完成。这意味着在 I/O 操作期间，该线程不能执行其他任务

**实现**

主要通过`java.io`包实现，如使用`FileInputStream`和`FileOutputStream`进行文件操作，或者使用`Socket`进行网络操作，都是采用同步阻塞的方式

### 同步非阻塞（NIO）

**定义与特点**

NIO 允许一个线程从多个通道（Channel）读写数据，通过使用选择器（Selector）实现多路复用。这种方式下，线程可以在等待某个通道准备好进行 I/O 操作时，同时检查其他通道的就绪状态，而不是阻塞在单个 I/O 操作上。

**实现**

通过`java.nio`包实现，核心概念包括：通道（Channel）、缓冲区（Buffer）、选择器（Selector）等。Selector 可以监控多个通道的 I/O 状态（如读、写就绪），实现同步非阻塞 I/O 

**多路复用实现**

通过 Selector，一个单独的线程可以管理多个通道，当通道准备好进行 I/O 操作时，Selector 能够检测到并允许线程处理这些事件。应用程序通过注册到 Selector 并指定感兴趣的事件（如读、写），Selector 轮询注册的通道，当通道就绪时，线程就可以处理这些事件，实现高效的多路复用

### 异步非阻塞（AIO）

**定义与特点**

AIO 引入了真正的异步非阻塞 I/O 操作，应用程序可以直接返回，不需要等待 I/O 操作完成，直接返回。I/O 操作完成后，系统会自动通知应用程序，应用程序再进行相应的处理

**处理**

通过`java.nio.channels`包下的异步通道（如`AsynchronousFileChannel`、`AsynchronousSocketChannel`）实现。AIO 提供了基于事件和回调机制的 I/O 操作，极大提高了程序的性能和响应速度

## NIO如何实现多路复用

**创建一个 Selector 实例**

Selector 是一个多路复用器，可以监控多个通道的 I/O 事件（如连接请求、数据到达等）

```java
Selector selector = Selector.open();
```

**配置非阻塞模式**

```java
channel.configureBlocking(false);
```

**注册通道到 Selector**

```java
int readyChannels = selector.select();
```

**处理就绪的事件**

```java
Set<SelectionKey> selectedKeys = selector.selectedKeys();
Iterator<SelectionKey> keyIterator = selectedKeys.iterator();
while(keyIterator.hasNext()) {
    SelectionKey key = keyIterator.next();
    if(key.isAccecptable()) {
        // 处理接受事件
    }else if(key.isReadable()) {
        // 处理读事件
    }
    keyIterator.remove();
}
```



