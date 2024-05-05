---
id: spring
slug: /spring
title: Spring
date: 2024-05-05
tags: [Spring Framework, IOC, Bean, AOP, 声明式事务]
keywords: [Spring Framework, IOC, Bean, AOP, 声明式事务]
---

## 概述

### Spring Framework

Spring 基础框架，可以视为 Spring 基础设施，基本上任何其他 Spring 项目都是以 Spring Framework为基础的

### Spring Framework 特性

- 非侵入式：使用 Spring Framework 开发应用程序时，Spring 对应用程序本身的结构影响非常小。对领域模型可以做到零污染；对功能性组件也只需要使用几个简单的注解进行标记，完全不会破坏原有结构，反而能将组件结构进一步简化。这就使得基于 Spring Framework 开发应用程序时结构清晰、简洁优雅
- 控制反转：IOC（Inversion of Control），翻转资源获取方向。把自己创建资源、向环境索取资源变成环境将资源准备好，我们享受资源注入
- 面向切面编程：AOP（Aspect Oriented Programming），在不修改源代码的基础上增强代码功能
- 容器：Spring IOC 是一个容器，因为它包含并且管理组件对象的生命周期。组件享受到了容器化的管理，替程序员屏蔽了组件创建过程中的大量细节，极大的降低了使用门槛，大幅度提高了开发效率
- 组件化：Spring 实现了使用简单的组件配置组合成一个复杂的应用。在 Spring 中可以使用 XML和 Java 注解组合这些对象。这使得我们可以基于一个个功能明确、边界清晰的组件有条不紊的搭建超大型复杂应用系统
- 声明式：很多以前需要编写代码才能实现的功能，现在只需要声明需求即可由框架代为实现
- 一站式：在 IOC 和 AOP 的基础上可以整合各种企业应用的开源框架和优秀的第三方类库。而且Spring 旗下的项目已经覆盖了广泛领域，很多方面的功能性需求可以在 Spring Framework 的基础上全部使用 Spring 来实现

### Spring Framework 五大功能模块

| **功能模块** | **功能介绍** |
| --- | --- |
| Core Container | 核心容器，在 Spring 环境下使用任何功能都必须基于 IOC 容器。 |
| AOP&Aspects | 面向切面编程 |
| Testing | 提供了对 junit 或 TestNG 测试框架的整合。 |
| Data Access/Integration | 提供了对数据访问/集成的功能。 |
| Spring MVC | 提供了面向Web应用程序的集成功能。 |

## IOC

### IOC容器

#### IOC思想

IOC：Inversion of Control，控制反转

**获取资源的传统方式**

在应用程序中的组件需要获取资源时，传统的方式是组件**主动**的从容器中获取所需要的资源，在这样的模式下开发人员往往需要知道在具体容器中特定资源的获取方式，增加了学习成本，同时降低了开发效率

**控制反转方式获取资源**

反转控制的思想完全颠覆了应用程序组件获取资源的传统方式：反转了资源的获取方向——改由容器主动的将资源推送给需要的组件，开发人员不需要知道容器是如何创建资源对象的，只需要提供接收资源的方式即可，极大的降低了学习成本，提高了开发的效率。这种行为也称为查找的**被动**形式

**DI**
DI：Dependency Injection，依赖注入
DI 是 IOC 的另一种表述方式：即组件以一些预先定义好的方式（例如：setter 方法）接受来自于容器的资源注入。相对于IOC而言，这种表述更直接。

所以结论是：IOC 就是一种反转控制的思想， 而 DI 是对 IOC 的一种具体实现

#### IOC容器在Spring中的实现

Spring 的 IOC 容器就是 IOC 思想的一个落地的产品实现。IOC 容器中管理的组件也叫做 bean。在创建bean 之前，首先需要创建 IOC 容器。Spring 提供了 IOC 容器的两种实现方式：

**BeanFactory**

这是 IOC 容器的基本实现，是 Spring 内部使用的接口。面向 Spring 本身，不提供给开发人员使用

**ApplicationContext**

BeanFactory 的子接口，提供了更多高级特性。面向 Spring 的使用者，几乎所有场合都使用 ApplicationContext 而不是底层的  BeanFactory

**ApplicationContext的主要实现类**

![20240505222622](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240505222622.png)

| **类型名** | **简介** |
| --- | --- |
| ClassPathXmlApplicationContext | 通过读取类路径下的 XML 格式的配置文件创建 IOC 容器对象 |
| FileSystemXmlApplicationContext | 通过文件系统路径读取 XML 格式的配置文件创建 IOC 容器对象 |
| ConfigurableApplicationContext | ApplicationContext 的子接口，包含一些扩展方法refresh() 和 close() ，让 ApplicationContext 具有启动、关闭和刷新上下文的能力。 |
| WebApplicationContext | 专门为 Web 应用准备，基于 Web 环境创建 IOC 容器对象，并将对象引入存入 ServletContext 域中。 |

### 基于XML管理Bean

#### 入门案例

1、创建 Maven Module

2、引入依赖

```xml
<dependencies>
    <!-- 基于Maven依赖传递性，导入spring-context依赖即可导入当前所需所有jar包 -->
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context</artifactId>
        <version>5.3.1</version>
    </dependency>
    <!-- junit测试 -->
    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.12</version>
        <scope>test</scope>
    </dependency>
</dependencies>
```

引入依赖成功

![20240505222704](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240505222704.png)

3、创建类 HelloWorld

```java
public class HelloWorld {
    public void sayHello(){
        System.out.println("helloworld");
    }
}
```

4、创建配置文件

![20240505222818](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240505222818.png)

![20240505222838](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240505222838.png)

5、在配置文件中配置Bean

```xml
<!--
	配置HelloWorld所对应的bean，即将HelloWorld的对象交给Spring的IOC容器管理
	通过bean标签配置IOC容器所管理的bean
	属性：
		id：设置bean的唯一标识
		class：设置bean所对应类型的全类名
-->
<bean id="helloworld" class="com.atguigu.spring.bean.HelloWorld"></bean>
```

6、创建测试类测试

```java
@Test
public void testHelloWorld(){
    ApplicationContext ac = new ClassPathXmlApplicationContext("applicationContext.xml");
    HelloWorld helloworld = (HelloWorld) ac.getBean("helloworld");
    helloworld.sayHello();
}
```

7、思路

![20240505223034](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240505223034.png)

8、注意

Spring 底层默认通过反射技术调用组件类的无参构造器来创建组件对象，这一点需要注意。如果在需要无参构造器时，没有无参构造器，则会抛出下面的异常：

```java
org.springframework.beans.factory.BeanCreationException: Error creating bean with name

'helloworld' defined in class path resource [applicationContext.xml]: Instantiation of bean

failed; nested exception is org.springframework.beans.BeanInstantiationException: Failed

to instantiate [xyz.kbws.ioc.HelloWorld]: No default constructor found; nested

exception is java.lang.NoSuchMethodException: com.atguigu.spring.bean.HelloWorld.

<init>()
```

#### 获取Bean

##### 根据id获取

由于 id 属性指定了 bean 的唯一标识，所以根据 bean 标签的 id 属性可以精确获取到一个组件对象

上面案例中使用的就是这种方式

##### 根据类型获取

```java
@Test
public void testHelloWorld(){
    ApplicationContext ac = new ClassPathXmlApplicationContext("applicationContext.xml");
    HelloWorld bean = ac.getBean(HelloWorld.class);
    bean.sayHello();
}
```

##### 根据id和类型

```java
@Test
public void testHelloWorld(){
    ApplicationContext ac = new ClassPathXmlApplicationContext("applicationContext.xml");
    HelloWorld bean = ac.getBean("helloworld", HelloWorld.class);
    bean.sayHello();
}
```

##### 注意

当根据类型获取bean时，要求IOC容器中指定类型的bean有且只能有一个

当IOC容器中一共配置了两个：

```xml
<bean id="helloworldOne" class="com.atguigu.spring.bean.HelloWorld"></bean>
<bean id="helloworldTwo" class="com.atguigu.spring.bean.HelloWorld"></bean>
```

根据类型获取时会抛出异常：

```xml
org.springframework.beans.factory.NoUniqueBeanDefinitionException: No qualifying bean

of type 'xyz.kbws.ioc.HelloWorld' available: expected single matching bean but

found 2: helloworldOne,helloworldTwo
```

##### 扩展

如果组件类实现了接口，根据接口类型可以获取 bean 吗
> 可以，前提是bean唯一

如果一个接口有多个实现类，这些实现类都配置了 bean，根据接口类型可以获取 bean 吗？
> 不行，因为bean不唯一

##### 结论

根据类型来获取bean时，在满足bean唯一性的前提下，其实只是看：『对象 **instanceof** 指定的类型』的返回结果，只要返回的是true就可以认定为和类型匹配，能够获取到

#### 依赖注入

##### setter注入

1、创建学生类 Student

```java
public class Student {
    private Integer id;
    private String name;
    private Integer age;
    private String sex;
    public Student() {
    }
    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public Integer getAge() {
        return age;
    }
    public void setAge(Integer age) {
        this.age = age;
    }
    public String getSex() {
        return sex;
    }
    public void setSex(String sex) {
        this.sex = sex;
    }
    @Override
    public String toString() {
        return "Student{" +
            "id=" + id +
            ", name='" + name + '\'' +
            ", age=" + age +
            ", sex='" + sex + '\'' +
            '}';
    }
}
```

2、配置Bean时为属性赋值

```xml
<bean id="studentOne" class="com.atguigu.spring.bean.Student">
    <!-- property标签：通过组件类的setXxx()方法给组件对象设置属性 -->
    <!-- name属性：指定属性名（这个属性名是getXxx()、setXxx()方法定义的，和成员变量无关）-->
    <!-- value属性：指定属性值 -->
    <property name="id" value="1001"></property>
    <property name="name" value="张三"></property>
    <property name="age" value="23"></property>
    <property name="sex" value="男"></property>
</bean>
```

