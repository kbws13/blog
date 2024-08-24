---
id: keep-alive
slug: /keep-alive
title: TCP和keepalive和HTTP的Keep-Alive
date: 2024-08-24
tags: [HTTP, TCP, KeepAlive]
keywords: [HTTP, TCP, KeepAlive]
---

## HTTP的Keep-Alive

是由应用层实现的，称为 HTTP 长连接

HTTP 是请求应答模式，建立 TCP 连接后发生请求，服务器返回响应，然后断开连接

如果每次请求都要建立连接、断开连接，这样就成了**HTTP 短连接**

Keep-Alive 的作用就是，在第一个 HTTP 请求完成后，不断开 TCP 连接，使用一个 TCP 连接来发送和接受多个 HTTP 请求/响应，避免了连接建立和释放的开销，称为**HTTP 长连接**

在 HTTP1.0 中是默认关闭的，想要开启，需要在请求的包头中添加

```
Connection: Keep-Alive
```

然后当服务器收到请求，做出响应时，也要添加一个头在响应中：

```
Connection: Keep-Alive
```

从 HTTP1.1 开始，默认开启 Keep-Alive

## TCP的Keepalive

是由TCP层实现的，称为 TCP 的保活机制

如果两端的 TCP 连接一直没有数据交互，达到了触发 TCP 保活机制的条件，那么内核中的 TCP 协议栈就会发生探测报文

- 如果对端程序是正常的。当 TCP 报文发送给对端，对端会正常响应，这样 TCP 保活时间就会被重置，等待下一个 TCP 保活时间的到来
- 如果对端主机宕机（如果是进程崩溃，操作系统在回收进程资源的时候，会发送 FIN 报文，而主机宕机是无法感知的），或由于某些原因导致报文不可达。当 TCP 探测报文发送给对端，没有回应，连续几次，达到保活探测次数后，TCP 会报告该 TCP 连接已死亡

注意：如果程序想要使用 TCP 保活机制，需要通过 socket 接口设置SO_KEEPALIVE选项才能生效，如果没有设置，就无法使用
