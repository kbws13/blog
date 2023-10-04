---
slug: /Python环境配置
title: Python环境配置
date: 2023-09-11
authors: KBWS
tags: [Python, 教程, 零基础]
keywords: [Python, 教程]
---

# 下载Python
点击下方链接下载
[Python3.8.8](https://www.python.org/ftp/python/3.8.8/python-3.8.8-amd64.exe)
![图片](http://kbws.xyz/api/file/getImage/202309/vFTsKBdflwYUhHfjYOScIaVlDTZsVt.png)

# 开始安装
下载完成后双击打开安装
![图片](http://kbws.xyz/api/file/getImage/202309/YaSZsywiRsBHVWjXKSzoGMtYGqMZkV.png)

本教程选择自定义安装
![图片](http://kbws.xyz/api/file/getImage/202309/HdfHEYxlpdmPTBFRanBIQKoCPCVyMK.png)

![图片](http://kbws.xyz/api/file/getImage/202309/vEzuGqsEJpSJGqVlBTDMGCxbOVldiO.png)

然后点击`Install`进行安装，等待安装成功

![图片](http://kbws.xyz/api/file/getImage/202309/uFSeXMpNrnjdHOOsKWAqCACuTBYUle.png)

`SuccessFul`安装成功

# 验证安装
按下组合键Win+R，打开
![图片](http://kbws.xyz/api/file/getImage/202309/lDsSMwEqWheFWVylvnrtbuGrgoQwFn.png)

然后点击确定后会打开一个cmd终端
![图片](http://kbws.xyz/api/file/getImage/202309/pfAMZgqukMIRtebpjcIUybWXXeXrYx.png)

输入`python`后回车
![图片](http://kbws.xyz/api/file/getImage/202309/rfTJHDsWeLotMLDvvrSSKypsfiyTys.png)
正常情况下Pytohn环境就已经配置好了

如果显示找不到Python的话，证明Python的环境变量没有配置成功，此时的操作，需要手动自定配置环境变量

# 配置环境变量
右键`此电脑`，选择`属性`
![图片](http://kbws.xyz/api/file/getImage/202309/orgaqEqxYXDjmGDmiZTRHGEySkJoIu.png)

选择高级系统设置
![图片](http://kbws.xyz/api/file/getImage/202309/AiCfdLvIIQIiQavQIzaesERNneaBGZ.png)

一次点击`高级`->`环境变量`
![图片](http://kbws.xyz/api/file/getImage/202309/oaYzDbcXZLxmBWuIIyIvHmrdwSEJWp.png)

![图片](http://kbws.xyz/api/file/getImage/202309/qPuGMUnRYZHhSpGDjaTWPwpvcMKzJS.png)

![图片](http://kbws.xyz/api/file/getImage/202309/CRlIBvpCwfeiFYkpwuWODoyPNUGpjC.png)

因为在安装Python时，勾选PATH， 所以未我们自动安装了系统变量，如果没有勾选PATH的话，也可以手动把Python安装的路径，配置到这个PATH里面。
只需要点击`新建`按钮，然后将Python的安装路径复制到里面就可以了
复制的路径有两个，一个是根目录，比如：`D:\Environment\Python`，另一个路径是Scripts，比如：`D:\Environment\Python\Scripts`

下面是配置好的截图
![图片](http://kbws.xyz/api/file/getImage/202309/WCCrjXPmyxyfKEYULPEtAGBOiOQiYt.png)
修改完环境变量后要依次点击`确定`来确定修改操作

此时，若返回命令提示符，依然查找不到Python的话，就重启电脑，因为有些环境变量的配置，不是即时生效的，有些是需要重启计算机才会生效

以上操作，以Windows11 Python 3.8.8为准