3、测试

```java
@Test
public void testDIBySet() {
    ApplicationContext ac = new ClassPathXmlApplicationContext("applicationContext.xml");
    Student student = ac.getBean("studentOne", Student.class);
    System.out.println(student);
}
```

##### 构造器注入

1、在 Student 类中添加有参构造

```java
public Student(Integer id, String name, Integer age, String sex) {
    this.id = id;
    this.name = name;
    this.age = age;
    this.sex = sex;
}
```

2、配置Bean

```xml
<bean id="studentTwo" class="com.atguigu.spring.bean.Student">
    <constructor-arg value="1002"></constructor-arg>
    <constructor-arg value="李四"></constructor-arg>
    <constructor-arg value="33"></constructor-arg>
    <constructor-arg value="女"></constructor-arg>
</bean>
```

注意：

constructor-arg标签还有两个属性可以进一步描述构造器参数：

- index属性：指定参数所在位置的索引（从0开始）
- name属性：指定参数名

3、测试

```java
@Test
public void testDIBySet(){
    ApplicationContext ac = new ClassPathXmlApplicationContext("springdi.xml");
    Student studentOne = ac.getBean("studentTwo", Student.class);
    System.out.println(studentOne);
}
```

#### 特殊值处理

##### 字面量赋值

> 什么是字面量？
> int a = 10;
> 声明一个变量a，初始化为10，此时a就不代表字母a了，而是作为一个变量的名字。当我们引用a
> 的时候，我们实际上拿到的值是10。
> 而如果a是带引号的：'a'，那么它现在不是一个变量，它就是代表a这个字母本身，这就是字面
> 量。所以字面量没有引申含义，就是我们看到的这个数据本身。

```xml
<!-- 使用value属性给bean的属性赋值时，Spring会把value属性的值看做字面量 -->
<property name="name" value="张三"/>
```

##### null值

```xml
<property name="name">
	<null />
</property>
```

注意：

```xml
<property name="name" value="null"></property>
```

以上写法，为 name 所赋的值是字符串 null

##### xml实体

```xml
<!-- 小于号在XML文档中用来定义标签的开始，不能随便使用 -->
<!-- 解决方案一：使用XML实体来代替 -->
<property name="expression" value="a &lt; b"/>
```

##### CDATA节

```xml
<property name="expression">
    <!-- 解决方案二：使用CDATA节 -->
    <!-- CDATA中的C代表Character，是文本、字符的含义，CDATA就表示纯文本数据 -->
    <!-- XML解析器看到CDATA节就知道这里是纯文本，就不会当作XML标签或属性来解析 -->
    <!-- 所以CDATA节中写什么符号都随意 -->
    <value><![CDATA[a < b]]></value>
</property>
```

#### 为类类型属性赋值

1、创建班级类Clazz

```java
public class Clazz {
    private Integer clazzId;
    private String clazzName;
    public Integer getClazzId() {
        return clazzId;
    }
    public void setClazzId(Integer clazzId) {
        this.clazzId = clazzId;
    }
    public String getClazzName() {
        return clazzName;
    }
    public void setClazzName(String clazzName) {
        this.clazzName = clazzName;
    }
    @Override
    public String toString() {
        return "Clazz{" +
            "clazzId=" + clazzId +
            ", clazzName='" + clazzName + '\'' +
            '}';
    }
    public Clazz() {
    }
    public Clazz(Integer clazzId, String clazzName) {
        this.clazzId = clazzId;
        this.clazzName = clazzName;
    }
}
```

2、修改Student类

```java
private Clazz clazz;
public Clazz getClazz() {
    return clazz;
}
public void setClazz(Clazz clazz) {
    this.clazz = clazz;
}
```

##### 引用外部已声明的Bean

配置 Clazz 类型的 Bean

```xml
<bean id="clazzOne" class="xyz.kbws.di.Clazz">
    <property name="clazzId" value="1111"></property>
    <property name="clazzName" value="财源滚滚班"></property>
</bean>
```

为 Student 中的 clazz 属性赋值

```java
<bean id="studentFour" class="xyz.kbws.di.Student">
    <property name="id" value="1004"></property>
    <property name="name" value="赵六"></property>
    <property name="age" value="26"></property>
    <property name="sex" value="女"></property>
    <!-- ref属性：引用IOC容器中某个bean的id，将所对应的bean为属性赋值 -->
    <property name="clazz" ref="clazzOne"></property>
</bean>
```

错误演示

```xml
<bean id="studentFour" class="com.atguigu.spring.bean.Student">
    <property name="id" value="1004"></property>
    <property name="name" value="赵六"></property>
    <property name="age" value="26"></property>
    <property name="sex" value="女"></property>
    <property name="clazz" value="clazzOne"></property>
</bean>
```

> 如果错把ref属性写成了value属性，会抛出异常： Caused by: java.lang.IllegalStateException:
> Cannot convert value of type 'java.lang.String' to required type
> 'com.atguigu.spring.bean.Clazz' for property 'clazz': no matching editors or conversion
> strategy found
> 意思是不能把String类型转换成我们要的Clazz类型，说明我们使用value属性时，Spring只把这个
> 属性看做一个普通的字符串，不会认为这是一个bean的id，更不会根据它去找到bean来赋值


##### 内部Bean

```xml
<bean id="studentFour" class="com.atguigu.spring.bean.Student">
    <property name="id" value="1004"></property>
    <property name="name" value="赵六"></property>
    <property name="age" value="26"></property>
    <property name="sex" value="女"></property>
    <property name="clazz">
        <!-- 在一个bean中再声明一个bean就是内部bean -->
        <!-- 内部bean只能用于给属性赋值，不能在外部通过IOC容器获取，因此可以省略id属性 -->
        <bean id="clazzInner" class="com.atguigu.spring.bean.Clazz">
            <property name="clazzId" value="2222"></property>
            <property name="clazzName" value="远大前程班"></property>
        </bean>
    </property>
</bean>
```

##### 级联属性赋值

```xml
<bean id="studentFour" class="com.atguigu.spring.bean.Student">
    <property name="id" value="1004"></property>
    <property name="name" value="赵六"></property>
    <property name="age" value="26"></property>
    <property name="sex" value="女"></property>
    <!-- 一定先引用某个bean为属性赋值，才可以使用级联方式更新属性 -->
    <property name="clazz" ref="clazzOne"></property>
    <property name="clazz.clazzId" value="3333"></property>
    <property name="clazz.clazzName" value="最强王者班"></property>
</bean>
```

#### 为数组类型属性赋值

1、修改 Student 类

```java
private String[] hobbies;
public String[] getHobbies() {
    return hobbies;
}
public void setHobbies(String[] hobbies) {
    this.hobbies = hobbies;
}
```

2、配置Bean

```xml
<bean id="studentFour" class="xyz.kbws.di.Student">
  <property name="id" value="1004"></property>
  <property name="name" value="赵六"></property>
  <property name="age" value="26"></property>
  <property name="sex" value="女"></property>
  <!-- ref属性：引用IOC容器中某个bean的id，将所对应的bean为属性赋值 -->
  <property name="clazz" ref="clazzOne"></property>
  <property name="hobbies">
    <array>
      <value>抽烟</value>
      <value>喝酒</value>
      <value>烫头</value>
    </array>
  </property>
</bean>
```
#### 为集合类型属性赋值

##### 为List集合类型属性赋值

在 Clazz 类中添加如下代码

```java
private List<Student> students;
public List<Student> getStudents() {
    return students;
}
public void setStudents(List<Student> students) {
    this.students = students;
}
```

配置 Bean：

```xml
<bean id="clazzTwo" class="com.atguigu.spring.bean.Clazz">
  <property name="clazzId" value="4444"></property>
  <property name="clazzName" value="Javaee0222"></property>
  <property name="students">
    <list>
      <ref bean="studentOne"></ref>
      <ref bean="studentTwo"></ref>
      <ref bean="studentThree"></ref>
    </list>
  </property>
</bean>
```
> 若为Set集合类型属性赋值，只需要将其中的list标签改为set标签即可

##### 为 Map 集合类型属性赋值

创建教室类 Teacher：

```java
public class Teacher {
    private Integer teacherId;
    private String teacherName;
    public Integer getTeacherId() {
        return teacherId;
    }
    public void setTeacherId(Integer teacherId) {
        this.teacherId = teacherId;
    }
    public String getTeacherName() {
        return teacherName;
    }
    public void setTeacherName(String teacherName) {
        this.teacherName = teacherName;
    }
    public Teacher(Integer teacherId, String teacherName) {
        this.teacherId = teacherId;
        this.teacherName = teacherName;
    }
    public Teacher() {
    }
    @Override
    public String toString() {
        return "Teacher{" +
            "teacherId=" + teacherId +
            ", teacherName='" + teacherName + '\'' +
            '}';
    }
}
```

在 Student 类下添加以下代码

```java
private Map<String, Teacher> teacherMap;
public Map<String, Teacher> getTeacherMap() {
    return teacherMap;
}
public void setTeacherMap(Map<String, Teacher> teacherMap) {
    this.teacherMap = teacherMap;
}
```

配置 Bean：

