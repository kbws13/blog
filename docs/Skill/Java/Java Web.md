---
id: java-web
slug: /java-web
title: Java Web
date: 2024-05-03
tags: [Tomcat, HTTP, Servlet, JSP, MVC]
keywords: [Tomcat, HTTP, Servlet, JSP, MVC]
---

## Tomcat

### 安装

Tomcat官网：[https://tomcat.apache.org/](https://tomcat.apache.org/)

### Tomcat启动和配置

启动和关闭 Tomcat

![20240503210322](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240503210322.png)

访问测试：[https://localhost:8080/](https://localhost:8080/)

可以配置启动的端口号(conf\server.xml)

- Tomcat 的默认端口号为：8080
- MySQL：3360
- HTTP：80
- HTTPS：443

```xml
<Connector potr="8081" protocol="HTTP/1.1"
		  connectionTimeout="20000"
		  redirectPort="8443"/>
```

可以配置主机的名字

- 默认主机名称为：localhost-->127.0.0.1
- 默认网站应用存放的位置为：webapps

```xml
<Host name="kbws.com" appbase="wwebapps"
      unpackWARs="true" autoDeploy="true"/>
```

### 面试题

请你谈谈网站是如何访问的！

1.  输入一个域名，回车 
2.  检查本机的`C:\Windows\System32\drivers\etc\hosts`配置文件下有没有这个域名的映射 
   1.  有：直接返回对应的 ip 地址，这个地址中，有我们需要访问的 web 程序，可以直接访问 

```java
127.0.0.1   	www.qinjiang.com
```

   2.  没有：去 DNS 服务器去找，找到的话就返回，找不到就返回找不到 

![20240503210410](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240503210410.png)

### 发布一个Web网站

将自己写的网站，放到服务器（Tomcat）中指定的web应用的文件夹（webapps）下，就可以访问了

网站应有的结构：

```xml
--webapps:Tomcat服务器的web目录
	-Root
	-kuangstudy:网站的目录名
		-WEB-INF
			-classes:java程序
			-lib:web应用所依赖的jar包
			-web.xml:网站配置文件
		-index.html 默认的首页
		-static
            -css
            	-style.css
            -js
            -img
         -.......
```

## HTTP

### 什么是HTTP

超文本传输协议（Hyper Text Transfer Protocol，HTTP）是一个简单的请求-响应协议，它通常运行在[TCP](https://baike.baidu.com/item/TCP/33012)之上。它指定了客户端可能发送给服务器什么样的消息以及得到什么样的响应。请求和响应消息的头以[ASCII](https://baike.baidu.com/item/ASCII/309296)形式给出；而消息内容则具有一个类似[MIME](https://baike.baidu.com/item/MIME/2900607)的格式。这个简单模型是早期[Web](https://baike.baidu.com/item/Web/150564)成功的有功之臣，因为它使开发和部署非常地直截了当

- 文本：html，字符串，~.....
- 超文本：图片，音乐，视频，定位，地图.......
- 默认端口：80

HTPS：安全的

- 默认端口：443

### HTTP请求

客户端---发送请求（Request）---服务器

百度：

```
Request URL: https://www.baidu.com/		请求地址
Request Method: GET		get方法/post方法
Status Code: 200 OK		状态码：200
Remote（远程） Address: 110.242.68.4:443
```

```
Accept: text/html
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.9		语言
Cache-Control: max-age=0
Connection: keep-alive
```

#### 请求行

- 请求行中的请求方式：GET
- 请求方式：Get/Post 
   - get：一次请求能够携带的参数较少，大小有限制，会在浏览器的URL地址栏显示数据内容，不安全，但高效
   - post：一次请求能够携带的参数没有限制，大小没有限制，不会在浏览器的URL地址栏显示数据内容，安全，但不高效

#### 请求头

```
Accept:告诉浏览器，它所支持的数据类型
Accept-Encoding:支持哪种编码格式 GBK UTF-8 GB2312  ISo8859-1
Accept-Language:告诉浏览器他的语言环境
Cache-Control:缓存控制
Connection: 告诉浏览器，请求完成是断开还是保持连接
HOST：主机
```

### HTTP响应

服务器---响应---客户端

百度：
```
Cache-Control: private		缓存控制
Connection: keep-alive		连接
Content-Encoding: gzip		编码
Content-Type: text/html;charset=utf-8		类型
```

#### 响应体

```
Accept:告诉浏览器，它所支持的数据类型
Accept-Encoding:支持哪种编码格式 GBK UTF-8 GB2312  ISo8859-1
Accept-Language:告诉浏览器他的语言环境
Cache-Control:缓存控制
Connection: 告诉浏览器，请求完成是断开还是保持连接
HOST：主机
Refrush：告诉客户端，多久刷新一次
Location：让网页重新定位
```

#### 响应状态码

200：相应成功
3xx：请求重定向
4xx：找不到资源 404
5xx：服务器代码错误 500	502：网关错误

## Servlet

### 简介

- Servlet 是 sun 公司开发动态web的一门技术
- Sun 在这些 API 中提供的一个接口叫做：Servlet，如果你想开发一个 Servlet 程序，只需要完成两个步骤： 
   - 编写一个类，实现 Servlet 接口
   - 把开发好的 Java 类部署到 web 服务器中

把实现了 Servlet 程序的 Java 程序叫做，Servlet

### HelloServlet

Servlet 接口 sun 公司有两个默认的实现类：`HttpServlet`，`GenericServlet`

一、构建一个空白Maven项目，删掉里面的src目录，之后的学习就在这个项目里建立 Moudel；这个空的工程就是 Maven 的主工程

Servlet 依赖：

```xml
<dependency>
     <groupId>jakarta.servlet</groupId>
     <artifactId>jakarta.servlet-api</artifactId>
     <version>5.0.0</version>
     <scope>provided</scope>
</dependency>
```

JSP依赖：

```xml
<!-- https://mvnrepository.com/artifact/javax.servlet.jsp/javax.servlet.jsp-api -->
 <dependency>
     <groupId>javax.servlet.jsp</groupId>
     <artifactId>javax.servlet.jsp-api</artifactId>
     <version>2.3.1</version>
     <scope>provided</scope>
 </dependency>
 
 <!--Tomcat10的依赖-->
 <dependency>
     <groupId>jakarta.servlet.jsp</groupId>
     <artifactId>jakarta.servlet.jsp-api</artifactId>
     <version>3.0.0</version>
     <scope>provided</scope>
</dependency>
```

二、关于Maven父子工程的理解

父项目中会有

```xml
<modules>
		<module>servlet-01</module>
</modules>
```

子项目中会有

```xml
<parent>
     <artifactId>demo3</artifactId>
     <groupId>org.example</groupId>
     <version>1.0-SNAPSHOT</version>
</parent>
```

父项目中的Java子项目可以直接使用

```java
son extends father
```

三、Maven 环境优化

1、修改web.xml为最新的

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee
                      http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0"
         metadata-complete="true">
  
</web-app>
```

2、将Maven的结构搭建完整

四、编写一个Servlet程序

1、编写一个普通类

2、实现 Servlet 接口，这里我们直接继承 HttpServlet

```java
public class HelloServlet extends HttpServlet {
   //由于get或者post只是请求实现的不同方式，可以相互调用，业务逻辑都一样
   @Override
   protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
       PrintWriter writer = resp.getWriter();//相应流
       writer.print("Hello,Servlet");
   }

   @Override
   protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
       doGet(req,resp);
   }
}
```

五、编写 Servlet 的映射(在web.xml中)

为什么需要映射：我们写的是 Java 程序，但是需要通过浏览器访问，而浏览器需要连接 web 服务器，所以我们需要在 web 服务器中注册我们写的 Servlet，还需要给他一个浏览器能够访问的路径

```xml
<!--注册Servlet-->
 <servlet>
   <servlet-name>hello</servlet-name>
   <servlet-class>com.java.Servlet.HelloServlet</servlet-class>
 </servlet>
 <!--Servlet的请求路径-->
 <servlet-mapping>
   <servlet-name>hello</servlet-name>
   <url-pattern>/hello</url-pattern>
 </servlet-mapping>
```

一个 Servlet 要对应一个 Class 文件

六、配置 Tomcat

注意项目发布的路径

七、启动测试

问题：Tomcat10 无法实例化类

Tomcat10 对 Servlet 依赖包级目录改变，Maven 导入依赖时应该导入：

```xml
<dependency>
     <groupId>jakarta.servlet.jsp</groupId>
     <artifactId>jakarta.servlet.jsp-api</artifactId>
     <version>3.0.0</version>
     <scope>provided</scope>
</dependency>
<dependency>
     <groupId>jakarta.servlet</groupId>
     <artifactId>jakarta.servlet-api</artifactId>
     <version>5.0.0</version>
     <scope>provided</scope>
</dependency>
```

### Servlet详解

#### 核心接口和类

在 Servlet 体系结构中，除了实现 Servlet 接口，还可以通过继承 GenericServket 和 HttpServlet 类，实现编写

##### Servlet接口

在 Servlet API 中最重要的是 Servlet 接口，所有的 Servlet 都会直接或间接的与该窗口发生关系，或是直接实现该接口，或间接继承自实现了该接口的类

该接口包含以下五个方法：

```java
init(ServletConfig config)

ServletConfig getServletConfig()

service(ServletRequest req,ServletResponse res)

String getServletInfo()

destroy()
```

##### GenericServlet抽象类

GenericServlet 抽象类使得编写 Servlet 变得容易。它提供的生命周期方法 init 和 destroy 的简单实现，要编写一般的 Servlet，只需要重写 service 方法即可

##### HttpServlet类

HttpServlet 是继承 GenericServlet 的基础上进一步的拓展

提供将要被子类化以创建适用于 Web 站点的 HttpServlet 抽象类。HttpServlet 的子类至少重写一个方法，该方法通常是以下这些方法之一：

```java
doGet，如果servlet支持HTTP GET请求

doPost，用于HTTP POST请求

doput，用于HTTP PUT请求

doDelete，用于HTTP DELETE请求
```

#### Servlet的两种创建方式

##### 实现接口Servlet

```java
/*
* Servlet创建的第一种方式：实现接口Servlet
* */
public class HelloServlet02 implements Servlet {
    @Override
    public void init(ServletConfig servletConfig) throws ServletException {

    }

    @Override
    public ServletConfig getServletConfig() {
        return null;
    }

    @Override
    public void service(ServletRequest servletRequest, ServletResponse servletResponse) throws ServletException, IOException {

    }

    @Override
    public String getServletInfo() {
        return null;
    }

    @Override
    public void destroy() {

    }
}
```

该方式比较麻烦，需要实现接口中的所有方法

##### 继承HttpServlet(推荐)

```java
public class HelloServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException, IOException {
        PrintWriter writer = resp.getWriter();//相应流
        writer.print("Hello,Servlet");
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doGet(req,resp);
    }
}
```

##### 常见错误

```java
HTTP Status 404 资源找不到
     - 第一种情况：地址书写错误
     - 第二种情况：地址没有问题，把IDEA项目中的out目录删去，然后重新运行
 - Servlet地址配置重复。
 - Servlet地址配置错误。
