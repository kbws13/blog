---
id: jasypt
slug: /jasypt
title: 对SpringBoot配置文件敏感信息加密
date: 2024-09-29
tags: [jasypt, SpringBoot, 加密]
keywords: [jasypt, SpringBoot, 加密]
image: https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240929121510.png
---

## 需求介绍
在日常开发上线项目的过程中，我们常常需要在SpringBoot至少写两个配置文件，一个是本地开发环境，一个是真实上线环境（生产环境）

本地开发的配置文件泄露没什么关系，但是如果生产环境的配置文件泄露了就会造成很大问题（数据库地址、缓存地址等）

也有的开发者（比如我）喜欢将自己的项目开源到 Github 上，有时候一不小心就会把自己的服务器环境配置文件提交到 Github 上去，别人看到了可能会恶意清空线上数据库等等

其实最好的解决方式就是搭建一个注册中心（Nacos、Apoll 这种），项目从注册中心获取相关配置，这样是最好的。但是本人服务器性能有限，考虑到如果注册中心出现了问题，基本上所有的服务都会受到影响，所以才用 [jasypt](https://github.com/jasypt/jasypt) 加密配置文件的方式

## Jasypy

Jasypt（Java Simplified Encryption）是一个Java库，它允许开发人员以最小的工作量将基本的加密功能添加到项目中，而不需要深入了解密码学的工作原理

### 导入Maven依赖

```xml
<dependency>
    <groupId>com.github.ulisesbocchio</groupId>
    <artifactId>jasypt-spring-boot-starter</artifactId>
    <version>3.0.5</version>
</dependency>
```

### 添加插件

```xml
<build>
    <plugins>
        <plugin>
            <groupId>com.github.ulisesbocchio</groupId>
            <artifactId>jasypt-maven-plugin</artifactId>
            <version>3.0.5</version>
        </plugin>
    </plugins>
</build>
```

### 开始加密
首先，打开 Idea 的命令行，输入下面命令
```shell
mvn jasypt:encrypt-value "-Djasypt.encryptor.password=kbws13" "-Djasypt.plugin.value=123456"
```

![20240929115500](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240929115500.png)

这句命令中有两个参数：
- `-Djasypt.encryptor.password=kbws13`：这个是生成密文的一个私钥，只有加密人知道
- `-Djasypt.plugin.value=123456`：这个是要加密的内容，比如数据库密码、数据库链接等

运行上面命令后，会生成一段密文

![20240929115756](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240929115756.png)

使用同样的方式加密用户名和 URL，用生成的密文替换原来的明文，效果如下：

![20240929120100](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240929120100.png)

这样，就算其他人看到了我们的配置文件内容，他也不知道真实的数据库账号、密码和地址

但是还有一个问题，将数据库配置改成密文后，原来的项目启动不起来了，因为 SpringBoot 后直接拿着密文去请求连接数据库

## 设置解密参数

上面问题的解决方法就是：在运行程序的时候，设置一个解密的参数，这个参数，就是生成密文时的私钥

在环境变量中添加生成密文的私钥

![20240929120659](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240929120659.png)

这样程序就能在运行时拿到私钥并解密，此时运行就没有任何问题了

![20240929120824](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240929120824.png)

## 部署

部署项目到服务器时，也是需要指定命令行参数，例如：

```shell
java -jar demo-0.0.1-SNAPSHOT.jar --jasypt.encryptor.password=kbws13
```

这样，就可以正常启动了

![20240929121152](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240929121152.png)