```xml
<bean id="teacherOne" class="com.atguigu.spring.bean.Teacher">
    <property name="teacherId" value="10010"></property>
    <property name="teacherName" value="大宝"></property>
</bean>
<bean id="teacherTwo" class="com.atguigu.spring.bean.Teacher">
    <property name="teacherId" value="10086"></property>
    <property name="teacherName" value="二宝"></property>
</bean>
<bean id="studentFour" class="com.atguigu.spring.bean.Student">
    <property name="id" value="1004"></property>
    <property name="name" value="赵六"></property>
    <property name="age" value="26"></property>
    <property name="sex" value="女"></property>
    <!-- ref属性：引用IOC容器中某个bean的id，将所对应的bean为属性赋值 -->
    <property name="clazz" ref="clazzOne"></property>
    <property name="hobbies">
        <array>
            <value>抽烟</value>
            <value>喝酒</value>
            <value>烫头</value>
        </array>
    </property>
    <property name="teacherMap">
        <map>
            <entry>
                <key>
                    <value>10010</value>
                </key>
                <ref bean="teacherOne"></ref>
            </entry>
            <entry>
                <key>
                    <value>10086</value>
                </key>
                <ref bean="teacherTwo"></ref>
            </entry>
        </map>
    </property>
</bean>
```

##### 引用集合类型的 Bean

```xml
<!--list集合类型的bean-->
<util:list id="students">
    <ref bean="studentOne"></ref>
    <ref bean="studentTwo"></ref>
    <ref bean="studentThree"></ref>
</util:list>
<!--map集合类型的bean-->
<util:map id="teacherMap">
    <entry>
        <key>
            <value>10010</value>
        </key>
        <ref bean="teacherOne"></ref>
    </entry>
    <entry>
        <key>
            <value>10086</value>
        </key>
        <ref bean="teacherTwo"></ref>
    </entry>
</util:map>
<bean id="clazzTwo" class="com.atguigu.spring.bean.Clazz">
    <property name="clazzId" value="4444"></property>
    <property name="clazzName" value="Javaee0222"></property>
    <property name="students" ref="students"></property>
</bean>
<bean id="studentFour" class="com.atguigu.spring.bean.Student">
    <property name="id" value="1004"></property>
    <property name="name" value="赵六"></property>
    <property name="age" value="26"></property>
    <property name="sex" value="女"></property>
    <!-- ref属性：引用IOC容器中某个bean的id，将所对应的bean为属性赋值 -->
    <property name="clazz" ref="clazzOne"></property>
    <property name="hobbies">
        <array>
            <value>抽烟</value>
            <value>喝酒</value>
            <value>烫头</value>
        </array>
    </property>
    <property name="teacherMap" ref="teacherMap"></property>
</bean>
```
> 使用util:list、util:map标签必须引入相应的命名空间，可以通过idea的提示功能选择

#### P命名空间

引入p命名空间后，可以通过以下方式为bean的各个属性赋值

```xml
<bean id="studentSix" class="com.atguigu.spring.bean.Student"
      p:id="1006" p:name="小明" p:clazz-ref="clazzOne" p:teacherMap-ref="teacherMap"></bean>
```

#### 引入外部属性文件

1、添加依赖

```xml
<!-- MySQL驱动 -->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.16</version>
</dependency>
<!-- 数据源 -->
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid</artifactId>
    <version>1.0.31</version>
</dependency>
```

2、创建外部属性文件

![20240505223251](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240505223251.png)

```xml
jdbc.user=root
jdbc.password=hsy031122
jdbc.url=jdbc:mysql://localhost:3306/my_db?serverTimezone=UTC
jdbc.driver=com.mysql.cj.jdbc.Driver
```

3、引入属性文件

```xml
<!-- 引入外部属性文件 -->
<context:property-placeholder location="classpath:jdbc.properties"/>
```

4、配置 Bean

```xml
<bean id="druidDataSource" class="com.alibaba.druid.pool.DruidDataSource">
    <property name="url" value="${jdbc.url}"/>
    <property name="driverClassName" value="${jdbc.driver}"/>
    <property name="username" value="${jdbc.user}"/>
    <property name="password" value="${jdbc.password}"/>
</bean>
```

5、测试

```java
@Test
public void testDataSource() throws SQLException {
    ApplicationContext ac = new ClassPathXmlApplicationContext("spring-datasource.xml");
    DataSource dataSource = ac.getBean(DataSource.class);
    Connection connection = dataSource.getConnection();
    System.out.println(connection);
}
```

#### Bean的作用域

**概念**

在Spring中可以通过配置bean标签的scope属性来指定bean的作用域范围，各取值含义参加下表：

| **取值** | **含义** | **创建对象的时机** |
| --- | --- | --- |
| singleton（默认） | 在IOC容器中，这个bean的对象始终为单实例 | IOC容器初始化时 |
| prototype | 这个bean在IOC容器中有多个实例 | 获取bean时 |

如果是在WebApplicationContext环境下还会有另外两个作用域（但不常用）：

| **取值** | **含义** |
| --- | --- |
| request | 在一个请求范围内有效 |
| session | 在一个会话范围内有效 |


**创建类User**

```java
public class User {
private Integer id;
private String username;
private String password;
private Integer age;
    public User() {
    }
    public User(Integer id, String username, String password, Integer age) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.age = age;
    }
    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public Integer getAge() {
        return age;
    }
    public void setAge(Integer age) {
        this.age = age;
    }
    @Override
    public String toString() {
        return "User{" +
            "id=" + id +
            ", username='" + username + '\'' +
            ", password='" + password + '\'' +
            ", age=" + age +
            '}';
    }
}
```

**配置Bean**

```xml
<!-- scope属性：取值singleton（默认值），bean在IOC容器中只有一个实例，IOC容器初始化时创建
对象 -->
<!-- scope属性：取值prototype，bean在IOC容器中可以有多个实例，getBean()时创建对象 -->
<bean class="com.atguigu.bean.User" scope="prototype"></bean>
```

**测试**

```java
@Test
public void testBeanScope(){
    ApplicationContext ac = new ClassPathXmlApplicationContext("spring-scope.xml");
    User user1 = ac.getBean(User.class);
    User user2 = ac.getBean(User.class);
    System.out.println(user1==user2);
}
```

#### Bean的生命周期

**具体的生命周期过程**

- bean对象创建（调用无参构造器）
- 给bean对象设置属性
- bean对象初始化之前操作（由bean的后置处理器负责）
- bean对象初始化（需在配置bean时指定初始化方法）
- bean对象初始化之后操作（由bean的后置处理器负责）
- bean对象就绪可以使用
- bean对象销毁（需在配置bean时指定销毁方法）
- IOC容器关闭

**修改类User**

```java
public class User {
    private Integer id;
    private String username;
    private String password;
    private Integer age;
    public User() {
        System.out.println("生命周期：1、创建对象");
    }
    public User(Integer id, String username, String password, Integer age) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.age = age;
    }
    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        System.out.println("生命周期：2、依赖注入");
        this.id = id;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public Integer getAge() {
        return age;
    }
    public void setAge(Integer age) {
        this.age = age;
    }
    public void initMethod(){
        System.out.println("生命周期：3、初始化");
    }
    public void destroyMethod(){
        System.out.println("生命周期：5、销毁");
    }
    @Override
    public String toString() {
        return "User{" +
            "id=" + id +
            ", username='" + username + '\'' +
            ", password='" + password + '\'' +
            ", age=" + age +
            '}';
    }
}
```
> 注意其中的initMethod()和destroyMethod()，可以通过配置bean指定为初始化和销毁的方法


**配置Bean**

```xml
<!-- 使用init-method属性指定初始化方法 -->
<!-- 使用destroy-method属性指定销毁方法 -->
<bean class="com.atguigu.bean.User" scope="prototype" init-method="initMethod"destroy-method="destroyMethod">
    <property name="id" value="1001"></property>
    <property name="username" value="admin"></property>
    <property name="password" value="123456"></property>
    <property name="age" value="23"></property>
</bean>
```

**测试**

```java
@Test
public void testLife(){
    ClassPathXmlApplicationContext ac = newClassPathXmlApplicationContext("spring-lifecycle.xml");
    User bean = ac.getBean(User.class);
    System.out.println("生命周期：4、通过IOC容器获取bean并使用");
    ac.close();
}
```

**Bean的后置处理器**

bean 的后置处理器会在生命周期的初始化前后添加额外的操作，需要实现 BeanPostProcesso r接口，且配置到 IOC 容器中，需要注意的是，bean 后置处理器不是单独针对某一个 bean 生效，而是针对 IOC 容器中所有 bean 都会执行

创建 bean 的后置处理器：

```java
package com.atguigu.spring.process;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanPostProcessor;
public class MyBeanProcessor implements BeanPostProcessor {
    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName)
        throws BeansException {
        System.out.println("☆☆☆" + beanName + " = " + bean);
        return bean;
    }
    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName)
        throws BeansException {
        System.out.println("★★★" + beanName + " = " + bean);
        return bean;
    }
}
```

在 IOC 容器中配置后置处理器：

```xml
<!-- bean的后置处理器要放入IOC容器才能生效 -->

<bean id="myBeanProcessor"class="com.atguigu.spring.process.MyBeanProcessor"/>
```

#### FactoryBean

**简介**

FactoryBean 是 Spring 提供的一种整合第三方框架的常用机制。和普通的 bean 不同，配置一个 FactoryBean 类型的 bean，在获取 bean 的时候得到的并不是 class 属性中配置的这个类的对象，而是`getObject()`方法的返回值。通过这种机制，Spring 可以帮我们把复杂组件创建的详细过程和繁琐细节都屏蔽起来，只把最简洁的使用界面展示给我们

将来整合 Mybatis 时，Spring 就是通过 FactoryBean 机制来创建 SqlSessionFactory 对象的

**创建UserFactoryBean**

```java
public class UserFactoryBean implements FactoryBean<User> {
    @Override
    public User getObject() throws Exception {
        return new User();
    }
    @Override
    public Class<?> getObjectType() {
        return User.class;
    }
}
```

**配置Bean**

```xml
<bean id="user" class="com.atguigu.bean.UserFactoryBean"></bean>
```

**测试**

