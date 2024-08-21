---
id: nginx-handles-sse-requests
slug: /nginx-handles-sse-requests
title: Nginx处理SSE请求
date: 2024-08-12
tags: [Nginx, SSE]
keywords: [Nginx, SSE]
image: https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240812135313.png
---

## 介绍
Nginx 是一个高性能的 Web 服务器和反向代理服务器，可以用于处理各种网络请求。当你需要处理 SSE 请求时，可以使用 Nginx 作为反向代理来实现

## 什么是SSE
SSE（Server-Sent Events）是一种基于 HTTP 的服务器推送技术，它允许服务器将实时数据流式传输到客户端。与传统的轮询或长轮询相比，SSE 提供了一种更高效的方式来实现实时数据更新

## 配置

### 添加SSE请求的location块
在配置文件的http部分内，添加一个新的location块来处理SSE请求。这个location块将指定Nginx如何处理SSE请求。以下是一个示例配置：
```conf
http {
    ...

    server {
        ...

        location /sse {
            proxy_http_version 1.1;
            proxy_set_header Connection "";
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header Host $host;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

        	# SSE 连接时的超时时间
        	proxy_read_timeout 86400s;
        	
			# 取消缓冲
            proxy_buffering off;

			# 关闭代理缓存
            proxy_cache off;
        	
        	# 禁用分块传输编码
        	#chunked_transfer_encoding off
        	
        	# 反向代理到 SSE 应用的地址和端口
            proxy_pass http://backend-server;
        }

        ...
    }

    ...
}
```

解释一下上述配置：
- `/sse`是你希望使用的路径，你可以根据需要进行修改。 proxy_pass指定了后端服务器的地址，你需要将其替换为实际的后端服务器地址。
- `proxy_http_version`设置代理使用的HTTP协议版本为1.1。
- `proxy_set_header`设置一些必要的头部信息，如连接方式、真实客户端IP等。
- `proxy_read_timeout`指令来设置 SSE 连接的超时时间。默认情况下，Nginx 会在 60 秒后关闭空闲的连接，这对于 SSE 来说是不合适的，所以我们将超时时间设置为一天（86400 秒）。这样，客户端和服务器之间的连接可以持续保持打开状态。
- `proxy_buffering off`指令来确保数据可以实时传输，而不需要等待缓冲区满。在SSE请求中禁用缓冲，以便正确处理SSE流式数据。
- `proxy_cache`对于 SSE（Server-Sent Events）连接，通常不建议启用 Nginx 的代理缓存（proxy_cache）。因为 SSE 是一种长连接技术，它通过保持持久连接来实时推送数据给客户端，而代理缓存会将响应数据缓存起来并在后续请求中返回缓存的响应，这与 SSE 的工作方式相违背。如果启用代理缓存，Nginx 可能会缓存 SSE 的数据，并在后续的连接中返回相同的缓存数据，这样会导致客户端收到重复的消息，破坏了 SSE 的实时性和准确性。
- `chunked_transfer_encoding`参数可以根据你的需求决定是否关闭。在 SSE 中，通常不需要禁用分块传输编码，因为它允许将数据以数据块的形式逐步传输，与 SSE 的流式数据特性相符合。

### 保存并重启
在完成配置后，可以保存并关闭Nginx配置文件，然后使用命令

```shell
sudo service nginx reload
```

来重新加载Nginx配置

## 499错误
在添加上面的配置后，如果前端在进行SSE连接后还是会断开，使用下面命令查看 Nginx 日志发现 499 错误

![20240812134642](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240812134642.png)

499 是 Nginx 自定义的错误码，意思是`client has closed connection`，客户端主动断开了连接，网上说是服务端处理时间过长客户端“不耐烦”了

但是我在本地测试的时候，使用端口+IP连接没有任何错误，后来测试nginx发现如果两次提交post过快就会出现499的情况，看来是nginx认为是不安全的连接，主动拒绝了客户端的连接

解决方法是加一个配置

```conf
proxy_ignore_client_abort on;
```

意思是代理服务端不要主动关闭客户端连接，重启 Nginx 后问题解决！

> 虽然安全方面稍有欠缺，但比总是出现找不到服务器好多了
