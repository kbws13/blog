---
id: volitale-and-synchronized
slug: /volitale-and-synchronized
title: Volitale和Synchronized
date: 2024-03-07
tags: [Volitale, Synchronized, 并发]
keywords: [Volitale, Synchronized, 并发]
---

## Volitale关键字
在 Java 中，`volitale`关键字可以保证变量的可见性，当我们将变量声明为`volitale`时，这就是告诉 JVM，这个变量是共享且不稳定的，每次使用它都要到主存中去取

![20240307215653](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240307215653.png)

`volitale`关键字能保证数据的可见性，但不能保证数据的原子性

## SynChronized关键字
`synchronized`关键字解决的是多个线程之间访问资源的同步性，可以保证被它修饰的方法或者代码块在任何时候只能有一个线程执行

### 使用方式
`synchronized`的使用方式有下面三种

#### 修饰实例方法(锁当前对象实例)
给当前对象实例加锁，进入同步代码前，要先获取**当前实例对象的锁**

```java
synchronized void method() {
    //业务代码
}
```

#### 修饰静态方法(锁当前类)
给当前类加锁，会作用于类的所有对象实例，进入同步代码前，要先获取**当前class的锁**

这是因为静态方法不属于任何一个实例对象，是属于类的，被类的所有实例共享

```java
synchronized static void method() {
    //业务代码
}
```

静态`synchronized`方法和非静态`synchronized`方法之间的调用互斥么？不互斥！

如果一个线程 A 调用一个实例对象的非静态`synchronized`方法，而线程 B 需要调用这个实例对象所属类的静态`synchronized`方法，是允许的，不会发生互斥现象，因为访问静态`synchronized`方法占用的锁是当前类的锁，而访问非静态`synchronized`方法占用的锁是当前实例对象锁

#### 修饰代码块(锁指定类/对象)
对括号里指定的对象/类加锁：
 - `synchronized(object)`表示进入同步代码库前要获得**给定对象的锁**
 - `synchronized(类.class)`表示进入同步代码前要获得**给定 Class 的锁**

```java
synchronized(this) {
    //业务代码
}
```

总结：
 - `synchronized`关键字加到`static`静态方法和`synchronized(class)`代码块上都是是给`Class`类上锁
 - `synchronized`关键字加到实例方法上是给对象实例上锁
 - 尽量不要使用`synchronized(String a)`因为 JVM 中，字符串常量池具有缓存功能

### 底层原理
`synchronized`关键字底层原理属于 JVM 层面的东西

同步代码块例子：

```java
public class SynchronizedDemo {
    public void method() {
        synchronized (this) {
            System.out.println("synchronized 代码块");
        }
    }
}
```

通过`JDK`自带的`javap`命令查看`SynchronizedDemo`类的相关字节码信息：首先切换到类的对应目录执行`javac SynchronizedDemo.java`命令生成编译后的`.class`文件，然后执行`javap -c -s -v -l SynchronizedDemo.class`

![20240307223545](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240307223545.png)

从上面我们可以看出：`synchronized`同步语句块的实现使用的是`monitorenter`和`monitorexit`指令，其中`monitorenter`指令指向同步代码块的开始位置，`monitorexit`指令则指明同步代码块的结束位置。上面的字节码中包含一个`monitorenter`指令以及两个 `monitorexit`指令，这是为了保证锁在同步代码块代码正常执行以及出现异常的这两种情况下都能被正确释放

在执行`monitorenter`时，会尝试获取对象的锁，如果锁的计数器为 0 则表示锁可以被获取，获取后将锁计数器设为 1 也就是加 1

![20240307224012](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240307224012.png)

对象锁的的拥有者线程才可以执行`monitorexit`指令来释放锁。在执行`monitorexit`指令后，将锁计数器设为 0，表明锁被释放，其他线程可以尝试获取锁

![20240307224358](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240307224358.png)

如果获取对象锁失败，那当前线程就要阻塞等待，直到锁被另外一个线程释放为止

修饰方法例子：
```java
public class SynchronizedDemo2 {
    public synchronized void method() {
        System.out.println("synchronized 方法");
    }
}
```

![20240307224845](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240307224845.png)

`synchronized`修饰的方法并没有`monitorenter`指令和`monitorexit`指令，取得代之的确实是`ACC_SYNCHRONIZED`标识，该标识指明了该方法是一个同步方法。`JVM`通过该`ACC_SYNCHRONIZED`访问标志来辨别一个方法是否声明为同步方法，从而执行相应的同步调用。如果是实例方法，`JVM`会尝试获取实例对象的锁。如果是静态方法，`JVM`会尝试获取当前`class`的锁

## volatile和synchronized的区别
 - `volatile`关键字是线程同步的轻量级实现，所以`volatile`性能肯定比`synchronized`关键字要好，但是`volatile`关键字只能用于变量而`synchronized`关键字可以修饰方法以及代码块
 - `volatile`关键字能保证数据的可见性，但不能保证数据的原子性，`synchronized`关键字两者都能保证
 - `volatile`关键字主要用于解决变量在多个线程之间的可见性，而`synchronized`关键字解决的是多个线程之间访问资源的同步性