```java
@Test
public void testUserFactoryBean(){
    //获取IOC容器
    ApplicationContext ac = new ClassPathXmlApplicationContext("spring-factorybean.xml");
    User user = (User) ac.getBean("user");
    System.out.println(user);
}
```

#### 基于XML的自动装配

自动装配：

根据指定的策略，在IOC容器中匹配某一个bean，自动为指定的bean中所依赖的类类型或接口类型属性赋值

**场景模拟**

创建类 UserController

```java
public class UserController {
    private UserService userService;
    public void setUserService(UserService userService) {
        this.userService = userService;
    }
    public void saveUser(){
        userService.saveUser();
    }
}
```

创建接口UserService

```java
public interface UserService {
	void saveUser();
}
```

创建类 UserServiceImpl 实现接口 UserService

```java
public class UserServiceImpl implements UserService {
    private UserDao userDao;
    public void setUserDao(UserDao userDao) {
        this.userDao = userDao;
    }
    @Override
    public void saveUser() {
        userDao.saveUser();
    }
}
```

创建接口 UserDao

```java
public interface UserDao {
	void saveUser();
}
```

创建类 UserDaoImpl 实现接口 UserDao

```java
public class UserDaoImpl implements UserDao {
    @Override
    public void saveUser() {
        System.out.println("保存成功");
    }
}
```

**配置Bean**

使用 bean 标签的 autowire 属性设置自动装配效果

自动装配方式：byType

byType：根据类型匹配IOC容器中的某个兼容类型的bean，为属性自动赋值

若在IOC中，没有任何一个兼容类型的bean能够为属性赋值，则该属性不装配，即值为默认值 null

若在IOC中，有多个兼容类型的bean能够为属性赋值，则抛出异常 NoUniqueBeanDefinitionException

```xml
<bean id="userController"class="com.atguigu.autowire.xml.controller.UserController" autowire="byType">
</bean>
<bean id="userService"class="com.atguigu.autowire.xml.service.impl.UserServiceImpl" autowire="byType">
</bean>
<bean id="userDao" class="com.atguigu.autowire.xml.dao.impl.UserDaoImpl"></bean>
```

自动装配方式：byName

byName：将自动装配的属性的属性名，作为bean的id在IOC容器中匹配相对应的bean进行赋值

```xml
<bean id="userController"class="com.atguigu.autowire.xml.controller.UserController" autowire="byName">
</bean>
<bean id="userService"class="com.atguigu.autowire.xml.service.impl.UserServiceImpl" autowire="byName">
</bean>
<bean id="userServiceImpl"class="com.atguigu.autowire.xml.service.impl.UserServiceImpl" autowire="byName">
</bean>
<bean id="userDao" class="com.atguigu.autowire.xml.dao.impl.UserDaoImpl">
</bean>
<bean id="userDaoImpl" class="com.atguigu.autowire.xml.dao.impl.UserDaoImpl">
</bean>
```

**测试**

```java
@Test
public void testAutoWireByXML(){
    ApplicationContext ac = new ClassPathXmlApplicationContext("autowire-xml.xml");
    UserController userController = ac.getBean(UserController.class);
    userController.saveUser();
}
```

### 基于注解管理Bean

#### 标记与扫描

##### 注解

和 XML 配置文件一样，注解本身并不能执行，注解本身仅仅只是做一个标记，具体的功能是框架检测到注解标记的位置，然后针对这个位置按照注解标记的功能来执行具体操作

本质上：所有一切的操作都是 Java 代码来完成的，XML和注解只是告诉框架中的 Java 代码如何执行

##### 扫描

Spring 为了知道程序员在哪些地方标记了什么注解，就需要通过扫描的方式，来进行检测。然后根据注解进行后续操作

##### 新建 Maven Module

```xml
<dependencies>
    <!-- 基于Maven依赖传递性，导入spring-context依赖即可导入当前所需所有jar包 -->
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context</artifactId>
        <version>5.3.1</version>
    </dependency>
    <!-- junit测试 -->
    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.12</version>
        <scope>test</scope>
    </dependency>
</dependencies>
```

##### 创建Spring配置文件

![20240505223623](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240505223623.png)

##### 标识组件的常用注解

@Component：将类标识为普通组件 

@Controller：将类标识为控制层组件 

@Service：将类标识为业务层组件 

@Repository：将类标识为持久层组件

问：以上四个注解有什么关系和区别？

![20240505223636](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240505223636.png)

通过查看源码得知，@Controller、@Service、@Repository 这三个注解只是在 @Component 注解的基础上起了三个新的名字

对于 Spring 使用 IOC 容器管理这些组件来说没有区别。所以 @Controller、@Service、@Repository 这三个注解只是给开发人员看的，让我们能够便于分辨组件的作用

注意：虽然它们本质上一样，但是为了代码的可读性，为了程序结构严谨我们肯定不能随便胡乱标记

##### 创建组件

创建控制层组件

```java
@Controller
public class UserController {
}
```

创建接口 UserService

```java
public interface UserService {
}
```

创建业务层组件 UserServiceImpl

```java
@Service
public class UserServiceImpl implements UserService {
}
```

创建接口 UserDao

```java
public interface UserDao {
}
```

创建持久层组件 UserDaoImpl

```java
@Repository
public class UserDaoImpl implements UserDao {
}
```

##### 扫描组件

情况一：最基本的扫描方式

```xml
<context:component-scan base-package="com.atguigu">
</context:component-scan>
```

情况二：指定要排除的组件

```xml
<context:component-scan base-package="com.atguigu">
    <!-- context:exclude-filter标签：指定排除规则 -->
    <!--
        type：设置排除或包含的依据
        type="annotation"，根据注解排除，expression中设置要排除的注解的全类名
        type="assignable"，根据类型排除，expression中设置要排除的类型的全类名
    -->
    <context:exclude-filter type="annotation"expression="org.springframework.stereotype.Controller"/>
    <!--<context:exclude-filter type="assignable"expression="com.atguigu.controller.UserController"/>-->
</context:component-scan>
```

情况三：仅扫描指定组件

```xml
<context:component-scan base-package="com.atguigu" use-default-filters="false">
    <!-- context:include-filter标签：指定在原有扫描规则的基础上追加的规则 -->
    <!-- use-default-filters属性：取值false表示关闭默认扫描规则 -->
    <!-- 此时必须设置use-default-filters="false"，因为默认规则即扫描指定包下所有类 -->
    <!--
        type：设置排除或包含的依据
        type="annotation"，根据注解排除，expression中设置要排除的注解的全类名
        type="assignable"，根据类型排除，expression中设置要排除的类型的全类名
     -->
    <context:include-filter type="annotation"expression="org.springframework.stereotype.Controller"/>
    <!--<context:include-filter type="assignable"expression="com.atguigu.controller.UserController"/>-->
</context:component-scan>
```

##### 测试

```java
@Test
public void testAutowireByAnnotation(){
    ApplicationContext ac = new
        ClassPathXmlApplicationContext("applicationContext.xml");
    UserController userController = ac.getBean(UserController.class);
    System.out.println(userController);
    UserService userService = ac.getBean(UserService.class);
    System.out.println(userService);
    UserDao userDao = ac.getBean(UserDao.class);
    System.out.println(userDao);
}
```

##### 组件所对应Bean的唯一Id

在我们使用 XML 方式管理 bean 的时候，每个 bean 都有一个唯一标识，便于在其他地方引用。现在使用注解后，每个组件仍然应该有一个唯一标识

**默认情况：**类名首字母小写就是 bean 的 id。例如：UserController 类对应的 bean 的 id 就是 userController

**自定义 bean 的 id：**可通过标识组件的注解的 value 属性设置自定义的 bean 的 id

```java
//默认为userServiceImpl public class UserServiceImpl implements
@Service("userService")
UserService {

}
```

#### 基于注解的自动装配

参考基于xml的自动装配

在 UserController 中声明 UserService 对象

在 UserServiceImpl 中声明 UserDao 对象

##### @Autowired注解

在成员变量上直接标记 @Autowired 注解即可完成自动装配，不需要提供setXxx()方法。以后在项目中的正式用法就是这样

```java
@Controller
public class UserController {
    @Autowired
    private UserService userService;
    public void saveUser(){
        userService.saveUser();
    }
}
```

```java
public interface UserService {
    void saveUser();
}
@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserDao userDao;
    @Override
    public void saveUser() {
        userDao.saveUser();
    }
}
```

```java
public interface UserDao {
	void saveUser();
}
```

```java
@Repository
public class UserDaoImpl implements UserDao {
    @Override
    public void saveUser() {
        System.out.println("保存成功");
    }
}
```

##### 其他细节

@Autowired 注解可以标记在构造器和 set 方法上

```java
@Controller
public class UserController {
    private UserService userService;
    @Autowired
    public UserController(UserService userService){
        this.userService = userService;
    }
    public void saveUser(){
        userService.saveUser();
    }
}
```

```java
@Controller
public class UserController {
    private UserService userService;
    @Autowired
    public void setUserService(UserService userService){
        this.userService = userService;
    }
    public void saveUser(){
        userService.saveUser();
    }
}
```

##### @Autowired工作流程

![20240505223948](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240505223948.png)

- 首先根据所需要的组件类型到 IOC 容器中查找
   - 能够找到唯一的bean：直接执行装配
   - 如果完全找不到匹配这个类型的bean：装配失败
   - 和所需类型匹配的bean不止一个
      - 没有@Qualifier注解：根据@Autowired标记位置成员变量的变量名作为bean的id进行匹配
      - 能够找到：执行装配
      - 找不到：装配失败
      - 使用@Qualifier注解：根据@Qualifier注解中指定的名称作为bean的id进行匹配
      - 能够找到：执行装配
      - 找不到：装配失败

