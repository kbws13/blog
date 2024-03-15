---
id: the-difference-between-synchronized-and-reentrantLock
slug: /the-difference-between-synchronized-and-reentrantLock
title: Synchronized和ReentrantLock的区别
date: 2024-03-15
tags: [Synchronized, ReentrantLock]
keywords: [Synchronized, ReentrantLock]
---
## Synchronized
1. 是 Java 内置的关键字，用于提供对象或方法级别的同步机制
2. 它能够确保在同一时刻只有一个线程可以执行 Synchronized 修饰的方法或代码块
3. 不需要手动释放锁，当 Synchronized 方法或者代码块执行完毕后，锁自动释放
4. 锁的获取和释放是隐式的 ，为开发者提供了便捷的线程同步机制
5. 不支持公平锁、可中断锁等高级功能

## ReentrantLock
1. 属于`java.util.concurrent.locks`包下的一个类，提供了比 Synchronized 更广泛的锁操作
2. 必须手动声明锁的获取和释放（通过`lock()`和`unlock()`方法）
3. 支持许多高级功能，如可中断的锁等待、公平锁、锁续租等
4. 支持可中断的锁等待（`lockInterruptibly()）
5. 提供了条件变量（Condition）支持，允许分开管理线程间的通信

```java
ReentrantLock lock = new ReentrantLock(); // 默认非公平锁
ReentrantLock lock = new ReentrantLock(true); // 启用公平锁
```