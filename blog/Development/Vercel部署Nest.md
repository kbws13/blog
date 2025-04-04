---
id: deploy-nest-by-vercel
slug: /deploy-nest-by-vercel
title: 使用 Vercel 部署 Nest
date: 2025-04-04
tags: [Vercel, Nest, 部署]
keywords: [Vercel, Nest, 部署]
image: https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20250404181408.png
---
本文将介绍如何使用 Vercel 部署 Nest 应用，包含一些踩坑经历

## 创建配置文件

首先在项目跟目录在创建`vercel.json`配置文件，并设置 Nest 服务相关的配置：

```json
{
  "builds": [
    {
      "src": "dist/main.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/main.js",
      "methods": ["GET", "POST", "PUT", "DELETE"]
    }
  ]
}

```

**注意**： 不要设置`src`和`dest`为`dist/main.ts`，一定是`dist/main.js`，不然会部署时会找不到 module 导致直接崩溃：

![20250404174421](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20250404174421.png)

后台日志也会是一堆报错：

![20250404174451](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20250404174451.png)

然后，把`.gitignore`文件中的`dist`也删掉，因为我们要启动的是 dist 文件夹中的main.js 文件，而不是 src 文件夹中的 main.ts 文件。所以需要把 dist 目录也提交到 Gituhb 上。

## Vercel 拉取和配置

打开 [Vercel](https://vercel.com) 官网，自己注册一个账号（Github 或者 Google 都可以）

点击右上角的 Add 按钮，选择 Project

![20250404174932](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20250404174932.png)

第一次 Add 项目的时候，授权 Github 账号，授权后就可以在下面看到自己项目了

![20250404175042](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20250404175042.png)

找到要部署的项目，点击`Import`按钮后会进入下面页面

![20250404175234](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20250404175234.png)

Nest 项目的话，框架选择 Other，可以配置 build 时的命令、输出目录，以及环境变量等

配置好后点击`Deploy`按钮就会根据上面的配置，部署项目实例

> 默认情况下，Vercel 会监听仓库的主分支，只要主分支有更新，就会自动触发更新

![20250404175530](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20250404175530.png)

点击部署记录，可以进入该次部署的详细页面，部署时的日志、请求记录等都可以在这查看

![20250404175729](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20250404175729.png)

### 注意
项目中一定不要有**写入/保存文件**的操作，Vercel 提供的是`Serverless`部署，如果在项目启动过程中有比如，创建文件夹，写入日志文件等操作，部署会失败、实例崩溃

## 自定义域名

Vercel 默认给服务分配了临时的域名，同时支持用户配置个人域名（首先要确认自己已经拥有了个人域名，并且国内还需要完成备案）

![20250404180136](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20250404180136.png)

在代码的输入框中填写你自己的域名，然后点击 Add

![20250404180235](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20250404180235.png)

修改域名 DNS 解析，然后等待域名生效，然后就可以访问了

![20250404180347](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20250404180347.png)
