---
id: virtuaenv
slug: /virtuaenv
title: Python创建虚拟环境
date: 2024-01-25
tags: [Python, 虚拟环境]
keywords: [Python, 虚拟环境]
---

介绍：虚拟环境是Python开发人员常用，本文介绍如何使用Virtualenvwrapper管理Python虚拟环境

## 概述
Virtaulenvwrapper是virtualenv的扩展包，用于更方便管理虚拟环境，它可以做： 
 - 将所有虚拟环境整合在一个目录下
 - 管理（新增，删除，复制）虚拟环境
 - 快速切换虚拟环境

## 安装
```shell
# on Windows
pip install virtualenvwrapper-win
# on macOS / Linux
pip install --user virtualenvwrapper
# then make Bash load virtualenvwrapper automatically
echo "source virtualenvwrapper.sh" >> ~/.bashrc
source ~/.bashrc
```
虚拟环境存放的位置为：`C:/Users/用户名/Envs`

## 创建虚拟环境
```shell
# on macOS/Linux:
mkvirtualenv --python=python3.6 venv
# on Windows
mkvirtualenv --python=python3 venv
```
使用`--python`指定虚拟环境中 Python 的版本，`venv`是虚拟环境名称

## 激活虚拟环境
```shell
workon #列出虚拟环境列表
workon [venv] #切换环境
```

## 退出虚拟环境
```shell
deactivate
```

## 删除环境
```shell
rmvirtualenv venv
```
`venv`是虚拟环境名称