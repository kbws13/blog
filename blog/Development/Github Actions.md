---
id: use-githubactions-to-deploy
slug: /use-githubactions-to-deploy
title: 使用 Github Actions 自动部署前端
date: 2024-01-26
tags: [前端, Github]
keywords: [前端, Github]
---

介绍：在日常开发中，部署是一件相当麻烦且枯燥的事，我们可以使用 GitHub 官方提供的 Actions 功能，当我们提交代码到仓库后，自动打包项目并将打包后的文件上传到服务器的指定位置，以此来实现自动化部署

## 创建工作流
点击项目仓库中的 Actions 选型

![20240127104855](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240127104855.png)

可以选择`set up a workflow yourself`创建一个新的工作流，或者在下方选择一个模板
点击`start commit`后在项目目录下会新建`.github/workflow/main.yml`文件

## 修改配置文件

更新本地代码，将远程仓库中的代码拉取下来，在本地修改`mian.yml`配置文件

```yml
name: Auto Deploy
on:
  # 监听 push 操作
  push:
    branches:
      # master 分支，也可以改成其他分支
      - master
jobs:
  # 任务 ID
  build:
    # 运行环境
    runs-on: ubuntu-latest
    # 步骤
    steps:
      # 使用别人的 action
      - use: actions/checkout@v2
      # 步骤名称
    - name: install
      # 步骤执行指令
      run: yarn
    - name: build
      run: yarn run build
    # 命名这个任务为发布Deploy
    - name: Deploy
      # 将仓库打包好的代码上传到自己的服务器
      uses: easingthemes/ssh-deploy@v4.1.10
      with:
          # 服务器密钥
          SSH_PRIVATE_KEY: ${{ secrets.SERVER_SSH_KEY }}
          # 服务器 IP
          REMOTE_HOST: ${{ secrets.USER_HOST }}
          # 用户名
          REMOTE_USER: ${{ secrets.USER_NAME }}
          # 上传build目录下所有
          SOURCE: "/build/"
          # 上传时如果发现build目录下有文件，将其删除
          ARGS: -rltgoDzvO --delete
          # 上传到服务器的指定目录
          TARGET: /home/ubuntu/blog/build
```

在修改完上门的配置文件后，先不要着急上传，先在项目仓库中配置设置密钥

## 配置密钥

### 在服务器配置密钥

在服务器当前用户目录下，输入

```shell
ssh-keygen -m PEM -t rsa -b 4096
```

生成密钥文件，然后连续按下两次回车

这时候，就在用户目录下的`.ssh`文件夹中生成了私钥文件`id_dsa`、公钥文件`id_dsa.pub`，根据公钥文件生成`authorized_keys`，并给以上三个文件分别设置权限

```shell
cat id_rsa.pub >> authorized_keys
chmod 600 id_rsa
chmod 600 id_rsa.pub
chmod 600 authorized_keys
```

这样，服务器端就设置完成了

## 在Github仓库配置密钥

在`Settings`下的`Secrets and variables`中的`Actions`中添加仓库密钥

![20240127105233](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240127105233.png)

在服务器中`cat`密钥，将所有内容复制到上图的`SERVER_SSH_KEY`中，并填入服务器`IP`到`  USER_HOST`，填入服务器用户到`USER_NAME`

```shell
cat id_rsa
```

## 提交代码

将代码提交后，会自动触发工作流，可以在`Ations`界面看工作流工作状况

![20240127105408](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240127105408.png)

出现绿色的对号就是运行成功了，现在服务器上文件应该已经更新了

## 注意

打包部署前端的时候，如果文件夹名字有大写，可能会出现找不到文件的情况
原因是 Git 默认是不区分大小写的，可以使用下面的代码进行更改

### 获取当前项目大小写是否忽略

```shell
git config --get core.ignorecase
git config core.ignorecase //可以用core 核心 ignore //忽略 case //大小写来记忆
```

### 关闭大小写忽略

```shell
git config core.ignorecase false
```