```

#### Servlet两种配置方式

##### 使用web.xml配置

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee
                      http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0"
         metadata-complete="true">

    <!--注册Servlet-->
    <servlet>
        <!--名称-->
        <servlet-name>hello</servlet-name>
        <!--Servlet的全称名称-->
        <servlet-class>com.java.servlet.HelloServlet</servlet-class>
        <!--启动的优先级，数字越小越先起作用-->
        <load-on-startup>1</load-on-startup>
    </servlet>
    <!--映射配置-->
    <!--Servlet的请求路径-->
    <servlet-mapping>
        <!--名称-->
        <servlet-name>hello</servlet-name>
        <!--资源匹配规则：精确匹配-->
        <url-pattern>/hello</url-pattern>
    </servlet-mapping>
    <!--Error-->
    <servlet>
        <servlet-name>error</servlet-name>
        <servlet-class>com.java.servlet.ErrorServlet</servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>error</servlet-name>
        <url-pattern>/*</url-pattern>
    </servlet-mapping>
</web-app>
```

url-pattern定义匹配规则，取值说明：

| 精准匹配 | /具体的名称 | 只有url路径是具体的名称的时候才会触发Servlet |
| --- | --- | --- |
| 后缀匹配 | *.xxx | 只要是以xxx结尾的就匹配触发Servlet |
| 通配符匹配 | /* | 匹配所有请求，包含服务器的所有资源 |
| 通配符匹配 | / | 匹配所有请求，包含服务器的所有资源，不包括.jsp |

load-on-startup

1. 元素标记容器是否应该在 web 应用程序的时候就加载这个 Servlet
2. 它的值必须是一个整数，表示 servlet 被加载的先后顺序
3. 如果该元素的值为负数或没有设置，则容器会当 Servlet 被请求时再加载
4. 如果值为正整数或者0时，表示容器在应用启动时就加载并初始化这个 Servlet，值越小，servlet 的优先级越高，就越被优先加载。值相同时，容器就会自己选择顺序来加载

##### 使用注解

```java
@WebServlet("/hello")
public class HelloServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException, IOException {
        PrintWriter writer = resp.getWriter();//相应流
        writer.print("Hello,Servlet");
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doGet(req,resp);
    }
}
```

##### @WebServlet注解常用属性

> - name：Servlet名字（可选）
> - value：配置url路径，可以配置多个。例：`@WebServlet(value = {"/bs","/bbs"})`
> - urlPatterns：配置url路径，和value作用一样，不能同时使用
> - loadOnStartup配置Servlet的创建的时机，如果是0或者正数，启动程序时创建，如果是负数，则访问时创建。数字越小优先级越高

### Servlet应用

#### request对象

在 Servlet 中用来处理客户端请求需要用到doGet或doPost方法的request对象

![20240503212632](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240503212632.png)

##### get和post的区别

get 请求：

get 请求的数据会放在url之后，以？分隔URL和传输数据，参数之间以&连接

get 方式明文传递，数据量小，不安全

效率高，浏览器默认请求方法为 GET 请求

对应的 Servlet 方法是 doGet

post 请求：

post 是把提交的数据放在 HTTP 包的 body 中

密文传输数据，数据量大，安全

效率相对没有 GET 高

对应的方法是 doPost

##### request主要方法

| 方法名 | 说明 |
| --- | --- |
| String getParameter(String name) | 根据表单组件名称获取提交数据 |
| void setCharacterEncoding(String charset) | 指定每个请求的编码 |

##### request应用

HTML页面：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>注册页面</title>
</head>
<body>
    <form action="rs" method="get">
        用户名：<input type="text" name="username"><br/>
        密码：<input type="password" name="password"><br/>
        <input type="submit" value="注册">
    </form>
</body>
</html>
```

Servlet 代码：

```java
@WebServlet(value = "/rs")
public class RegisterServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        //1.获取用户请求发送的数据
        String username=req.getParameter("username");
        String password=req.getParameter("password");
        System.out.println("提交的数据"+username+"\t"+password);
    }
}
```

##### get请求收参问题

产生乱码是因为客户端和服务器沟通的编码不一样导致的，解决的办法为：在客户端和服务端设置一个统一的编码，之后就按照此编码进行数据的传输和接收

##### get中文乱码

在 Tomcat7 及以下版本，客户端以 UTF-8 的编码传输数据到客户端，而服务端的 request 对象使用的是ISO8859-1这个字符编码来接收数据，服务器与客户端沟通的编码不一致才导致产生中文乱码

解决办法：在接收到指定数据后，先获取 request 对象以 ISO8859-1 字符编码接收到的原始数据的字节数组，然后通过字节数组以指定的编码构建字符串，解决乱码问题

Tomcat8 的版本中 get 方式不会出现乱码，因为服务器对 url 的编码格式可以进行自动转换

解决get中文乱码的代码：

```java
@WebServlet("/GETServlet")
public class GetServlet extend HttpServlet{
    private static final long serialVersionUID=1L;
    
     protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
         //获取表单提交的信息
         String name=req.getParameter("name");
         name=new String(name.getBytes("ISO8859-1"),"UTF-8");
         //获取年龄
         String age=req.getParameter("age");
         //服务端打印输出
         System.out.println(req.getRemoteAddr()+"发来信息：姓名："+name+"--->年龄："+age);
     }
}
```

##### post中文乱码

由于客户端是以 UTF-8 字符编码将表单传输到服务器端的，因此服务器也需要设置以 UTF-8 字符编码进行接收

解决方案：使用从 ServletRequest 接口继承来的 setCharacterEncoding(charset) 方法进行统一的编码设置

```java
@WebServlet("/GETServlet")
public class GetServlet extend HttpServlet{
    private static final long serialVersionUID=1L;
    
     protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
         //设置请求参数的编码格式---对GET无效
         req.setCharacterEncoding("UTF-8");
         //获取表单提交的信息
         String name=req.getParameter("name");
         //服务端打印输出
         System.out.println(req.getRemoteAddr()+"发来信息：姓名："+name);
     }
}
```

#### response对象

response对象用于相应客户请求并向客户端输出信息

![20240503212848](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240503212848.png)

##### response主要方法

| 方法名称 | 作用 |
| --- | --- |
| setHeader(name,value) | 设置响应信息头 |
| setContentType(String) | 设置响应文件类型、响应式的编码格式 |
| setCharacterEncoding(String) | 设置服务端响应内容编码格式 |
| getWriter() | 获取字符输出流 |

案例：使用 response 对象向浏览器输出HTML内容，实现用户登录后，输出Login Success

```java
PrintWriter writer = resp.getWriter();
out.println("<html>");
out.println("<head><title>login</title></head>");
out.println("<body>");
out.println("<h1>Login Success!</h1>");
out.println("</body>");
out.println("</html>");
```

如果输出包含中文，则出现乱码，因为服务器默认使用 ISO8859-1 编码响应内容

##### 解决输出中文乱码

- 设置服务器响应的编码格式
- 设置客户端响应内容的头文件内容的文件类型及编码格式

不推荐：

```java
response.setCharacterEncoding("utf-8");//设置响应编码格式为utf-8
response.setHeader("Content-type","text/html;charset=UTF-8")
```

推荐：

同时设置服务端的编码格式和响应端的文件类型及响应时的编码格式

```java
response.setContentType("text/html;charset=UTF-8");
```

### Servlet原理

Servlet 是由 Web 服务器调用，Web 服务器在收到浏览器请求后，会：

![20240503212928](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240503212928.png)

### Mapping问题

1、一个 Servlet 可以指定一个映射路径

```xml
<servlet-mapping>
   <servlet-name>hello</servlet-name>
   <url-pattern>/hello</url-pattern>
</servlet-mapping>
```

2、一个 Servlet 可以指定多个映射路径

```xml
<servlet-mapping>
   <servlet-name>hello</servlet-name>
   <url-pattern>/hello</url-pattern>
</servlet-mapping>
<servlet-mapping>
   <servlet-name>hello</servlet-name>
   <url-pattern>/hello1</url-pattern>
</servlet-mapping>
<servlet-mapping>
   <servlet-name>hello</servlet-name>
   <url-pattern>/hello2</url-pattern>
</servlet-mapping>
```

3、一个Servlet可以指定通用映射路径

```xml
<servlet-mapping>
       <servlet-name>hello</servlet-name>
       <url-pattern>/hello/*</url-pattern>
</servlet-mapping>
```

4、默认请求路径

```xml
<servlet-mapping>
       <servlet-name>hello</servlet-name>
       <url-pattern>/*</url-pattern>
</servlet-mapping>
```

5、指定一些后缀或前缀等等

```xml
<!--可以自定义后缀实现请求映射
   	注意，*前面不能加项目映射的路径
   	hello/sdhawuhd.qinjiang-->
 <servlet-mapping>
         <servlet-name>hello</servlet-name>
         <url-pattern>*.qinjiang</url-pattern>
 </servlet-mapping>
```

6、优先级问题

指定了固有的映射路径优先级最高，如果找不到就会走默认的处理请求

```xml
<!--404-->
<servlet>
   <servlet-name>error</servlet-name>
   <servlet-class>com.java.servlet.ErrorServlet</servlet-class>
</servlet>
<servlet-mapping>
   <servlet-name>error</servlet-name>
   <url-pattern>/*</url-pattern>
</servlet-mapping>
```

### 问题

IDEA 创建 maven web 项目出现“No archetype found in remote catalog. Defaulting to internal catalog”：

1、新建一个名为`archetype-catalog.xml ` 的文件

内容为：

```xml
<?xml version="1.0" encoding="UTF-8"?>
   <archetype-catalog xmlns="http://maven.apache.org/plugins/maven-archetype-plugin/archetype-catalog/1.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/plugins/maven-archetype-plugin/archetype-catalog/1.0.0 http://maven.apache.org/xsd/archetype-catalog-1.0.0.xsd">
   	<archetypes>
   		<archetype>
   			<groupId>com.fr</groupId>
   			<artifactId>fr-server</artifactId>
   			<version>7.0</version>
   			<repository>
   				http://git.oschina.net/thinkgem/repos/raw/master
   			</repository>
   		</archetype>
   		<archetype>
   			<groupId>com.fr</groupId>
   			<artifactId>fr-third</artifactId>
   			<version>7.0</version>
   			<repository>
   				http://git.oschina.net/thinkgem/repos/raw/master
   			</repository>
   		</archetype>
   	</archetypes>
   </archetype-catalog>
```

2、将`archetype-catalog.xml ` 放到自己创建的仓库里

3、为IDEA新建项目设置 archetype 的使用方式为 local， File--new project Settings--Settings for new project--Build, Execution, Deployment --Build Tools --Maven -- Runner

![20240503213021](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240503213021.png)

4、重新构建 Maven 项目

5、settings.xml 用 Maven 安装目录下的那个，本地仓库用自己创建的那个, 在下边新建一项：键为 archetypeCatalog，值为 internal

![20240503213033](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240503213033.png)

6、问题解决

### ServletContext

web 容器在启动的时候，它会为每个 web 程序都创建一个对应的 ServletContext 对象，它代表了当前的 web 应用

#### 共享数据

在这个 Servlet 中保存的数据，可以在另一个 Servlet 中拿到

![20240503213108](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240503213108.png)

```java
public class HelloServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        ServletContext servletContext = this.getServletContext();
        String name="张三";
        servletContext.setAttribute("username",name);

    }
}
```

```java
public class GetServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        ServletContext context = this.getServletContext();
        String username = (String) context.getAttribute("username");


        resp.setContentType("text/html");
        resp.setCharacterEncoding("utf-8");
        resp.getWriter().print("名字"+username);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    }
}
```

```xml
<servlet>
    <servlet-name>Hello</servlet-name>
    <servlet-class>com.java.servlet.HelloServlet</servlet-class>
</servlet>
<servlet-mapping>
    <servlet-name>Hello</servlet-name>
    <url-pattern>/Hello</url-pattern>
</servlet-mapping>

<servlet>
    <servlet-name>getc</servlet-name>
    <servlet-class>com.java.servlet.GetServlet</servlet-class>
</servlet>
<servlet-mapping>
    <servlet-name>getc</servlet-name>
    <url-pattern>/getc</url-pattern>
</servlet-mapping>
```

#### 获取初始化参数

在 web.xml 中

```xml
<!--配置一些web应用初始化参数-->
<context-param>
    <param-name>url</param-name>
    <param-value>jdbc:mysql://localhost:3306/mybatis</param-value>
</context-param>
```

```java
protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        ServletContext context = this.getServletContext();
        String url = context.getInitParameter("url");
    	resp.getWriter().print(url);
}
```


## MVC框架

### 概念

MVC 又称为编程模式，是一种软件设计思想，将数据操作、页面展示、业务逻辑分为三个层级(模块),独立完成，又相互调用

- 模型层（Model）
- 视图（View）
- 控制器（Controller）

### MVC模式详解

MVC 并不是 Java 独有的，现在几乎所有的 B/S 的架构都采用了 MVC 模式

- 视图 View：视图即是用户看到并与之交互的界面，比如HTML（静态资源），JSP（动态资源）等等
- 控制器 Controller：控制器即是控制请求的处理逻辑，对请求处理，负责流程跳转（转发和重定向）
- 模型 Model：对客观世界的一种代表和模拟（业务模拟、对象模拟）

![20240503213249](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240503213249.png)

### 优点

- 低耦合性：模块与模块之间的关联性不强，不与某一具体实现产生密不可分的关联性
- 高维护性：基于低耦合性，可做到不同层级之间的功能模块灵活更换、插拔
- 高重用性：相同的数据库操作，可以服务于不同的业务处理。将数据作为独立模块，提高重用性

### MVC在框架中的应用

MVC 模式被广泛用于 Java 的各种框架中，比如 Struts2、SpringMVC 等等都用到了这种思想

![20240503213310](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240503213310.png)

### 三层架构与MVC

#### 三层架构

View层（表示界面层）、Service层（业务逻辑层）、DAO层（数据访问层）

![20240503213322](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240503213322.png)

#### MVC与三层架构的区别

- MVC 强调的是视图和业务代码的分离。严格的说 MVC 关注的是 Web 层。Vie w就是单独的页面，如 JSP、HTML 等，不负责业务处理，只负责数据的展示。而数据封装到 Model 里，由 Controller 负责在 V 和 M 之间传递。MVC 强调业务和视图分离
- 三层架构是“数据访问层”、“业务逻辑层”、“表示层”，指的是代码之间的解耦，方便维护和复用