```java
@Controller
public class UserController {
    @Autowired
    @Qualifier("userServiceImpl")
    private UserService userService;
    public void saveUser(){
        userService.saveUser();
    }
}
```

@Autowired 中有属性 required，默认值为 true，因此在自动装配无法找到相应的 bean 时，会装配失败

可以将属性 required 的值设置为 true，则表示能装就装，装不上就不装，此时自动装配的属性为默认值

但是实际开发时，基本上所有需要装配组件的地方都是必须装配的，用不上这个属性

## AOP

### 概述

当我们在开发中想增强现有的功能，例如想在某个功能调用前和调用后添加日志功能，但是如果在每个功能前后都写一段输出日志的代码，这样容易干扰核心业务功能，并且代码分散在各个业务功能方法中，不利于同意维护

为了解决这个问题，我们需要实现**解耦**，即将增强部分的功能从业务代码中抽取出来

### 代理功能

#### 概念

二十三种设计模式中的一种，属于结构型模式。它的作用就是通过提供一个代理类，让我们在调用目标方法的时候，不再是直接对目标方法进行调用，而是通过代理类**间接**调用。让不属于目标方法核心逻辑的代码从目标方法中剥离出来——**解耦**。调用目标方法时先调用代理对象的方法，减少对目标方法的调用和打扰，同时让附加功能能够集中在一起也有利于统一维护

![20240505224048](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240505224048.png)

使用代理后：

![20240505224056](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240505224056.png)

#### 静态代理

创建静态代理类：

```java
public class CalculatorStaticProxy implements Calculator {
    // 将被代理的目标对象声明为成员变量
    private Calculator target;
    public CalculatorStaticProxy(Calculator target) {
        this.target = target;
    }
    @Override
    public int add(int i, int j) {
        // 附加功能由代理类中的代理方法来实现
        System.out.println("[日志] add 方法开始了，参数是：" + i + "," + j);
        // 通过目标对象来实现核心业务逻辑
        int addResult = target.add(i, j);
        System.out.println("[日志] add 方法结束了，结果是：" + addResult);
        return addResult;
    }
}
```

静态代理确实实现了解耦，但是由于代码都写死了，完全不具备任何的灵活性。就拿日志功能来说，将来其他地方也需要附加日志，那还得再声明更多个静态代理类，那就产生了大量重复的代码，日志功能还是分散的，没有统一管理

提出进一步的需求：将日志功能集中到一个代理类中，将来有任何日志需求，都通过这一个代理类来实现。这就需要使用动态代理技术了

#### 动态代理

![20240505224121](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240505224121.png)

生产代理对象的工厂类：

```java
public class ProxyFactory {
    private Object target;
    public ProxyFactory(Object target) {
        this.target = target;
    }
    public Object getProxy(){
        /**
         * newProxyInstance()：创建一个代理实例
         * 其中有三个参数：
         * 1、classLoader：加载动态生成的代理类的类加载器
         * 2、interfaces：目标对象实现的所有接口的class对象所组成的数组
         * 3、invocationHandler：设置代理对象实现目标对象方法的过程，即代理类中如何重写接口中的抽象方法
         */
        ClassLoader classLoader = target.getClass().getClassLoader();
        Class<?>[] interfaces = target.getClass().getInterfaces();
        InvocationHandler invocationHandler = new InvocationHandler() {
            @Override
            public Object invoke(Object proxy, Method method, Object[] args)
                throws Throwable {
                /**
                 * proxy：代理对象
                 * method：代理对象需要实现的方法，即其中需要重写的方法
                 * args：method所对应方法的参数
                 */
                Object result = null;
                try {
                    System.out.println("[动态代理][日志] "+method.getName()+"，参数："+ Arrays.toString(args));
                     result = method.invoke(target, args);
                     System.out.println("[动态代理][日志] "+method.getName()+"，结 果："+ result);
                 } catch (Exception e) {
                   e.printStackTrace();
                   System.out.println("[动态代理][日志] "+method.getName()+"，异常："+e.getMessage());
                  } finally {
                      System.out.println("[动态代理][日志] "+method.getName()+"，方法执行完毕");
                  }
                  return result;
               }   
            };    
            return Proxy.newProxyInstance(classLoader, interfaces,invocationHandler);
      }
} 
```

#### 测试

```java
@Test
public void testDynamicProxy(){
    ProxyFactory factory = new ProxyFactory(new CalculatorLogImpl());
    Calculator proxy = (Calculator) factory.getProxy();
    proxy.div(1,0);
    //proxy.div(1,1);
}
```

### AOP概念及相关术语

#### 概述

AOP（Aspect Oriented Programming）是一种设计思想，是软件设计领域中的面向切面编程，它是面向对象编程的一种补充和完善，它以通过预编译方式和运行期动态代理方式实现在不修改源代码的情况下给程序动态统一添加额外功能的一种技术

#### 相关术语

**横切关注点**

从每个方法中抽取出来的同一类非核心业务。在同一个项目中，我们可以使用多个横切关注点对相关方法进行多个不同方面的增强这个概念不是语法层面天然存在的，而是根据附加功能的逻辑上的需要：有十个附加功能，就有十个横切关注点

![20240505224148](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240505224148.png)

**通知**

每一个横切关注点上要做的事情都需要写一个方法来实现，这样的方法就叫通知方法

- 前置通知：在被代理的目标方法**前**执行
- 返回通知：在被代理的目标方法**成功结束**后执行（**寿终正寝**）
- 异常通知：在被代理的目标方法**异常结束**后执行（**死于非命**）
- 后置通知：在被代理的目标方法**最终结束**后执行（**盖棺定论**）
- 环绕通知：使用try...catch...finally结构围绕**整个**被代理的目标方法，包括上面四种通知对应的所有位置

![20240505224203](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240505224203.png)

**切面**

封装通知方法的类

![20240505224213](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240505224213.png)

**目标**

被代理的目标对象

**代理**

向目标对象应用通知之后创建的代理对象

**连接点**

这也是一个纯逻辑概念，不是语法定义的

把方法排成一排，每一个横切位置看成x轴方向，把方法从上到下执行的顺序看成y轴，x轴和y轴的交叉点就是连接点

![20240505224226](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240505224226.png)

**切入点**

定位连接点的方式

每个类的方法中都包含多个连接点，所以连接点是类中客观存在的事物（从逻辑上来说）

如果把连接点看作数据库中的记录，那么切入点就是查询记录的 SQL 语句

Spring 的 AOP 技术可以通过切入点定位到特定的连接点

切点通过 org.springframework.aop.Pointcut 接口进行描述，它使用类和方法作为连接点的查询条件

#### 作用

- 简化代码：把方法中固定位置的重复的代码**抽取**出来，让被抽取的方法更专注于自己的核心功能，提高内聚性
- 代码增强：把特定的功能封装到切面类中，看哪里有需要，就往上套，被**套用**了切面逻辑的方法就被切面给增强了

### 基于注解的AOP

![20240505224253](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240505224253.png)

- 动态代理（InvocationHandler）：JDK原生的实现方式，需要被代理的目标类必须实现接口。因为这个技术要求**代理对象和目标对象实现同样的接口**（兄弟两个拜把子模式）
- cglib：通过**继承被代理的目标类**（认干爹模式）实现代理，所以不需要目标类实现接口
- AspectJ：本质上是静态代理，**将代理逻辑“织入”被代理的目标类编译得到的字节码文件**，所以最终效果是动态的。weaver就是织入器。Spring只是借用了AspectJ中的注解

#### 准备工作

**添加依赖**

在IOC所需依赖基础上再加入下面依赖即可：

```xml
<!-- spring-aspects会帮我们传递过来aspectjweaver -->
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-aspects</artifactId>
    <version>5.3.1</version>
</dependency>
```

**准备被代理的目标资源**

接口：

```java
public interface Calculator {
    int add(int i, int j);
    int sub(int i, int j);
    int mul(int i, int j);
    int div(int i, int j);
}
```

实现类：

```java
@Component
public class CalculatorPureImpl implements Calculator {
    @Override
    public int add(int i, int j) {
        int result = i + j;
        System.out.println("方法内部 result = " + result);
        return result;
    }
    @Override
    public int sub(int i, int j) {
        int result = i - j;
        System.out.println("方法内部 result = " + result);
        return result;
    }
    @Override
    public int mul(int i, int j) {
        int result = i * j;
        System.out.println("方法内部 result = " + result);
        return result;
    }
    @Override
    public int div(int i, int j) {
        int result = i / j;
        System.out.println("方法内部 result = " + result);
        return result;
    }
}
```

#### 创建切面类并配置

```java
// @Aspect表示这个类是一个切面类
@Aspect
// @Component注解保证这个切面类能够放入IOC容器
@Component
public class LogAspect {
    @Before("execution(public int com.atguigu.aop.annotation.CalculatorImpl.*(..))")
public void beforeMethod(JoinPoint joinPoint){
	String methodName = joinPoint.getSignature().getName();
	String args = Arrays.toString(joinPoint.getArgs());
	System.out.println("Logger-->前置通知，方法名："+methodName+"，参数："+args);
	}
    @After("execution(* com.atguigu.aop.annotation.CalculatorImpl.*(..))")
	public void afterMethod(JoinPoint joinPoint){
		String methodName = joinPoint.getSignature().getName();
		System.out.println("Logger-->后置通知，方法名："+methodName);
	}
    @AfterReturning(value = "execution(*com.atguigu.aop.annotation.CalculatorImpl.*(..))", returning = "result")
	public void afterReturningMethod(JoinPoint joinPoint, Object result){
		String methodName = joinPoint.getSignature().getName();
		System.out.println("Logger-->返回通知，方法名："+methodName+"，结果："+result);
	} 
    @AfterThrowing(value = "execution(*com.atguigu.aop.annotation.CalculatorImpl.*(..))", throwing = "ex")
	public void afterThrowingMethod(JoinPoint joinPoint, Throwable ex){
		String methodName = joinPoint.getSignature().getName();
		System.out.println("Logger-->异常通知，方法名："+methodName+"，异常："+ex);
	}
    @Around("execution(* com.atguigu.aop.annotation.CalculatorImpl.*(..))")
	public Object aroundMethod(ProceedingJoinPoint joinPoint){
        String methodName = joinPoint.getSignature().getName();
		String args = Arrays.toString(joinPoint.getArgs());
		Object result = null;
        try {
            System.out.println("环绕通知-->目标对象方法执行之前");
            //目标对象（连接点）方法的执行
            result = joinPoint.proceed();
            System.out.println("环绕通知-->目标对象方法返回值之后");
		} catch (Throwable throwable) {
            throwable.printStackTrace();
            System.out.println("环绕通知-->目标对象方法出现异常时");
		} finally {
			System.out.println("环绕通知-->目标对象方法执行完毕");
		}
		return result;
	}
}
```

