---
id: gradle
slug: /gradle
title: Gradle
date: 2024-10-02
tags: [Gradle]
keywords: [Gradle]
---

## 入门
### 基本介绍
+ Maven：遵循约定大于配置，**侧重于包的管理**
+ Gradle：：集 Ant 脚本的灵活性和 Maven 的约定大于配置，支持多种远程仓库和插件，**侧重大项目的构建**

### Gradle安装

下载地址：[Gradle | Installation](https://gradle.org/install/)

下载解压后，配置系统环境变量

输入下面命令，检查是否安装成功

```shell
gradle -v
```

![20241002201009](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20241002201009.png)

### 项目目录

Gradle 项目目录和 Maven 项目的目录一样，都是基于约定大于配置

![20241002201019](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20241002201019.png)

> 1. 只有 war 工程才有 webapp 目录，普通的 jar 工程没有这个目录
> 2. gradlew 与 gradle.bat 执行的指定 wrapper 版本的 gradle 指令，不是本地安装的 gradle 指令


### 项目应用

#### 常用指令

![20241002201034](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20241002201034.png)

> gradle 指令需要在含有 build.gradle 的目录执行

#### 修改Maven下载源

Gradle 自带的 Maven 下载源是国外的，需要修改成国内或者第三方的

**init.d文件夹**

可以在 init.d 文件夹下创建以`.gradle`为后缀的文件，这种文件可以在 build 开始之前执行，所以可以在这个文件中加入一些想预加载的操作

创建`init.gradle`文件，文件内容如下：

```groovy
allprojects {
    repositories {
        mavenLocal()
        maven { name "Alibaba" ; url "https://maven.aliyun.com/repository/public" } 
        maven { name "Bstek" ; url "https://nexus.bsdn.org/content/groups/public/" } 
        mavenCentral()
    }
    
    buildscript {
        repositories {
            maven { name "Alibaba" ; url 'https://maven.aliyun.com/repository/public' } 
            maven { name "Bstek" ; url 'https://nexus.bsdn.org/content/groups/public/' } 
            maven { name "M2" ; url 'https://plugins.gradle.org/m2/' }
        }
    }
}
```

**拓展**

使用`init.gradle`文件的方法有：

1. 在命令行指定文件，例如：`gradle --init-script yourdir/init.gradle -q taskName`，可以多次输入此命令来指定多个 init 文件
2. 把这个文件放到`USER_HOME/.gradle/`目录下
3. 把以`.gradle`为结尾的文件放到`USER_HOME/.gradle/init.d`目录下
4. 把以`.gradle`为结尾的文件放到`GRADLE_HOME/init.d`目录下

如果存在上面 4 种方式中的 2 种，Gradle 就会按照上面 1-4 的顺序执行这些文件，如果给定目录下存在多个 init 脚本，就会按照拼音 a-z 的顺序执行这些脚本，每个 init 脚本都存在一个对应的 Gradle 实例，在这个文件中调用的所有方法和属性都会委托给这个 Gradle 实例，每个 init 脚本都实现了 script 接口



仓库地址说明：

+ `mavenLocal()`：指定使用的 Maven 本地仓库，而本地仓库在配置 Maven 的时候 settings 配置文件指定的仓库位置，Gradle 查找 jar 包顺序如下：`USER_HOME/.m2/settings.xml` >> `M2_HOME/conf/settings.xml` >> `USER_HOME/.m2/repository`
+ `maven { url 地址 }`：指定 Maven 仓库，例如阿里云镜像仓库地址等
+ `mavenCentral()`：Maven 的中央仓库，无需配置，直接声明就可以使用

#### Wrapper包装器

Gradle Wrapper 就是对 Gradle 的一层包装，用于解决实际开发中可能会遇到的不同项目需要不同版本的 Gradle，例如：

+ 对方电脑没有安装 Gradle
+ 对方安装过 Gradle，但是版本太旧

有了 Gradle Wrapper 后，本地是可以不配置 Gradle 的，下载 Gradle 项目后，使用 Gradle 项目自带的 wrapper 操作也是可以的


**如何使用 Gradle Wrapper**

项目中的 gradle、gradlew.cmd 脚本用的是 wrapper 中规定的 gradle 版本

上面提到的 gradle 命令用的是本地的 gradle，所以**gradle 命令和 gradlew 命令所使用的 gradle 版本很可能是不一致的**

gradlew、gradlew.cmd 的使用方式和 gradle 完全一致，只不过把 gradle 命令换成了 gradlew 命令

也可以在终端执行 gradlew 命令时，指定一些参数来控制 Wrapper 的生成，比如依赖的版本：

![20241002201101](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20241002201101.png)

具体操作如下：

+ `gradlew wrapper --gradle-version=4.4`：升级 wrapper 版本号，只是修改`gradle.properties`中 wrapper 版本，并未实际下载
+ `gradle wrapper --gradle-version 5.2.1 --distribution-type all`：关联源码用

##### Gradle Wrapper的执行流程

1. 第一次执行`./gradlew build`命令的时候，gradlew 会读取`gradle.properties`文件的配置信息
2. 准确的将指定版本的 Gradle 下载并解压到指定目录（GRADLE_USER_HOME 目录下的 warapper/dists 目录中）
3. 并构建本地缓存（GRADLE_USER_HOME 目录下的 caches 目录中），下次再使用相同版本的 Gradle 就不用下载了
4. 之后执行的`./gradlew`所有命令都是使用指定的 Gradle 版本

![20241002201111](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20241002201111.png)

`gradle-properties`文件解读：

![20241002201119](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20241002201119.png)

**什么时候用 gradle wrapper、什么时候用本地 gradle？**

+ 下载别人项目或者操作以前自己写的不同版本的 Gradle 项目时：用 Gradle Wrapper
+ 新建一个项目时：使用 Gradle

## 与Idea整合

### Groovy

#### 简介

Groovy 是 Java 的脚本改良版，可以运行在 JVM 上，可以很好的与 Java 相关的库进行交互，既可以面向对象，也可以用作纯粹的脚本语言

其特点为：

+ 功能强大，例如提供了动态类型转换、闭包和元编程（metaprogramming）支持
+ 支持函数式编程，不需要main 函数
+ 默认导入常用的包
+ 类不支持 default 作用域,且默认作用域为public。
+ Groovy 中基本类型也是对象，可以直接调用对象的方法。
+ 支持DSL（Domain Specific Languages 领域特定语言）和其它简洁的语法，让代码变得易于阅读和维护。
+ Groovy 是基于Java 语言的，所以完全兼容Java 语法,所以对于java 程序员学习成本较低

#### 安装

下载地址：[The Apache Groovy programming language - Download](https://groovy.apache.org/download.html)

配置系统环境变量

#### 创建Grooxy项目

![20241002201140](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20241002201140.png)

#### 基本语法

![20241002201147](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20241002201147.png)

类型转换：当需要时，类型之间会自动转换

类说明：如果在一个 Grooxy 文件中没有任何类的定义，他会被当做脚本来处理，也就意味着这个文件会被透明的专业为一个 Script 类型的类，这个自动转换得到的类将使用原始的 grooxy 文件名作为类的名字，Groovy 文件的内容会被打包到 run 方法，另外在新产生的类中被加入一个 main 方法来进行外部执行该脚本



**基本注意点**

![20241002201157](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20241002201157.png)

提示：方法调用时,在不含有歧义的地方可以省略方法调用时的括号。这类似于使用${变量名}时，括号在不引起歧义的地方可以省略是一样的。如：

```groovy
def num1=1; 
def num2= 2;
println "$num1 + $num2 = ${num1+num2}"
```

**引号说明**

```groovy
def num1=1; 
def num2=2;
def str1="1d"; //双引号
def str2='dsd'; //单引号
//双引号运算能力,单引号用于常量字符串,三引号相当于模板字符串，可以支持换行
println "$num1 + $num2 = ${num1 + num2}"
//基本数据类型也可以作为对象使用,可以调用对象的方法
println(num1.getClass().toString()) 
println(str1.getClass().toString()) 
println(str2.getClass().toString())
```

**三个语句结构**

Groovy 支持顺序结构从上向下依次解析、分支结构(if..else、if..else if ..else..、switch..case、for、while、do..while)


**类型及权限修饰符**

Groovy 中的类型有：

原生数据类型和包装类

![20241002201214](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20241002201214.png)

类、内部类、抽象类、接口

注解

Trait：可以看成是带有方法实现的接口

权限修饰符：public、protected、private


拓展：

Groovy 和 Java 类之间的主要差别：

1. 没有权限修饰符的类或者方法默认是公共的
2. 没有权限修饰符的字段自动转换为属性，不需要显示的 getter 和 setter 方法
3. 如果属性声明为 final，则不会生成 setter
4. 一个源文件可能包含一个类或者多个类


**集合操作**

Groovy 支持List、Map 集合操作，并且拓展了 Java 中的API,具体参考如下方法：

`List`:

+ `add()`:添加某个元素plus():添加某个list 集合
+ `remove():`删除指定下标的元素removeElement():删除某个指定的元素removeAll(): 移除某个集合中的元素
+ `pop()`:弹出list 集合中最后一个元素putAt():修改指定下标的元素
+ `each()`:遍历
+ `size()`: 获取list 列表中元素的个数
+ `contains()`: 判断列表中是否包含指定的值，则返回 true 

`Map`:

+ `put()`:向map 中添加元素
+ `remove()`:根据某个键做移除，或者移除某个键值对
+ `+、-`：支持 map 集合的加减操作
+ `each()`:遍历map 集合

> 可以将不同的基本类型添加到一个集合中


**类导入**

Groovy 遵循 Java 允许 import 语句解析类引用的概念

```groovy
import groovy.xml.MarkupBuilder 
def xml = new MarkupBuilder() 
assert xml != null
```


Groovy 语言默认提供的导入：

```groovy
import java.lang.* 
import java.util.* 
import java.io.* 
import java.net.* 
import groovy.lang.* 
import groovy.util.*
import java.math.BigInteger
import java.math.BigDecimal
```


**异常处理**

Groovy 中的异常处理和 Java 中的异常处理是一样的

```groovy
def z 
try {
    def i = 7, j = 0 
    try {
        def k = i / j 
        assert false
    } finally {
        z = 'reached here'
    }
} catch ( e ) {
    assert e in ArithmeticException 
    assert z == 'reached here'
}
```


**闭包**

闭包：Groovy 中的闭包是一个开放的、匿名的代码块，它可以接受参数、也可以有返回值。闭包可以引用其周围作用域中声明的变量。

语法：`{ [closureParameters -> ] statements }`

其中`[ closureParameters-> ]`是一个可选的逗号分隔的参数列表,参数后面是  Groovy 语句。参数类似于方法参数列表， 这些参数可以是类型化的,也可以是非类型化的。当指定参数列表时，需要使用`->` 字符，用于将参数与闭包体分离

```groovy
//闭包体完成变量自增操作
{ item++ }
//闭包使用 空参数列表 明确规定这是无参的
{ -> item++ }
//闭包中有一个默认的参数[it]，写不写无所谓
{ println it }
{ it -> println it }
//如果不想使用默认的闭包参数it,那需要显示自定义参数的名称
{ name -> println name }
//闭包也可以接受多个参数
{ String x, int y ->
    println "hey ${x} the value is ${y}"
}
//闭包参数也可是一个对象
{ reader ->
    def line = reader.readLine() 
    line.trim()
}
```

闭包调用方式： 闭包是 `<font style="color:#C6244E;">groovy.lang.Closure</font>` 的实例。它可以像任何其他变量一样分配给一个变量或字段。

闭包对象(参数)

闭包对象.call(参数)

```groovy
def isOdd = { int i -> i%2 != 0 } 
assert isOdd(3) == true
assert isOdd.call(2) == false

def isEven = { it%2 == 0 } 
assert isEven(3) == false 
assert isEven.call(2) == true
```

提示：可以把闭包当作一个对象，作为参数传递给方法使用

```groovy
//无参闭包
def run(Closure closure){ 
    println("run start...")
    closure() println("run end...")
}

run {
    println "running......"
}

//有参闭包
def caculate(Closure closure){
    def num1=1;
    def num2=3; 
    println("caculate start...")
    closure(num1,num2) 
    println("caculate end...")
}
caculate {x,y -> println "计算结果为：$x+$y=${x+y}"} //在build.gradle文件中我们见到的很多都是闭包格式的。
```



### 整合Idea创建项目

![20241002201256](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20241002201256.png)

创建项目完成后，目录结构如下：

![20241002201305](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20241002201305.png)

`settings.gradle`，这个文件可以用来书写全局配置（设置镜像源等）

![20241002201313](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20241002201313.png)

`build.grade`用于管理工程依赖：

```groovy
// 插件声明块，用于指定项目构建需要的插件
plugins {
    // 使用 Gradle 内置的 Java 插件，为 Java 项目的构建提供支持
    id 'java'
    // 使用SpringBoot插件，并指定其版本为3.2.10，用于支持SpringBoot项目的构建和管理
    id 'org.springframework.boot' version '3.2.10'
    // 使用Spring的依赖管理插件，版本为1.1.4，帮助管理项目之间的依赖关系
    id 'io.spring.dependency-management' version '1.1.6'
    id 'maven-publish'
}

// 配置发布插件
publishing {
    publications {
        mavenJava(MavenPublication) { // 修改这里的名称
            groupId = 'org.gradle.sample'
            artifactId = 'library'
            version = '1.1'

            from components.java
        }
    }
}

// 设置项目的组id，用于表示项目的组织或团队
group = 'xyz.kbws'
// 设置项目的版本号
version = '0.0.1-SNAPSHOT'

// Java配置块
java {
    // 设置Java源代码的兼容性版本为21
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}

// 让compileOnly配置继承annotationProcessor配置中的所有依赖
// 这样，添加到compileOnly中的任何库也将被视为注解处理器，但仅在编译时使用，不会在运行时包含在内
configurations {
    compileOnly {
        extendsFrom annotationProcessor
    }
}

repositories {
    mavenCentral()
}

// 依赖声明块，定义项目所依赖的库及其版本
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    /**
     * !! 表示强制使用该依赖，不写默认使用高版本
     */
    implementation("com.belerweb:pinyin4j:2.5.1!!"){
        // 只要关联的子依赖以xyz.kbws开头都会自动排除
        exclude("xyz.kbws")
    }
    /**
     * 扫描lib目录下所有jar包，并添加到依赖中
     */
    implementation(fileTree("lib"))
    // 编译时依赖，Lombok库，用于简化Java类的编写，为了让Gradle知道在编译时要调用Lombok的注解处理器
    // 需要在Gradle脚本中添加Lombok作为annotationProcessor的依赖
    compileOnly 'org.projectlombok:lombok'
    annotationProcessor 'org.projectlombok:lombok'
    // 该依赖不参与编译，只有在运行时才使用
    runtimeOnly("mysql:mysql-connector-java:8.0.33")
    // 指定该依赖只有在测试的时候才用
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
    testRuntimeOnly 'org.junit.platform:junit-platform-launcher'
}

// 任务配置块，针对特定类型的任务进行配置
tasks.named('test') {
    // 使用Junit Platform 来测试，这是Junit 5推荐的方式
    useJUnitPlatform()
}

```


### Gradle对测试的支持

测试任务自动检测并执行测试源集中的所有单元测试，测试执行完后会生成一个报告，支持 Junit 和 TestNG 测试

**默认测试目录和标准输出**

![20241002201331](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20241002201331.png)

#### JUnit使用

对于 JUnit4.x 支持

```groovy
dependencies {
    testImplementation group: 'junit' ,name: 'junit', version: '4.12'
}
test {
    useJUnit()
}
```

对于 JUnit5.x 版本支持

```groovy
dependencies {
    testImplementation 'org.junit.jupiter:junit-jupiter-api:5.8.1' 
    testRuntimeOnly 'org.junit.jupiter:junit-jupiter-engine:5.8.1'
}
test {
    useJUnitPlatform()
}
```

> 无论是 JUnit4.x 还是 JUnit5.x 版本，只需要在`build.grade`目录下执行`gradle test`指令，Gradle 就会执行所有加了`@Test`注解的测试，并生成测试报告

测试报告位置如下：

![20241002201344](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20241002201344.png)

**包含和排除特定测试**

```groovy
test {
    enabled true 
    useJUnit() 
    include 'com/**'
    exclude 'com/abc/**'
}
```

## 进阶

从整体的角度介绍：

+ 什么是 setting 文件，有什么作用
+ 什么是 build 文件，有什么作用
+ 可以创建多少个 build
+ project 和 task 有什么作用，有什么关系，如何配置
+ 项目的生命周期
+ 项目发布
+ 使用 Gradle 创建 SpringBoot 等

### 生命周期

Gradle 项目的生命周期分为三个阶段：Initialization -> Configuration -> Execution，每个阶段都有自己的职责，分工如下：

![20241002201357](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20241002201357.png)

**Initialization 阶段**

主要目的是项目构建，分为两个子过程：

+ 执行 init script，`init.gradle`文件会在每个项目 build 之前被调用，做一些初始化操作，作用如下：
    - 配置内部的仓库信息
    - 配置一些全局属性
    - 配置用户名及密码信息
+ 执行 setting script，初始化了一次构建所参与的所有模块

**Configuration 阶段**

这个阶段开始加载项目中所有模块的 Build Script，所谓“加载”就是执行`build.gradle`中的语句，根据脚本代码创建对应的 task，最终根据所有 task 生成由 Task 组成的有向无环图，如下：

![20241002201404](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20241002201404.png)

有向无环图如下：

![20241002201410](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20241002201410.png)


**Execution 阶段**

这个阶段会根据上个阶段构成的有向无环图，按照顺序执行 Task（Action 动作）

### settings 文件

对 settings 文件的说明：

作用：在项目初始化阶段确定一下引入哪些工程需要加入到项目构建中，为构建项目工程树做准备

工程树：类似 Maven 中的 project 和 module

![20241002201421](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20241002201421.png)

内容：里面定义了当前 Gradle 项目和子项目的名称

位置：必须在项目根目录下

名字：为`settings.gradle`文件

使用 include 方法，通过相对路径`:`引入子工程

> 一个子项目只有在 settings 文件中配置了才会被 Gradle 识别，在构建的时候才会被包含进去

例如：

```groovy
//根工程项目名
rootProject.name = 'root'
//包含的子工程名称
include 'subject01' 
include 'subject02' 
include 'subject03'
//包含的子工程下的子工程名称
include 'subject01:subproject011' 
include 'subject01:subproject012'
```

### Task

项目实质上是 Task 对象的集合，一个 Task 表示一个逻辑上较为独立的执行过程，比如编译 Java 代码，拷贝文件，打包 jar，甚至是执行一个系统命令

一个 Task 可以读取和设置 Project 的 Property 来完成特定的操作

#### 入门

例子：

```groovy
task A {
    println "root taskA" 
    doFirst(){
        println "root taskA doFirst"
    }
    doLast(){
        println "root taskA doLast"
    }
}
```

在文件所在目录执行命令：`gradle A`

1. task 的配置段是在配置阶段完成的
2. task 的 doFirst 和 doLast 方法是执行阶段完成的，并且 doFirst 先执行
3. 区分任务的配置段和任务的行为，任务的配置段是配置阶段执行，任务的行为在执行阶段执行

#### 任务的行为

doFirst、doLast 两个方法可以在任务内部定义，也可以在任务外部定义

```groovy
def map=new HashMap<String,Object>();
// action属性可以设置为闭包，设置task自身的行为
map.put("action",{println "taskD.."})
task(map,"a"){
    description   'taskA description	'
    group "atguigu"
    // 在task内部定义doFirst、doLast行为
    doFirst {
        def name = 'doFirst..' 
        println name
    }
    doLast {
        def name = 'doLast..' 
        println name
    }
}
//在task外部定义doFirst、doLast行为
a.doFirst {
    println it.description
}
a.doLast {
    println it.group
}
```

执行`gradle a`，输出如下：

![20241002201442](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20241002201442.png)

> 无论是定义任务自身的 action,还是添加的doLast、doFirst 方法，其实底层都被放入到一个Action 的 List 中了，最初这个 action List 是空的，当设置了 action【任务自身的行为】,它先将action 添加到列表中，此时列表中只有一个action,后续执行 doFirst 的时候 doFirst 在 action 前面添加，执行 doLast 的时候 doLast 在 action 后面添加。doFirst 永远添加在actions List 的第一位，保证添加的Action 在现有的 action List 元素的最前面；doLast 永远都是在action List 末尾添加，保证其添加的 Action 在现有的 action List 元素的最后面。一个往前面添加,一个往后面添加，最后这个 action List 就按顺序形成了 doFirst、doSelf、doLast 三部分的 Actions,就达到 doFirst、doSelf、doLast 三部分的 Actions 顺序执行的目的


#### 任务的依赖方式

Task 之间的依赖方式，可以在下面几部分设置：

1. 参数依赖
2. 内部依赖
3. 外部依赖

**参数方式依赖**

```groovy
task A {
    doLast {
        println "TaskA.."
    }
}
task 'B' {
    doLast {
        println "TaskB.."
    }
}
//参数方式依赖: dependsOn后面用冒号
task 'C'(dependsOn: ['A', 'B']) {
    doLast {
        println "TaskC.."
    }
}}
```

**内部依赖**

```groovy
//参数方式依赖
task 'C' {
    //内部依赖：dependsOn后面用 = 号
    dependsOn= [A,B] 
    doLast {
        println "TaskC.."
    }
}
```



**外部依赖**

```groovy
// 外部依赖：可变参数，引号可加可不加
C.dependsOn(B, 'A')
```



提示：Task 支持跨项目依赖

在 subproject01 工程中的`build.gradle`文件中定义：

```groovy
task A {
    doLast {
        println "TaskA.."
    }
}
```

在 subproject02 工程中的`build.gradle`文件中定义：

```groovy
task B{
    dependsOn(":subproject01:A") //依赖根工程下的subject01中的任务A ：跨项目依赖。
    doLast {
        println "TaskB.."
    }
}
```

测试：`gradle B`，控制台输出如下：

![20241002201458](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20241002201458.png)


拓展：

1. 当一个 Task 依赖多个 Task 时，被依赖的 Task 之间如果没有依赖关系，那么他们的执行顺序是随机的，并无影响
2. 重复依赖的任务只执行一次，例如：任务A 依赖任务 B 和任务 C、任务 B 依赖C 任务。执行任务A 的时候，显然任务C 被重复依赖了，C 只会执行一次



#### 任务执行

语法：`gradle [taskName...] [--option-name...]`

| 分类 | 解释 |
| --- | --- |
| **<font style="color:rgb(255, 0, 0);">常见的任务（*）</font>** | `gradle build`: 构建项目:编译、测试、打包等操作<br/>`gradle run` :运行一个服务,需要application 插件支持，并且指定了主启动类才能运行<br/>`gradle clean`: 请求当前项目的 build 目录<br/>`gradle init` : 初始化 gradle 项目使用<br/>`gradle wrapper`:生成wrapper 文件夹的。<br/>+ gradle wrapper 升级wrapper 版本号：`gradle wrapper --gradle-version=4.4`<br/>+ `gradle wrapper --gradle-version 5.2.1 --distribution-type all` :关联源码用 |
| **<font style="color:rgb(255, 0, 0);">项目报告相关任务</font>** | `gradle projects` : 列出所选项目及子项目列表，以层次结构的形式显示<br/>`gradle tasks`: 列出所选项目【<font style="color:rgb(255, 0, 0);">当前 project,不包含父、子】</font>的<font style="color:rgb(68, 113, 196);">已分配给任务组</font>的那些任务。<br/>`gradle tasks --all` :列出所选项目的<font style="color:rgb(68, 113, 196);">所有</font>任务。<br/>`gradle tasks --group="build setup"`:列出所选项目中指定分组中的任务。<br/>`gradle help --task someTask` :显示某个任务的详细信息<br/>`gradle dependencies` :查看整个项目的依赖信息，以依赖树的方式显示<br/>`gradle properties` 列出所选项目的属性列表 |
| 调试相关选项 | -h,--help: 查看帮助信息<br/>-v, --version:打印 Gradle、 Groovy、 Ant、 JVM 和操作系统版本信息。<br/><font style="color:rgb(68, 113, 196);">-S, --full-stacktrace:打印出所有异常的完整(非常详细)堆栈跟踪信息。</font><br/><font style="color:rgb(68, 113, 196);">-s,--stacktrace: 打印出用户异常的堆栈跟踪(例如编译错误)。</font><br/>-Dorg.gradle.daemon.debug=true: 调试 Gradle  守护进程。<br/>-Dorg.gradle.debug=true:调试 Gradle 客户端(非 daemon)进程。<br/>-Dorg.gradle.debug.port=(port number):指定启用调试时要侦听的端口号。默认值为 5005。 |
| 性能选项:【**<font style="color:rgb(255, 0, 0);">备注</font>**: 在gradle.properties 中指定这些选项中的许多选项，因此不需要命令行标志】 | <font style="color:rgb(68, 113, 196);">--build-cache, --no-build-cache： 尝试重用先前版本的输出。默认关闭(off)</font>。<br/><font style="color:rgb(68, 113, 196);">--max-workers: 设置 Gradle 可以使用的woker 数。默认值是处理器数。</font><br/>-parallel, --no-parallel: 并行执行项目。有关此选项的限制，请参阅并行项目执行。默认设置为关闭(off) |
| 守护进程选项 | --daemon, --no-daemon:  使用 Gradle 守护进程运行构建。默认是on<br/>--foreground:在前台进程中启动 Gradle  守护进程。<br/>-Dorg.gradle.daemon.idletimeout=(number of milliseconds):<br/>Gradle Daemon 将在这个空闲时间的毫秒数之后停止自己。默认值为 10800000(3 小时)。 |
| 日志选项 | -Dorg.gradle.logging.level=(quiet,warn,lifecycle,info,debug):<br/>通过 Gradle 属性设置日志记录级别。<br/><font style="color:rgb(68, 113, 196);">-q, --quiet: 只能记录错误信息</font><br/>-w, --warn: 设置日志级别为 warn<br/>-i, --info: 将日志级别设置为 info<br/>-d, --debug:登录调试模式(包括正常的堆栈跟踪) |
| **<font style="color:rgb(255, 0, 0);">其它(*)</font>** | -x:-x 等价于: --exclude-task : <font style="color:rgb(255, 0, 0);">常见gradle -x test clean build</font><br/>--rerun-tasks: 强制执行任务，忽略up-to-date ,<font style="color:rgb(255, 0, 0);">常见gradle build --rerun-tasks</font><br/>--continue: 忽略前面失败的任务,继续执行,而不是在遇到第一个失败时立即停止执行。每个遇到的故障都将在构建结束时报告，常见：<font style="color:rgb(255, 0, 0);">gradle build --continue</font>。<br/><font style="color:rgb(255, 0, 0);">gradle init --type pom :将maven 项目转换为gradle 项目(根目录执行)</font><br/>gradle [taskName] :执行自定义任务 |
| ... | |


**拓展**

Gradle 任务名是缩写：任务名支持驼峰式命名风格的任务名缩写，比如：connectTask 简写为：cT，执行任务：`gradle cT`

拓展 1：

Gradle 命令的本质：一个个的`task [任务]`，Gradle 中的所有操作都是基于任务完成的

![20241002201518](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20241002201518.png)

拓展 2：

Gradle 默认命令之间项目的依赖关系

![20241002201524](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20241002201524.png)

#### 定义方式
总共分为两大类：一种是通过 Project 中的`task()`方法，另一种是通过 tasks 对象的`create`或者`register`方法

```groovy
//任务名称,闭包都作为参数
task('A',{ 
    println "taskA..."
})
//闭包作为最后一个参数可以直接从括号中拿出来
task('B'){
    println "taskB..."
}
//groovy语法支持省略方法括号:上面三种本质是一种
task C{
    println "taskC..."
}
def map = new HashMap<String,Object>(); 
//action属性可以设置为闭包task(map,"D");
map.put("action",{ println "taskD.." }) 
//使用tasks的create方法
tasks.create('E'){
    println "taskE.."
}
//注：register执行的是延迟创建。也即只有当task被需要使用的时候才会被创建
tasks.register('f'){ 
    println "taskF	"
}
```

也可以在定义任务的同时指定任务的属性，具体的属性有：

![20241002201532](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20241002201532.png)

也可以给已有的任务动态的分配属性：

```groovy
// F是任务名，前面通过具名参数给map的属性赋值,以参数方式指定任务的属性信息
task(group: "atguigu",description: "this is task B","F")
// H是任务名，定义任务的同时，在内部直接指定属性信息
task("H") {
    group("atguigu") 
    description("this is the task H")
}
// Y是任务名，给已有的任务 在外部直接指定属性信息
task "y"{}
y.group="atguigu"
// 给已有的clean任务重新指定组信息
clean.group("atguigu") 
```

可以在 Idea 中看到：上面自定义的那几个任务和 gradle 自带的 clean 任务已经跑到：atguigu 组了

![20241002201540](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20241002201540.png)

#### 任务类型

之前定义的 Task 都是 DefaultTask 类型的，当要完成某些具体的操作时，需要手动编写 Groovy 脚本，Gradle 提供了一些现成的任务类型来快速完成想要的任务，只需要在创建任务的时候指定任务的类型就行，就可以使用这种类型中的属性和 API 方法了

| 常见任务类型 | 该类型任务的作用 |
| --- | --- |
| Delete | 删除文件或目录 |
| Copy | 将文件复制到目标目录中。此任务还可以在复制时重命名和筛选文件。 |
| CreateStartScripts | 创建启动脚本 |
| Exec | 执行命令行进程 |
| GenerateMavenPom | 生成 Maven 模块描述符(POM)文件。 |
| GradleBuild | 执行 Gradle 构建 |
| Jar | 组装 JAR 归档文件 |
| JavaCompile | 编译 Java 源文件 |
| Javadoc | 为 Java 类 生 成 HTML API 文 档 |
| PublishToMavenRepository | 将 MavenPublication  发布到 mavenartifactrepostal。 |
| Tar | 组装 TAR 存档文件 |
| Test | 执行 JUnit (3.8.x、4.x 或 5.x)或 TestNG 测试。 |
| Upload | 将 Configuration 的构件上传到一组存储库。 |
| War | 组装 WAR 档案。 |
| Zip | 组装 ZIP 归档文件。默认是压缩 ZIP 的内容。 |


自定义 Task 类型：

```groovy
def myTask = task MyDefinitionTask (type: CustomTask) 
myTask.doFirst(){
    println "task 执行之前 执行的 doFirst方法"
}
myTask.doLast(){
    println "task 执行之后 执行的 doLast方法"
}
class CustomTask extends DefaultTask {
    // @TaskAction表示Task本身要执行的方法
    @TaskAction
    def doSelf(){
        println "Task 自身 在执行的in doSelf"
    }
}
```

测试：`gradle myDefinitionTask`

![20241002201551](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20241002201551.png)

#### 任务执行顺序

在 Gradle 中，有三种方式可以指定 Task 的执行顺序：

1. dependsOn 强依赖方式
2. 通过 Task 输入输出
3. 通过 API 指定执行顺序

#### 动态分配任务

Gradle 可以在循环中注册同一类型的多个任务：

```groovy
4.times { counter -> tasks.register("task$counter") {
        doLast {
            println "I'm task number $counter"
        }
    }
}
```

一旦注册了任务，就可以通过 API 访问到他们，例如，**可以使用它在运行时动态的向任务添加依赖项**

```groovy
4.times { counter -> tasks.register("task$counter") {
        doLast {
            println "I'm task number $counter"
        }
    }
}
tasks.named('task0') { dependsOn('task2', 'task3') }
```

构建了 4 个任务，但是任务 0 依赖于任务 2 和 3，所以执行任务 0 之前要先加载任务 2 和 3

![20241002201604](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20241002201604.png)

#### 任务的开启与关闭

每个任务都有一个`enabled`默认为 true 的标记，将其设置为 false 阻止执行任何任务动作，禁用的任务将标记为“跳过”

```groovy
task disableMe {
    doLast {
        println 'This task is Executing...'
    }
    enabled(true)//直接设置任务开启，默认值为true
}
// disableMe.enabled = false //设置关闭任务
```

#### 任务的超时

每个任务都有一个 timeout 可用于限制其执行时间的属性，当任务超时，其任务执行线程会被中断。该任务被标记为失败，后续其他任务也不会执行，如果使用`--continue`参数，其他任务可以在此之后继续运行



```groovy
task a() {
    doLast {
        Thread.sleep(1000)
        println "当前任务a执行了"
    }
    timeout = Duration.ofMillis(500)
}
task b() {
    doLast {
        println "当前任务b执行了"
    }
}
```

执行`gradle a b`，会发现任务 a 执行超时后，抛出异常，不会再向下执行

执行`gradle a b --continue`，任务 a 虽然执行失败了，但是 b 还是执行了

#### 任务的查找

常用的任务查找方式如下：

```groovy
task atguigu {
    doLast {
        println "让天下没有难学的技术：尚硅谷"
    }
}

//根据任务名查找
tasks.findByName("atguigu").doFirst({println "尚硅谷校区1：北京	"})
tasks.getByName("atguigu").doFirst({println "尚硅谷校区2：深圳	"})

//根据任务路径查找【相对路径】
tasks.findByPath(":atguigu").doFirst({println "尚硅谷校区3：上海		"}) 
tasks.getByPath(":atguigu").doFirst({println "尚硅谷校区4：武汉	"})

// 执行task: gradle atguigu，输出结果如下所示：
// 尚硅谷校区4：武汉....
// 尚硅谷校区3：上海....
// 尚硅谷校区2：深圳....
// 尚硅谷校区1：北京....
// 让天下没有难学的技术：尚硅谷
```

#### 任务的规则

当执行/依赖一个不存在的任务时，Gradle 会执行失败，报错误信息，现在要对其进行改造，当执行一个不存在的任务时，不报错只是打印错误信息：

```groovy
task hello {
    doLast {
        println 'hello 尚硅谷的粉丝们'
    }
}

tasks.addRule("对该规则的一个描述，便于调试、查看等"){ String taskName -> task(taskName) {
        doLast {
            println "该${taskName}任务不存在，请查证后再执行"
        }
    }
}
```

执行`gradle abc hello`后，打印：该任务不存在。任务 hello 还是会继续执行

#### onlyif断言

断言就是一个条件表达式，Task 有一个 onlyif 方法，它接受一个闭包作为参数，如果该闭包返回 true 则该任务执行，否则跳过

作用：控制程序哪些情况下打什么包，什么时候执行单元测试，什么情况下执行单元测试的时候不执行网络测试等

例子：

```groovy
task hello {
    doLast {
        println 'hello 尚硅谷的粉丝们'
    }
}

hello.onlyIf { !project.hasProperty('fensi') }
```

测试：通过`-P`为 Project 添加 fensi 属性

`gradle hello -Pfensi`

#### 默认任务

Gradle 允许定义一个或多个在没有指定其他任务时执行的默认任务，代码如下所示：

```groovy
defaultTasks 'myClean', 'myRun' 
tasks.register('myClean'){
    doLast {
        println 'Default Cleaning!'
    }
}
tasks.register('myRun') { 
    doLast {
        println 'Default Running!'
    }
}
tasks.register('other') { 
    doLast {
        println "I'm not a default task!"
    }
}
```

### 文件操作

常见的文件操作方式：

+ 本地文件
+ 文件集合
+ 文件树
+ 文件拷贝
+ 归档文件

#### 本地文件

使用`Project.file(java.lang.Object)`方法，通过指定文件的相对路径或绝对路径来对文件操作，其中相对路径为相对当前 Project （根 Project 或者子 Porject）的目录，其实使用这个方法创建的 File 对象就是 Java 中的 File 对象，跟在 Java 中使用一样

示例代码如下：

```groovy
// 使用相对路径
File configFile = file('src/conf.xml')
configFile.createNewFile();
// 使用绝对路径
configFile = file('D:\\conf.xml')
println(configFile.createNewFile())
// 使用一个文件对象
configFile = new File('src/config.xml')
println(configFile.exists())
```

#### 文件集合

文件集合就是一组文件的列表，在 Gradle 中，文件集合用 FileCollection 接口表示，使用`Project.files(java.lang.Object[])`方法来获得一个文件的集合对象，如下代码创建一个 FileCollection 实例：

```groovy
def collection = files('src/test1.txt', new File('src/test2.txt'), ['src/test3.txt', 'src/test4.txt']) 
collection.forEach(){File it ->
    it.createNewFile() //创建该文件
    println it.name //输出文件名
}
Set set1 = collection.files // 把文件集合转换为java中的Set类型
Set set2 = collection as Set
List list = collection as List//  把文件集合转换为java中的List类型
for (item in list) { 
    println item.name
}
def union = collection + files('src/test5.txt') // 添加或者删除一个集合
def minus = collection - files('src/test3.txt') 
union.forEach(){
    File it -> println it.name
}
```

文件集合可以遍历，也可以把它转换为 Java 类型，同时也能使用`+`来添加一个集合，或使用`-`来删除集合

#### 文件树

文件树是有层次结构的文件集合，一个文件树可以代表一个目录结构或一 ZIP 压缩包中的内容结构，文件树是从文件集合继承过来的，所以文件树有文件集合所有的功能

可以使用`Project.fileTree(java.util.Map)`方法来创建文件树对象，还可以使用过滤条件来包含或排除相关文件。示例代码：

```groovy
// 第一种方式:使用路径创建文件树对象，同时指定包含的文件
tree = fileTree('src/main').include('**/*.java')
//第二种方式:通过闭包创建文件树:
tree = fileTree('src/main') {
    include '**/*.java'
}
//第三种方式:通过路径和闭包创建文件树：具名参数给map传值
tree = fileTree(dir: 'src/main', include: '**/*.java') 
tree = fileTree(dir: 'src/main', includes: ['**/*.java', '**/*.xml', '**/*.txt'], exclude: '**/*test*/**')
// 遍历文件树的所有文件
tree.each {File file -> 
    println file 
    println file.name
}
```

#### 文件拷贝

使用 Copy 任务来拷贝文件，通过它可以过滤指定拷贝文件内容，还能对文件进行重命名操作等

Copy 任务必须指定一组需要拷贝的文件和拷贝到的目录，使用`CoptSpec.from(java.lang.Object[])`方法来指定原文件，使用`CopySpec.into(java.lang.Object)`方法指定目标目录

示例代码如下：

```groovy
task copyTask(type: Copy) { 
    from 'src/main/resources' 
    into 'build/config'
}
```

`from()`方法接受的参数和文件集合时`files()`一样：

+ 当参数为一个目录时，该目录下所有的文件都会被拷贝到指定目录下（目录本身不会被拷贝）
+ 当参数为一个文件时，该文件会被拷贝到指定目录
+ 如果参数指定的文件不存在，就会被忽略
+ 当参数为一个 ZIP 压缩文件，该文件的压缩内容会被拷贝到指定目录

`into()`方法接受的参数与本地文件时`file()`一样

示例代码如下：

```groovy
task copyTask(type: Copy) {
    // 拷贝src/main/webapp目录下所有的文件
    from 'src/main/webapp'
    // 拷贝单独的一个文件
    from 'src/staging/index.html'
    // 从Zip压缩文件中拷贝内容
    from zipTree('src/main/assets.zip')
    // 拷贝到的目标目录
    into 'build/explodedWar'
}
```

在拷贝文件的时候还可以添加过滤条件来指定包含或排除的文件，示例如下：

```groovy
task copyTaskWithPatterns(type: Copy) { 
    from 'src/main/webapp'
    into 'build/explodedWar' 
    include '**/*.html' 
    include '**/*.jsp'
    exclude { details -> details.file.name.endsWith('.html') }
}
```

在拷贝文件的时候还可以对文件进行重命名操作，示例如下：

```groovy
task rename(type: Copy) { 
    from 'src/main/webapp' 
    into 'build/explodedWar'
    // 使用一个闭包方式重命名文件
    rename { 
        String fileName -> fileName.replace('-staging-', '')
    }
}
```

除了使用 Copy 任务来完成拷贝功能外，还可以使用`Project.copy(org.gradle.api.Action)`方法，代码示例：

```groovy
task copyMethod { 
    doLast {
        copy {
            from 'src/main/webapp' 
            into 'build/explodedWar' 
            include '**/*.html' 
            include '**/*.jsp'
        }
    }
}
```

或者使用 Project 对象的 copy 方法：

```groovy
copy {
    //相对路径或者绝对路径
    from file('src/main/resources/ddd.txt') //file也可以换成new File()
    into this.buildDir.absolutePath
}
```

#### 归档文件

通常一个项目会有很多 jar 包，我们希望把项目打包成一个 WAR、ZIP 或 TAR 包进行发布，可以使用 WAR、TAR、ZIP、JAR 任务来实现，以 ZIP 任务为例：

```groovy
apply plugin: 'java' version=1.0
task myZip(type: Zip) { 
    from 'src/main‘
    into ‘build’ //保存到build目录中
    baseName = 'myGame'
}
println myZip.archiveName
```

执行：`gradle -q myZip`，输出：`myGame-1.0.zip`

可以使用`Project.zipTree(java.lang.Object)`和`Project.tarTree(java.lang.Object)`方法来创建访问 ZIP 压缩包的文件树对象，示例代码如下：

```groovy
// 使用zipTree
FileTree zip = zipTree('someFile.zip')
// 使用tarTree
FileTree tar = tarTree('someFile.tar')
```

### Dependencies

#### 依赖的方式

Gradle 中的依赖分为：直接依赖、项目依赖、本地 jar 包依赖

例如：

```groovy
dependencies {
    // 依赖当前项目下的某个模块[子工程]
    implementation project(':subject01')
    // 直接依赖本地的某个jar文件
    implementation files('libs/foo.jar', 'libs/bar.jar')
    // 配置某文件夹作为依赖项
    implementation fileTree(dir: 'libs', include: ['*.jar'])
    // 直接依赖
    implementation 'org.apache.logging.log4j:log4j:2.17.2'
}
```

**直接依赖**：在项目中直接导入的依赖，就是直接依赖

`implementation 'org.apache.logging.log4j:log4j:2.17.2'`是简写版

完整版写法如下：

```groovy
implementation group: 'org.apache.logging.log4j', name: 'log4j', version: '2.17.2'
```

group/name/version 共同定位一个远程仓库,version 最好写一个固定的版本号，以防构建出问题

> 执行 build 命令的时候，Gradle 就会去配置的依赖仓库中下载对应的 jar，并应用到项目中
>

#### 依赖的类型

类似于 Maven 的 scope 标签，gradle 也提供了依赖的类型,具体如下所示:

| compileOnly | <font style="color:rgb(68, 113, 196);">由java插件</font>提供,<font style="color:rgb(68, 113, 196);">曾短暂的叫provided</font>,后续版本已经改成了compileOnly,适用于编译期需要而不需要打包的情<br/>况 |
| --- | --- |
| runtimeOnly | <font style="color:rgb(68, 113, 196);">由 java 插件</font>提供,只在运行期有效,编译时不需要,<font style="color:rgb(255, 0, 0);">比如mysql 驱动包</font>。<font style="color:rgb(255, 0, 0);">,取代老版本中被移除的 runtime</font> |
| implementation | <font style="color:rgb(68, 113, 196);">由 java 插件</font>提供,<font style="color:rgb(255, 0, 0);">针对源码[src/main 目录] </font>,在编译、运行时都有效,<font style="color:rgb(255, 0, 0);">取代老版本中被移除的 compile</font> |
| testCompileOnly | <font style="color:rgb(68, 113, 196);">由 java 插件</font>提供,用于编译测试的依赖项，运行时不需要 |
| testRuntimeOnly | <font style="color:rgb(68, 113, 196);">由 java 插件</font>提供,只在测试运行时需要，而不是在测试编译时需要,<font style="color:rgb(255, 0, 0);">取代老版本中被移除的testRuntime</font> |
| **testImplementation** | <font style="color:rgb(68, 113, 196);">由 java 插件</font>提供,针对测试代码[src/test 目录] 取代老版本中被移除的testCompile |
| **providedCompile** | <font style="color:rgb(255, 0, 0);">war 插件提</font>供支持，编译、测试阶段代码需要依赖此类jar 包，而运行阶段容器已经提供了相应的支持，所<br/>以无需将这些文件打入到war 包中了;<font style="color:rgb(255, 0, 0);">例如servlet-api.jar、jsp-api.jar</font> |
| <font style="color:rgb(0, 175, 80);">compile</font> | 编译范围依赖在所有的 classpath 中可用，同时它们也会被打包。<font style="color:rgb(255, 0, 0);">在gradle 7.0 已经移除</font> |
| <font style="color:rgb(0, 175, 80);">runtime</font> | runtime 依赖在运行和测试系统的时候需要,在编译的时候不需要,比如mysql 驱动包。<font style="color:rgb(255, 0, 0);">在 gradle 7.0 已经移除</font> |
| **<font style="color:rgb(68, 113, 196);">api</font>** | <font style="color:rgb(255, 0, 0);">java-library 插件</font>提供支持,这些依赖项可以传递性地导出给使用者，用于编译时和运行时。取代老版本中被<br/>移除的 compile |
| <font style="color:rgb(91, 155, 212);">compileOnlyApi</font> | <font style="color:rgb(255, 0, 0);">java-library 插件</font>提供支持,在声明模块和使用者在编译时需要的依赖项，但在运行时不需要。 |


#### api和implementation区别

![20241002201654](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20241002201654.png)

![20241002201659](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20241002201659.png)

**使用 api**

编译时：如果 libC 的内容发生了变化，犹豫使用的是 api 依赖，依赖会传递，所以 libC、libA、ProjectX 都要发生变化，都需要重新编译，速度慢

运行时：libC、libA、projectX 中的 class 都要被重新加载

**使用 implementation**

编译时：如果 libD 的内容发生变化，由于使用的是 implementation 依赖，依赖不会传递，只有 libD、libB 要变化并重新编译，速度快

运行时：libC、libA、projectX 中的 class 要被重新加载

#### 案例分析

![20241002201708](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20241002201708.png)

api 方式的适用场景是多 module 依赖，moduleA 工程依赖了 module B，同时module B 又需要依赖了 module C，modelA 工程也需要去依赖 module C,这个时候避免重复依赖module,可以使用 module B api  依赖的方式去依赖module C,modelA 工程只需要依赖 moduleB 即可

总之，除非涉及到多模块依赖，为了避免重复依赖的时候会使用 api 方式，其他情况优先**选择 implementation**，有大量 api 依赖项会显著增加构建时间

#### 依赖冲突和解决方案

依赖冲突：在编译过程中，如果存在某个依赖的多个版本，构建系统应该选择哪个进行构建的问题

如下图所示：

![20241002201716](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20241002201716.png)

A、B、C 都是本地子项目 module，log4j 是远程依赖

编译时：B 用 1.4.2 版本的 log4j，C 用 2.2.4 版本的 log4j，B 和 C 之间没有冲突

打包时：只能有一个版本的代码最终打包进最终的 A 对应的 jar 包，这里对于 Gradle 来说就有冲突了



**案例演示：**

在`build.gradle`中引入依赖库

```groovy
dependencies {
    testImplementation 'org.junit.jupiter:junit-jupiter-api:5.8.1' 
    testRuntimeOnly 'org.junit.jupiter:junit-jupiter-engine:5.8.1' 
    implementation 'org.hibernate:hibernate-core:3.6.3.Final'
}
```

![20241002201723](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20241002201723.png)

修改`build.gradle`

```groovy
dependencies {
    testImplementation 'org.junit.jupiter:junit-jupiter-api:5.8.1' 
    testRuntimeOnly 'org.junit.jupiter:junit-jupiter-engine:5.8.1' 
    implementation 'org.hibernate:hibernate-core:3.6.3.Final' 
    implementation 'org.slf4j:slf4j-api:1.4.0'
}
```

![20241002201730](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20241002201730.png)

如上所示，默认情况在，Gradle 会使用最新版本的 jar 包（考虑到新版本一般是向下兼容的）。实际开发中建议使用官方的解决方案：

+ exclude ：移除一个依赖
+ 不允许依赖传递
+ 强制使用某个版本

**Exclude 排除某个依赖**

```groovy
dependencies {
    testImplementation 'org.junit.jupiter:junit-jupiter-api:5.8.1' 
    testRuntimeOnly 'org.junit.jupiter:junit-jupiter-engine:5.8.1' 
    implementation('org.hibernate:hibernate-core:3.6.3.Final'){
        //排除某一个库(slf4j)依赖:如下三种写法都行
        exclude group: 'org.slf4j' 
        exclude module: 'slf4j-api'
        exclude group: 'org.slf4j', module: 'slf4j-api'
    }
    //排除之后,使用手动的引入即可
    implementation 'org.slf4j:slf4j-api:1.4.0'
}
```

**不允许依赖传递**

```groovy
dependencies {
    testImplementation 'org.junit.jupiter:junit-jupiter-api:5.8.1' 
    testRuntimeOnly 'org.junit.jupiter:junit-jupiter-engine:5.8.1' 
    implementation('org.hibernate:hibernate-core:3.6.3.Final'){
        //不允许依赖传递，一般不用
        transitive(false)
    }
    //排除之后,使用手动的引入即可
    implementation 'org.slf4j:slf4j-api:1.4.0'
}
```

添加依赖项时，设置 rtansitive 为 false，表示关闭依赖传递，即内部所有依赖将不会添加到编译和运行时的类路径

**强制使用某个版本**

```groovy
dependencies {
    testImplementation 'org.junit.jupiter:junit-jupiter-api:5.8.1' 
    testRuntimeOnly 'org.junit.jupiter:junit-jupiter-engine:5.8.1' 
    implementation('org.hibernate:hibernate-core:3.6.3.Final')
    //强制使用某个版本!!【官方建议使用这种方式】
    implementation('org.slf4j:slf4j-api:1.4.0!!')
    //这种效果和上面那种一样,强制指定某个版本
    implementation('org.slf4j:slf4j-api:1.4.0'){
        version{
            strictly("1.4.0")
        }
    }
}
```


提示：先查看当前项目中，有哪些依赖冲突

```groovy
//下面配置，当 Gradle 构建遇到依赖冲突时，就立即构建失败
configurations.all() {
    //当遇到版本冲突时直接构建失败
    Configuration configuration -> configuration.resolutionStrategy.failOnVersionConflict()
}
```

