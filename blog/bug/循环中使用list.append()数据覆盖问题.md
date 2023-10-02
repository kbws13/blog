---
slug: /循环中使用list.append()数据覆盖问题
title: 循环中使用list.append()数据覆盖问题
date: 2023-05-05
authors: KBWS
tags: [Python, Bug]
keywords: [Python, Bug]
---

# 问题描述
如果要在循环中使用append将dict添加到list中时，容易产生数据覆盖
例如：
```python
l = []
d = {'id':0}
for i in range(3):
	d['id'] = i
	l.append(d)
print(l)
```
上述代码，我们的预期输出是:
```
[{'id':0},{'id':1},{'id':2}]
```
但是实际的输出是：
```python
[{'id':2},{'id':2},{'id':2}]
#id
[28668464,28668464,28668464]
```
产生此问题的原因是d在循环外，地址固定，而list内存储的是d的地址，所以每次循环d的值会发生改变，而list内的数据都被覆盖了

# 解决方法
将d的创建包含在循环内，每次地址都进行更新。

# 最终代码
```python
l = []
for i in range(3):
    d = {'id':0}
	d['id'] = i
	l.append(d)
```