在 Spring 配置文件中配置

```xml
<!--
  基于注解的AOP的实现：
  1、将目标对象和切面交给IOC容器管理（注解+扫描）
  2、开启AspectJ的自动代理，为目标对象自动生成代理
  3、将切面类通过注解@Aspect标识
	-->
<context:component-scan base-package="xyz.kbws.aop">
</context:component-scan>
<aop:aspectj-autoproxy />
```
#### 各种通知

- 前置通知：使用@Before注解标识，在被代理的目标方法**前**执行
- 返回通知：使用@AfterReturning注解标识，在被代理的目标方法**成功结束**后执行（**寿终正寝**）
- 异常通知：使用@AfterThrowing注解标识，在被代理的目标方法**异常结束**后执行（**死于非命**）
- 后置通知：使用@After注解标识，在被代理的目标方法**最终结束**后执行（**盖棺定论**）
- 环绕通知：使用@Around注解标识，使用try...catch...finally结构围绕**整个**被代理的目标方法，包括上面四种通知对应的所有位置

各种通知的执行顺序：

- Spring版本5.3.x以前：
   - 前置通知
   - 目标操作
   - 后置通知
   - 返回通知或异常通知
- Spring版本5.3.x以后：
   - 前置通知
   - 目标操作
   - 返回通知或异常通知
   - 后置通知
  
#### 切入点表示语法

##### 作用

![20240505224346](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240505224346.png)

##### 语法细节

- 用*号代替“权限修饰符”和“返回值”部分表示“权限修饰符”和“返回值”不限
- 在包名的部分，一个“_”号只能代表包的层次结构中的一层，表示这一层是任意的_
   - _例如：_.Hello匹配com.Hello，不匹配com.atguigu.Hello
- 在包名的部分，使用“..”表示包名任意、包的层次深度任意
- _在类名的部分，类名部分整体用_号代替，表示类名任意
- 在类名的部分，可以使用_号代替类名的一部分
   - 例如：_Service匹配所有名称以Service结尾的类或接口
- 在方法名部分，可以使用_号表示方法名任意
- _在方法名部分，可以使用_号代替方法名的一部分
   - 例如：*Operation匹配所有方法名以Operation结尾的方法
- 	在方法参数列表部分，使用(..)表示参数列表任意
- 在方法参数列表部分，使用(int,..)表示参数列表以一个int类型的参数开头
- 在方法参数列表部分，基本数据类型和对应的包装类型是不一样的
   - 切入点表达式中使用 int 和实际方法中 Integer 是不匹配的
- 在方法返回值部分，如果想要明确指定一个返回值类型，那么必须同时写明权限修饰符
   - 例如：execution(public int _.._Service._(.., int)) 正确
   - 例如：execution(_ int _.._Service.*(.., int)) 错误

![20240505224451](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240505224451.png)

#### 重用切入点表达式

##### 声明

```java
@Pointcut("execution(* com.atguigu.aop.annotation.*.*(..))")
public void pointCut(){}
```

##### 在同一个切面中使用

```java
@Before("pointCut()")
public void beforeMethod(JoinPoint joinPoint){
    String methodName = joinPoint.getSignature().getName();
    String args = Arrays.toString(joinPoint.getArgs());
    System.out.println("Logger-->前置通知，方法名："+methodName+"，参数："+args);
}
```

#### 在不同切面中使用

```java
@Before("com.atguigu.aop.CommonPointCut.pointCut()")
public void beforeMethod(JoinPoint joinPoint){
    String methodName = joinPoint.getSignature().getName();
    String args = Arrays.toString(joinPoint.getArgs());
    System.out.println("Logger-->前置通知，方法名："+methodName+"，参数："+args);
}
```

#### 获取通知的相关信息

##### 获取连接点信息

获取连接点信息可以在通知方法的参数位置设置JoinPoint类型的形参

```java
@Before("execution(public int com.atguigu.aop.annotation.CalculatorImpl.*(..))")
public void beforeMethod(JoinPoint joinPoint){
    //获取连接点的签名信息
    String methodName = joinPoint.getSignature().getName();
    //获取目标方法到的实参信息
    String args = Arrays.toString(joinPoint.getArgs());
    System.out.println("Logger-->前置通知，方法名："+methodName+"，参数："+args);
}
```

##### 获取目标方法的返回值

@AfterReturning中的属性returning，用来将通知方法的某个形参，接收目标方法的返回值

```java
@AfterReturning(value = "execution(* com.atguigu.aop.annotation.CalculatorImpl.*(..))", returning = "result")
    public void afterReturningMethod(JoinPoint joinPoint, Object result){
    String methodName = joinPoint.getSignature().getName();
    System.out.println("Logger-->返回通知，方法名："+methodName+"，结果："+result);
}
```

##### 获取目标方法的异常

@AfterThrowing中的属性throwing，用来将通知方法的某个形参，接收目标方法的异常

```java
@AfterThrowing(value = "execution(* com.atguigu.aop.annotation.CalculatorImpl.*(..))", throwing = "ex")
    public void afterThrowingMethod(JoinPoint joinPoint, Throwable ex){
    String methodName = joinPoint.getSignature().getName();
    System.out.println("Logger-->异常通知，方法名："+methodName+"，异常："+ex);
}
```

#### 环绕通知

```java
@Around("execution(* com.atguigu.aop.annotation.CalculatorImpl.*(..))")
public Object aroundMethod(ProceedingJoinPoint joinPoint){
    String methodName = joinPoint.getSignature().getName();
    String args = Arrays.toString(joinPoint.getArgs());
    Object result = null;
    try {
        System.out.println("环绕通知-->目标对象方法执行之前");
        //目标方法的执行，目标方法的返回值一定要返回给外界调用者
        result = joinPoint.proceed();
        System.out.println("环绕通知-->目标对象方法返回值之后");
    } catch (Throwable throwable) {
        throwable.printStackTrace();
        System.out.println("环绕通知-->目标对象方法出现异常时");
    } finally {
        System.out.println("环绕通知-->目标对象方法执行完毕");
    }
    return result;
}
```

#### 切面的优先级

相同目标方法上同时存在多个切面时，切面的优先级控制切面的**内外嵌套**顺序

- 优先级高的切面：外面
- 优先级低的切面：里面

使用@Order注解可以控制切面的优先级：

- @Order(较小的数)：优先级高
- @Order(较大的数)：优先级低

![20240505224531](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240505224531.png)

#### 基于XML的AOP

```xml
<context:component-scan base-package="com.atguigu.aop.xml"></context:componentscan>
<aop:config>
    <!--配置切面类-->
    <aop:aspect ref="loggerAspect">
        <aop:pointcut id="pointCut" expression="execution(*com.atguigu.aop.xml.CalculatorImpl.*(..))"/>
        <aop:before method="beforeMethod" pointcut-ref="pointCut"></aop:before>
        <aop:after method="afterMethod" pointcut-ref="pointCut"></aop:after>
        <aop:after-returning method="afterReturningMethod" returning="result"pointcut-ref="pointCut"></aop:after-returning>
        <aop:after-throwing method="afterThrowingMethod" throwing="ex" pointcut-ref="pointCut"></aop:after-throwing>
        <aop:around method="aroundMethod" pointcut-ref="pointCut"></aop:around>
    </aop:aspect>
    <aop:aspect ref="validateAspect" order="1">
        <aop:before method="validateBeforeMethod" pointcut-ref="pointCut">
        </aop:before>
    </aop:aspect>
</aop:config>
```

## 声明式事务

### JDBCTemplate

#### 简介

Spring 框架对 JDBC 进行封装，使用 JdbcTemplate 方便实现对数据库操作

#### 准备工作

**添加依赖**

```xml
<dependencies>
    <!-- 基于Maven依赖传递性，导入spring-context依赖即可导入当前所需所有jar包 -->
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context</artifactId>
        <version>5.3.1</version>
    </dependency>
    <!-- Spring 持久化层支持jar包 -->
    <!-- Spring 在执行持久化层操作、与持久化层技术进行整合过程中，需要使用orm、jdbc、tx三个jar包 -->
    <!-- 导入 orm 包就可以通过 Maven 的依赖传递性把其他两个也导入 -->
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-orm</artifactId>
        <version>5.3.1</version>
    </dependency>
    <!-- Spring 测试相关 -->
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-test</artifactId>
        <version>5.3.1</version>
    </dependency>
    <!-- junit测试 -->
    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.12</version>
        <scope>test</scope>
    </dependency>
    <!-- MySQL驱动 -->
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>8.0.16</version>
    </dependency>
    <!-- 数据源 -->
    <dependency>
        <groupId>com.alibaba</groupId>
        <artifactId>druid</artifactId>
        <version>1.0.31</version>
    </dependency>
</dependencies>
```

**创建 jdbc.properties**

```xml
jdbc.username=root
jdbc.password=hsy031122
jdbc.url=jdbc:mysql://localhost:3306/yupi?serverTimezone=GMT%2B8&useUnicode=true&characterEncoding=utf8&autoReconnect=true&allowMultiQueries=true
jdbc.driver=com.mysql.cj.jdbc.Driver
```

**配置 Spring 配置文件**

```xml
<!-- 导入外部属性文件 -->
<context:property-placeholder location="classpath:jdbc.properties" />
<!-- 配置数据源 -->
<bean id="druidDataSource" class="com.alibaba.druid.pool.DruidDataSource">
    <property name="url" value="${jdbc.url}"/>
    <property name="driverClassName" value="${jdbc.driver}"/>
    <property name="username" value="${jdbc.username}"/>
    <property name="password" value="${jdbc.password}"/>
</bean>
<!-- 配置 JdbcTemplate -->
<bean id="jdbcTemplate" class="org.springframework.jdbc.core.JdbcTemplate">
    <!-- 装配数据源 -->
    <property name="dataSource" ref="druidDataSource"/>
</bean>
```

#### 测试

**在测试类装配 JdbcTemplate**

```java
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:spring-jdbc.xml")
public class JDBCTemplateTest {
    @Autowired
    private JdbcTemplate jdbcTemplate;
}
```

**测试增删改功能**

```java
@Test
//测试增删改功能
public void testUpdate(){
    String sql = "insert into t_emp values(null,?,?,?)";
    int result = jdbcTemplate.update(sql, "张三", 23, "男");
    System.out.println(result);
}
```

**查询一条数据为实体对象**

```java
@Test
//查询一条数据为一个实体类对象
public void testSelectEmpById(){
    String sql = "select * from t_emp where id = ?";
    Emp emp = jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(Emp.class), 1);
    System.out.println(emp);
}
```

**查询多条数据为一个 list 集合**

```java
@Test
//查询多条数据为一个list集合
public void testSelectList(){
    String sql = "select * from t_emp";
    List<Emp> list = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Emp.class));
    list.forEach(emp -> System.out.println(emp));
}
```

**查询单行单列的值**

```java
@Test
//查询单行单列的值
public void selectCount(){
    String sql = "select count(id) from t_emp";
    Integer count = jdbcTemplate.queryForObject(sql, Integer.class);
    System.out.println(count);
}
```

### 声明式事务

#### 概念

**编程式事务**

事务功能的相关操作全部通过自己编写代码来实现：

```java
Connection conn = ...;
try {
    // 开启事务：关闭事务的自动提交
    conn.setAutoCommit(false);
    // 核心操作
    // 提交事务
    conn.commit();
}catch(Exception e){
    // 回滚事务
    conn.rollBack();
}finally{
    // 释放数据库连接
    conn.close();
}
```

编程式的实现方式存在缺陷：

- 细节没有被屏蔽：具体操作过程中，所有细节都需要程序员自己来完成，比较繁琐
- 代码复用性不高：如果没有有效抽取出来，每次实现功能都需要自己编写代码，代码就没有得到复用

**声明式事务**

既然事务控制的代码有规律可循，代码的结构基本是确定的，所以框架就可以将固定模式的代码抽取出来，进行相关的封装。封装起来后，我们只需要在配置文件中进行简单的配置即可完成操作

- 好处1：提高开发效率
- 好处2：消除了冗余的代码
- 好处3：框架会综合考虑相关领域中在实际开发环境下有可能遇到的各种问题，进行了健壮性、性能等各个方面的优化

所以，我们可以总结下面两个概念：

- **编程式**：**自己写代码**实现功能
- **声明式**：通过**配置**让**框架**实现功能

#### 基于注解的声明式事务

##### 准备工作

引入依赖

```xml
<dependencies>
    <!-- 基于Maven依赖传递性，导入spring-context依赖即可导入当前所需所有jar包 -->
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context</artifactId>
        <version>5.3.1</version>
    </dependency>
    <!-- Spring 持久化层支持jar包 -->
    <!-- Spring 在执行持久化层操作、与持久化层技术进行整合过程中，需要使用orm、jdbc、tx三个jar包 -->
    <!-- 导入 orm 包就可以通过 Maven 的依赖传递性把其他两个也导入 -->
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-orm</artifactId>
        <version>5.3.1</version>
    </dependency>
    <!-- Spring 测试相关 -->
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-test</artifactId>
        <version>5.3.1</version>
    </dependency>
    <!-- junit测试 -->
    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.12</version>
        <scope>test</scope>
    </dependency>
    <!-- MySQL驱动 -->
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>8.0.16</version>
    </dependency>
    <!-- 数据源 -->
    <dependency>
        <groupId>com.alibaba</groupId>
        <artifactId>druid</artifactId>
        <version>1.0.31</version>
    </dependency>
</dependencies>
```

创建 jdbc.properties

```xml
jdbc.username=root
jdbc.password=hsy031122
jdbc.url=jdbc:mysql://localhost:3306/yupi?serverTimezone=GMT%2B8&useUnicode=true&characterEncoding=utf8&autoReconnect=true&allowMultiQueries=true
jdbc.driver=com.mysql.cj.jdbc.Driver
```

配置 Spring 配置文件

```xml
<!--扫描组件-->
<context:component-scan base-package="com.atguigu.spring.tx.annotation">
</context:component-scan>
<!-- 导入外部属性文件 -->
<context:property-placeholder location="classpath:jdbc.properties" />
<!-- 配置数据源 -->
<bean id="druidDataSource" class="com.alibaba.druid.pool.DruidDataSource">
    <property name="url" value="${jdbc.url}"/>
    <property name="driverClassName" value="${jdbc.driver}"/>
    <property name="username" value="${jdbc.username}"/>
    <property name="password" value="${jdbc.password}"/>
</bean>
<!-- 配置 JdbcTemplate -->
<bean id="jdbcTemplate" class="org.springframework.jdbc.core.JdbcTemplate">
    <!-- 装配数据源 -->
    <property name="dataSource" ref="druidDataSource"/>
</bean>
```

创建表

```sql
CREATE TABLE `t_book` (
    `book_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
    `book_name` varchar(20) DEFAULT NULL COMMENT '图书名称',
    `price` int(11) DEFAULT NULL COMMENT '价格',
    `stock` int(10) unsigned DEFAULT NULL COMMENT '库存（无符号）',
    PRIMARY KEY (`book_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
insert into `t_book`(`book_id`,`book_name`,`price`,`stock`) values (1,'斗破苍穹',80,100),(2,'斗罗大陆',50,100);
CREATE TABLE `t_user` (
    `user_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
    `username` varchar(20) DEFAULT NULL COMMENT '用户名',
    `balance` int(10) unsigned DEFAULT NULL COMMENT '余额（无符号）',
    PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
insert into `t_user`(`user_id`,`username`,`balance`) values (1,'admin',50);
```

创建组件

创建 BookController：

```java
@Controller
public class BookController {
    @Autowired
    private BookService bookService;
    public void buyBook(Integer bookId, Integer userId){
        bookService.buyBook(bookId, userId);
    }
}
```

创建 BookService：

```java
public interface BookService {
	void buyBook(Integer bookId, Integer userId);
}
```

创建实现类 BookServiceImpl：

```java
@Service
public class BookServiceImpl implements BookService {
    @Autowired
    private BookDao bookDao;
    @Override
    public void buyBook(Integer bookId, Integer userId) {
        //查询图书的价格
        Integer price = bookDao.getPriceByBookId(bookId);
        //更新图书的库存
        bookDao.updateStock(bookId);
        //更新用户的余额
        bookDao.updateBalance(userId, price);
    }
}
```

创建接口 BookDao：

```java
public interface BookDao {
    Integer getPriceByBookId(Integer bookId);
    void updateStock(Integer bookId);
    void updateBalance(Integer userId, Integer price);
}
```

创建实现类 BookDaoImpl：

```java
@Repository
public class BookDaoImpl implements BookDao {
    @Autowired
    private JdbcTemplate jdbcTemplate;
    @Override
    public Integer getPriceByBookId(Integer bookId) {
        String sql = "select price from t_book where book_id = ?";
        return jdbcTemplate.queryForObject(sql, Integer.class, bookId);
    }
    @Override
    public void updateStock(Integer bookId) {
        String sql = "update t_book set stock = stock - 1 where book_id = ?";
        jdbcTemplate.update(sql, bookId);
    }
    @Override
    public void updateBalance(Integer userId, Integer price) {
        String sql = "update t_user set balance = balance - ? where user_id =?";
            jdbcTemplate.update(sql, price, userId);
    }
}
```
##### 没有事务时

创建测试类：

```java
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:tx-annotation.xml")
public class TxByAnnotationTest {
    @Autowired
    private BookController bookController;
    @Test
    public void testBuyBook(){
        bookController.buyBook(1, 1);
    }
}
```

模拟场景：

用户购买图书，先查询图书的价格，再更新图书的库存和用户的余额

假设用户id为1的用户，购买id为1的图书

用户余额为50，而图书价格为80

购买图书之后，用户的余额为-30，数据库中余额字段设置了无符号，因此无法将-30插入到余额字段

此时执行sql语句会抛出SQLException

观察结果：

因为没有添加事务，图书的库存更新了，但是用户的余额没有更新

显然这样的结果是错误的，购买图书是一个完整的功能，更新库存和更新余额要么都成功要么都失败

##### 加入事务

添加事务配置

在 Spring 配置文件中添加配置：

```xml
<bean id="transactionManager"
      class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
    <property name="dataSource" ref="dataSource"></property>
</bean>
<!--
    开启事务的注解驱动
    通过注解@Transactional所标识的方法或标识的类中所有的方法，都会被事务管理器管理事务
-->
<!-- transaction-manager属性的默认值是transactionManager，如果事务管理器bean的id正好就
是这个默认值，则可以省略这个属性 -->
<tx:annotation-driven transaction-manager="transactionManager" />
```

注意：导入的名称空间需要 **tx结尾**的那个

![20240505224718](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240505224718.png)

添加事务注解

因为 service 层表示业务逻辑层，一个方法表示一个完成的功能，因此处理事务一般在 service 层处理

在 BookServiceImpl 的`buybook()`添加注解 @Transactional

观察结果

由于使用了Spring的声明式事务，更新库存和更新余额都没有执行

##### @Translational注解标识的位置

@Transactional标识在方法上，咋只会影响该方法

@Transactional标识的类上，咋会影响类中所有的方法

##### 事务属性：只读
介绍

对一个查询操作来说，如果我们把它设置成只读，就能够明确告诉数据库，这个操作不涉及写操作。这样数据库就能够针对查询操作来进行优化

使用方式

```java
@Transactional(readOnly = true)
public void buyBook(Integer bookId, Integer userId) {
    //查询图书的价格
    Integer price = bookDao.getPriceByBookId(bookId);
    //更新图书的库存
    bookDao.updateStock(bookId);
    //更新用户的余额
    bookDao.updateBalance(userId, price);
    //System.out.println(1/0);
}
```

注意

对增删改操作设置只读会抛出下面异常：

`Caused by: java.sql.SQLException: Connection is read-only. Queries leading to data modification
are not allowed`

##### 事务属性：超时

介绍

事务在执行过程中，有可能因为遇到某些问题，导致程序卡住，从而长时间占用数据库资源。而长时间占用资源，大概率是因为程序运行出现了问题（可能是Java程序或MySQL数据库或网络连接等等）

此时这个很可能出问题的程序应该被回滚，撤销它已做的操作，事务结束，把资源让出来，让其他正常程序可以执行

概括来说就是一句话：超时回滚，释放资源

使用方式

```java
@Transactional(timeout = 3)
public void buyBook(Integer bookId, Integer userId) {
    try {
        TimeUnit.SECONDS.sleep(5);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
    //查询图书的价格
    Integer price = bookDao.getPriceByBookId(bookId);
    //更新图书的库存
    bookDao.updateStock(bookId);
    //更新用户的余额
    bookDao.updateBalance(userId, price);
    //System.out.println(1/0);
}
```

观察结果

执行过程中抛出异常：

`org.springframework.transaction.**TransactionTimedOutException**: Transaction timed out: deadline was Fri Jun 04 16:25:39 CST 2022`

##### 事务属性：回滚策略

介绍

声明式事务默认只针对运行时异常回滚，编译时异常不回滚

可以通过@Transactional中相关属性设置回滚策略

- rollbackFor属性：需要设置一个Class类型的对象
- rollbackForClassName属性：需要设置一个字符串类型的全类名
- noRollbackFor属性：需要设置一个Class类型的对象
- rollbackFor属性：需要设置一个字符串类型的全类名

使用方式

```java
@Transactional(noRollbackFor = ArithmeticException.class)
//@Transactional(noRollbackForClassName = "java.lang.ArithmeticException")
public void buyBook(Integer bookId, Integer userId) {
    //查询图书的价格
    Integer price = bookDao.getPriceByBookId(bookId);
    //更新图书的库存
    bookDao.updateStock(bookId);
    //更新用户的余额
    bookDao.updateBalance(userId, price);
    System.out.println(1/0);
}
```

观察结果

虽然购买图书功能中出现了数学运算异常（ArithmeticException），但是我们设置的回滚策略是，当出现ArithmeticException不发生回滚，因此购买图书的操作正常执行

##### 事务属性：事务隔离级别

介绍

数据库系统必须具有隔离并发运行各个事务的能力，使它们不会相互影响，避免各种并发问题。一个事务与其他事务隔离的程度称为隔离级别。SQL标准中规定了多种事务隔离级别，不同隔离级别对应不同的干扰程度，隔离级别越高，数据一致性就越好，但并发性越弱

隔离级别一共有四种：

- 读未提交：READ UNCOMMITTED，允许Transaction01读取Transaction02未提交的修改。

- 读已提交：READ COMMITTED，要求Transaction01只能读取Transaction02已提交的修改。

- 可重复读：REPEATABLE READ，确保Transaction01可以多次从一个字段中读取到相同的值，即Transaction01执行期间禁止其它事务对这个字段进行更新

- 串行化：SERIALIZABLE，确保Transaction01可以多次从一个表中读取到相同的行，在Transaction01执行期间，禁止其它事务对这个表进行添加、更新、删除操作。可以避免任何并发问题，但性能十分低下
  
各个隔离级别解决并发问题的能力见下表：

| **隔离级别** | **脏读** | **不可重复读** | **幻读** |
| --- | --- | --- | --- |
| READ UNCOMMITTED | 有 | 有 | 有 |
| READ COMMITTED | 无 | 有 | 有 |
| REPEATABLE READ | 无 | 无 | 有 |
| SERIALIZABLE | 无 | 无 | 无 |

各种数据库产品对事务隔离级别的支持程度：

| **隔离级别** | **Oracle** | **MySQL** |
| --- | --- | --- |
| READ UNCOMMITTED | × | √ |
| READ COMMITTED | √(默认) | √ |
| REPEATABLE READ | × | √(默认) |
| SERIALIZABLE | √ | √ |


使用方式

```java
@Transactional(isolation = Isolation.DEFAULT)//使用数据库默认的隔离级别
@Transactional(isolation = Isolation.READ_UNCOMMITTED)//读未提交
@Transactional(isolation = Isolation.READ_COMMITTED)//读已提交
@Transactional(isolation = Isolation.REPEATABLE_READ)//可重复读
@Transactional(isolation = Isolation.SERIALIZABLE)//串行化
```

##### 事务属性：事务传播行为

介绍

当事务方法被另一个事务方法调用时，必须指定事务应该如何传播。例如：方法可能继续在现有事务中运行，也可能开启一个新事务，并在自己的事务中运行

测试

创建接口CheckoutService：

```java
public interface CheckoutService {
	void checkout(Integer[] bookIds, Integer userId);
}
```

创建实现类CheckoutServiceImpl：

```java
@Service
public class CheckoutServiceImpl implements CheckoutService {
    @Autowired
    private BookService bookService;
    @Override
    @Transactional
    //一次购买多本图书
    public void checkout(Integer[] bookIds, Integer userId) {
        for (Integer bookId : bookIds) {
            bookService.buyBook(bookId, userId);
        }
    }
}
```

在BookController中添加方法：

```java
@Autowired
private CheckoutService checkoutService;
public void checkout(Integer[] bookIds, Integer userId){
    checkoutService.checkout(bookIds, userId);
}
```

在数据库中将用户的余额修改为100元

观察结果

可以通过@Transactional中的propagation属性设置事务传播行为

修改BookServiceImpl中buyBook()上，注解@Transactional的propagation属性

@Transactional(propagation = Propagation.REQUIRED)，默认情况，表示如果当前线程上有已经开

启的事务可用，那么就在这个事务中运行。经过观察，购买图书的方法buyBook()在checkout()中被调用，checkout()上有事务注解，因此在此事务中执行。所购买的两本图书的价格为80和50，而用户的余额为100，因此在购买第二本图书时余额不足失败，导致整个checkout()回滚，即只要有一本书买不了，就都买不了

@Transactional(propagation = Propagation.REQUIRES_NEW)，表示不管当前线程上是否有已经开启的事务，都要开启新事务。同样的场景，每次购买图书都是在buyBook()的事务中执行，因此第一本图书购买成功，事务结束，第二本图书购买失败，只在第二次的buyBook()中回滚，购买第一本图书不受影响，即能买几本就买几本

#### 基于XML的声明式事务

##### 修改Spring配置文件

将Spring配置文件中去掉tx:annotation-driven 标签，并添加配置：

```xml
<aop:config>
    <!-- 配置事务通知和切入点表达式 -->
    <aop:advisor advice-ref="txAdvice" pointcut="execution(*com.atguigu.spring.tx.xml.service.impl.*.*(..))"></aop:advisor>
</aop:config>
<!-- tx:advice标签：配置事务通知 -->
<!-- id属性：给事务通知标签设置唯一标识，便于引用 -->
<!-- transaction-manager属性：关联事务管理器 -->
<tx:advice id="txAdvice" transaction-manager="transactionManager">
    <tx:attributes>
        <!-- tx:method标签：配置具体的事务方法 -->
        <!-- name属性：指定方法名，可以使用星号代表多个字符 -->
        <tx:method name="get*" read-only="true"/>
        <tx:method name="query*" read-only="true"/>
        <tx:method name="find*" read-only="true"/>
        <!-- read-only属性：设置只读属性 -->
        <!-- rollback-for属性：设置回滚的异常 -->
        <!-- no-rollback-for属性：设置不回滚的异常 -->
        <!-- isolation属性：设置事务的隔离级别 -->
        <!-- timeout属性：设置事务的超时属性 -->
        <!-- propagation属性：设置事务的传播行为 -->
        <tx:method name="save*" read-only="false" rollback-for="java.lang.Exception" propagation="REQUIRES_NEW"/>
        <tx:method name="update*" read-only="false" rollback-for="java.lang.Exception" propagation="REQUIRES_NEW"/>
        <tx:method name="delete*" read-only="false" rollback-for="java.lang.Exception" propagation="REQUIRES_NEW"/>
    </tx:attributes>
</tx:advice>
```

注意：基于xml实现的声明式事务，必须引入aspectJ的依赖

```xml
<dependency>
 <groupId>org.springframework</groupId>
 <artifactId>spring-aspects</artifactId>
 <version>5.3.1</version>
</dependency>
```

