---
id: logback
slug: /logback
title: Logback日志打印
date: 2024-02-15
tags: [Logback]
keywords: [Logback]
---
## 介绍
在开发后端项目时，打印日志是必不可少的。Spring Boot 项目中的日志框架常用的有 Log4j、Logback，本文使用 Logback 框架，该框架需要一个`logback-spring.xml`的配置文件

本文教你从 0 到 1 写出一份自己的`logback-spring.xml`
## 准备
创建一个新的 Spring Boot 项目，版本号为 2.7.13 。结构如下：

![20240215162526](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240215162526.png)

pom 文件内容如下：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.7.13</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <groupId>xyz.kbws</groupId>
    <artifactId>logback</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>logback</name>

    <properties>
        <java.version>1.8</java.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>

</project>

```

项目启动之后，输出下面的日志

![20240215162604](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240215162604.png)

接下来引入 logback 核心组件，因为 Spring Boot 自带 logback 组件，所以引入时不需要指定版本号
```xml
<!-- logback核心组件 -->
<dependency>
  <groupId>ch.qos.logback</groupId>
  <artifactId>logback-core</artifactId>
</dependency>

```

然后，在 resources 目录下创建一个`spring-logback.xml`文件，内容如下：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
   
</configuration>

```

重启项目，看到控制台只输出一个 banner，就说明配置文件生效了

![20240215162623](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240215162623.png)

## 基础
### 输出日志到控制台
#### 配置控制台的appender
logback 中 appender 是负责写日志的组件
```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <!-- 配置控制台输出 -->
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <!-- 配置日志打印格式 -->
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] ${PID:- } %logger{36} %-5level - %msg%n</pattern>
            <charset>utf8</charset>
        </encoder>
    </appender>
</configuration>

```
#### 设置打印的日志级别
```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <!-- 配置控制台输出 -->
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <!-- 配置日志打印格式 -->
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] ${PID:- } %logger{36} %-5level - %msg%n</pattern>
            <charset>utf8</charset>
        </encoder>
    </appender>

    <!-- 配置输出级别，加入输出方式 -->
    <root level="INFO">
        <appender-ref ref="CONSOLE"/>
    </root>
</configuration>

```

这时启动项目后，控制台就会有日志输出了：

![20240215162641](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240215162641.png)

#### 添加logback的一些默认配置
上面的输出样式很丑，可以用 logback 提供的一些默认配置
```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <!-- 默认的一些配置 -->
    <include resource="org/springframework/boot/logging/logback/defaults.xml"/>

    <!-- 配置控制台输出 -->
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <!-- 使用默认的输出格式打印 -->
            <pattern>${CONSOLE_LOG_PATTERN}</pattern>
            <charset>utf8</charset>
        </encoder>
    </appender>

    <!-- 配置输出级别，加入输出方式 -->
    <root level="INFO">
        <appender-ref ref="CONSOLE"/>
    </root>
</configuration>

```

重新启动后，发现好看多了

![20240215162654](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240215162654.png)

### 将日志输出到文件
将项目部署到服务器后，项目肯定是后台运行，这样就看不到控制台的输出了，所以将项目输出日志保存到文件中，有助于后面排查 Bug 或检查项目运行情况
#### 定义应用名称、文件输出路径、文件名称
```xml
<!-- 定义应用名称，区分应用 -->
<property name="APP_NAME" value="logback-test"/>
<!--定义日志文件输出路径-->
<property name="LOG_PATH" value="${user.home}/logs/${APP_NAME}"/>
<!-- 定义日志文件名称和路径 -->
<property name="LOG_FILE" value="${LOG_PATH}/application.log"/>
```
#### 将日志滚动输出到application.log文件中
```xml
<!-- 将日志滚动输出到application.log文件中 -->
<appender name="APPLICATION"
					class="ch.qos.logback.core.rolling.RollingFileAppender">
		<!-- 输出文件目的地 -->
		<file>${LOG_FILE}</file>
		<encoder>
				<!-- 使用默认的输出格式打印 -->
				<pattern>${FILE_LOG_PATTERN}</pattern>
				<charset>utf8</charset>
		</encoder>
</appender>
```
**注意**：这里的输出格式要用`FILE_LOG_PATTERN`而不是`CONSOLE_LOG_PATTEN`不然写入文件的日志会乱码
#### 配置文件大小、保留天数、文件名格式
```xml
<!-- 将日志滚动输出到application.log文件中 -->
<appender name="APPLICATION"
					class="ch.qos.logback.core.rolling.RollingFileAppender">
		<!-- 输出文件目的地 -->
		<file>${LOG_FILE}</file>
		<encoder>
				<!-- 使用默认的输出格式打印 -->
				<pattern>${CONSOLE_LOG_PATTERN}</pattern>
				<charset>utf8</charset>
		</encoder>
		<!-- 设置 RollingPolicy 属性，用于配置文件大小限制，保留天数、文件名格式 -->
		<rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
				<!-- 文件命名格式 -->
				<fileNamePattern>${LOG_FILE}.%d{yyyy-MM-dd}.%i.log</fileNamePattern>
				<!-- 文件保留最大天数 -->
				<maxHistory>7</maxHistory>
				<!-- 文件大小限制 -->
				<maxFileSize>50MB</maxFileSize>
				<!-- 文件总大小 -->
				<totalSizeCap>500MB</totalSizeCap>
		</rollingPolicy>
</appender>

```
#### 追加日志到application中
```xml
<!-- 配置输出级别，加入输出方式 -->
<root level="INFO">
		<!--加入控制台输出-->
		<appender-ref ref="CONSOLE"/>
		<!-- 加入APPLICATION输出 -->
		<appender-ref ref="APPLICATION"/>
</root>
```

完整配置文件
```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <!-- 默认的一些配置 -->
    <include resource="org/springframework/boot/logging/logback/defaults.xml"/>

    <!-- 定义应用名称，区分应用 -->
    <property name="APP_NAME" value="logback-test"/>
    <!--定义日志文件输出路径-->
    <property name="LOG_PATH" value="${user.home}/logs/${APP_NAME}"/>
    <!-- 定义日志文件名称和路径 -->
    <property name="LOG_FILE" value="${LOG_PATH}/application.log"/>

    <!-- 将日志滚动输出到application.log文件中 -->
    <appender name="APPLICATION"
              class="ch.qos.logback.core.rolling.RollingFileAppender">
        <!-- 输出文件目的地 -->
        <file>${LOG_FILE}</file>
        <encoder>
            <!-- 使用默认的输出格式打印 -->
            <pattern>${FILE_LOG_PATTERN}</pattern>
            <charset>utf8</charset>
        </encoder>
        <!-- 设置 RollingPolicy 属性，用于配置文件大小限制，保留天数、文件名格式 -->
        <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
            <!-- 文件命名格式 -->
            <fileNamePattern>${LOG_FILE}.%d{yyyy-MM-dd}.%i.log</fileNamePattern>
            <!-- 文件保留最大天数 -->
            <maxHistory>7</maxHistory>
            <!-- 文件大小限制 -->
            <maxFileSize>50MB</maxFileSize>
            <!-- 文件总大小 -->
            <totalSizeCap>500MB</totalSizeCap>
        </rollingPolicy>
    </appender>

    <!-- 配置控制台输出 -->
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <!-- 使用默认的输出格式打印 -->
            <pattern>${CONSOLE_LOG_PATTERN}</pattern>
            <charset>utf8</charset>
        </encoder>
    </appender>

    <!-- 配置输出级别，加入输出方式 -->
    <root level="INFO">
        <!--加入控制台输出-->
        <appender-ref ref="CONSOLE"/>
        <!-- 加入APPLICATION输出 -->
        <appender-ref ref="APPLICATION"/>
    </root>
</configuration>

```

然后我们启动项目，可以在电脑的如下路径找到`application.log`文件，里面存放的就是日志输出

![20240215162718](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240215162718.png)

#### 将日志文件存放到项目文件夹中
上面的文件保存位置不是很友好，开发中寻找起来很麻烦，而且没有按照项目进行归类，我们可以将日志输出文件保存到当前项目所在的文件夹中，这样就方便我们进行查找和排除了
将
```xml
<!--定义日志文件输出路径-->
<property name="LOG_PATH" value="${user.home}/logs/${APP_NAME}"/>
```
改为
```xml
<!--日志输出文件夹-->
<property name="LOG_FOLDER" value="logs"/>
```
这样项目启动之后，会将日志输入文件保存在项目目录下的 logs 文件夹中

![20240215162731](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240215162731.png)

### 日志分级
将 INFO、WARN、ERROR 日志分别打印，方便后续排查 bug
#### 定义日志文件路径
```xml
<!--日志输出文件夹-->
<property name="LOG_FOLDER" value="logs"/>
<!-- 定义日志文件的输出路径 -->
<property name="LOG_PATH" value="${LOG_FOLDER}"/>
<!-- 定义日志文件名称和路径 -->
<property name="LOG_FILE" value="${LOG_PATH}/application.log"/>
<!-- 定义警告级别日志文件名称和路径 -->
<property name="WARN_LOG_FILE" value="${LOG_PATH}/warn.log"/>
<!-- 定义错误级别日志文件名称和路径 -->
<property name="ERROR_LOG_FILE" value="${LOG_PATH}/error.log"/>
```
#### 将不同级别的日志分离并输出到指定文件
```xml
<!-- 将日志滚动输出到application.log文件中 -->
<appender name="APPLICATION"
					class="ch.qos.logback.core.rolling.RollingFileAppender">
		<!-- 输出文件目的地 -->
		<file>${LOG_FILE}</file>
		<encoder>
				<!-- 使用默认的输出格式打印 -->
				<pattern>${FILE_LOG_PATTERN}</pattern>
				<charset>utf8</charset>
		</encoder>
		<!-- 设置 RollingPolicy 属性，用于配置文件大小限制，保留天数、文件名格式 -->
		<rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
				<!-- 文件命名格式 -->
				<fileNamePattern>${LOG_FILE}.%d{yyyy-MM-dd}.%i.log</fileNamePattern>
				<!-- 文件保留最大天数 -->
				<maxHistory>7</maxHistory>
				<!-- 文件大小限制 -->
				<maxFileSize>50MB</maxFileSize>
				<!-- 文件总大小 -->
				<totalSizeCap>500MB</totalSizeCap>
		</rollingPolicy>
</appender>

<!-- 摘取出WARN级别日志输出到warn.log中 -->
<appender name="WARN" class="ch.qos.logback.core.rolling.RollingFileAppender">
		<file>${WARN_LOG_FILE}</file>
		<encoder>
				<!-- 使用默认的输出格式打印 -->
				<pattern>${FILE_LOG_PATTERN}</pattern>
				<charset>utf8</charset>
		</encoder>
		<!-- 设置 RollingPolicy 属性，用于配置文件大小限制，保留天数、文件名格式 -->
		<rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
				<!-- 文件命名格式 -->
				<fileNamePattern>${LOG_PATH}/warn.%d{yyyy-MM-dd}.%i.log</fileNamePattern>
				<!-- 文件保留最大天数 -->
				<maxHistory>7</maxHistory>
				<!-- 文件大小限制 -->
				<maxFileSize>50MB</maxFileSize>
				<!-- 文件总大小 -->
				<totalSizeCap>500MB</totalSizeCap>
		</rollingPolicy>
		<!-- 日志过滤器，将WARN相关日志过滤出来 -->
		<filter class="ch.qos.logback.classic.filter.ThresholdFilter">
				<level>WARN</level>
		</filter>
</appender>

<!-- 摘取出ERROR级别日志输出到error.log中 -->
<appender name="ERROR" class="ch.qos.logback.core.rolling.RollingFileAppender">
		<file>${ERROR_LOG_FILE}</file>
		<encoder>
				<!-- 使用默认的输出格式打印 -->
				<pattern>${FILE_LOG_PATTERN}</pattern>
				<charset>utf8</charset>
		</encoder>
		<!-- 设置 RollingPolicy 属性，用于配置文件大小限制，保留天数、文件名格式 -->
		<rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
				<!-- 文件命名格式 -->
				<fileNamePattern>${LOG_PATH}/error.%d{yyyy-MM-dd}.%i.log</fileNamePattern>
				<!-- 文件保留最大天数 -->
				<maxHistory>7</maxHistory>
				<!-- 文件大小限制 -->
				<maxFileSize>50MB</maxFileSize>
				<!-- 文件总大小 -->
				<totalSizeCap>500MB</totalSizeCap>
		</rollingPolicy>
		<!-- 日志过滤器，将ERROR相关日志过滤出来 -->
		<filter class="ch.qos.logback.classic.filter.ThresholdFilter">
				<level>ERROR</level>
		</filter>
</appender>
```
#### 将不同级别的日志加到控制台打印
```xml
<!-- 配置输出级别，加入输出方式 -->
<root level="INFO">
		<!--加入控制台输出-->
		<appender-ref ref="CONSOLE"/>
		<!-- 加入APPLICATION输出 -->
		<appender-ref ref="APPLICATION"/>
		<!-- 加入WARN日志输出 -->
		<appender-ref ref="WARN"/>
		<!-- 加入ERROR日志输出 -->
		<appender-ref ref="ERROR"/>
</root>
```

完整配置文件
```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <!-- 默认的一些配置 -->
    <include resource="org/springframework/boot/logging/logback/defaults.xml"/>

    <!-- 定义应用名称，区分应用 -->
    <property name="APP_NAME" value="logback-test"/>
    <!--日志输出文件夹-->
    <property name="LOG_FOLDER" value="logs"/>
    <!-- 定义日志文件的输出路径 -->
    <property name="LOG_PATH" value="${LOG_FOLDER}"/>
    <!-- 定义日志文件名称和路径 -->
    <property name="LOG_FILE" value="${LOG_PATH}/application.log"/>
    <!-- 定义警告级别日志文件名称和路径 -->
    <property name="WARN_LOG_FILE" value="${LOG_PATH}/warn.log"/>
    <!-- 定义错误级别日志文件名称和路径 -->
    <property name="ERROR_LOG_FILE" value="${LOG_PATH}/error.log"/>

    <!-- 将日志滚动输出到application.log文件中 -->
    <appender name="APPLICATION"
              class="ch.qos.logback.core.rolling.RollingFileAppender">
        <!-- 输出文件目的地 -->
        <file>${LOG_FILE}</file>
        <encoder>
            <!-- 使用默认的输出格式打印 -->
            <pattern>${FILE_LOG_PATTERN}</pattern>
            <charset>utf8</charset>
        </encoder>
        <!-- 设置 RollingPolicy 属性，用于配置文件大小限制，保留天数、文件名格式 -->
        <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
            <!-- 文件命名格式 -->
            <fileNamePattern>${LOG_FILE}.%d{yyyy-MM-dd}.%i.log</fileNamePattern>
            <!-- 文件保留最大天数 -->
            <maxHistory>7</maxHistory>
            <!-- 文件大小限制 -->
            <maxFileSize>50MB</maxFileSize>
            <!-- 文件总大小 -->
            <totalSizeCap>500MB</totalSizeCap>
        </rollingPolicy>
    </appender>

    <!-- 摘取出WARN级别日志输出到warn.log中 -->
    <appender name="WARN" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>${WARN_LOG_FILE}</file>
        <encoder>
            <!-- 使用默认的输出格式打印 -->
            <pattern>${FILE_LOG_PATTERN}</pattern>
            <charset>utf8</charset>
        </encoder>
        <!-- 设置 RollingPolicy 属性，用于配置文件大小限制，保留天数、文件名格式 -->
        <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
            <!-- 文件命名格式 -->
            <fileNamePattern>${LOG_PATH}/warn.%d{yyyy-MM-dd}.%i.log</fileNamePattern>
            <!-- 文件保留最大天数 -->
            <maxHistory>7</maxHistory>
            <!-- 文件大小限制 -->
            <maxFileSize>50MB</maxFileSize>
            <!-- 文件总大小 -->
            <totalSizeCap>500MB</totalSizeCap>
        </rollingPolicy>
        <!-- 日志过滤器，将WARN相关日志过滤出来 -->
        <filter class="ch.qos.logback.classic.filter.ThresholdFilter">
            <level>WARN</level>
        </filter>
    </appender>

    <!-- 摘取出ERROR级别日志输出到error.log中 -->
    <appender name="ERROR" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>${ERROR_LOG_FILE}</file>
        <encoder>
            <!-- 使用默认的输出格式打印 -->
            <pattern>${FILE_LOG_PATTERN}</pattern>
            <charset>utf8</charset>
        </encoder>
        <!-- 设置 RollingPolicy 属性，用于配置文件大小限制，保留天数、文件名格式 -->
        <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
            <!-- 文件命名格式 -->
            <fileNamePattern>${LOG_PATH}/error.%d{yyyy-MM-dd}.%i.log</fileNamePattern>
            <!-- 文件保留最大天数 -->
            <maxHistory>7</maxHistory>
            <!-- 文件大小限制 -->
            <maxFileSize>50MB</maxFileSize>
            <!-- 文件总大小 -->
            <totalSizeCap>500MB</totalSizeCap>
        </rollingPolicy>
        <!-- 日志过滤器，将ERROR相关日志过滤出来 -->
        <filter class="ch.qos.logback.classic.filter.ThresholdFilter">
            <level>ERROR</level>
        </filter>
    </appender>

    <!-- 配置控制台输出 -->
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <!-- 使用默认的输出格式打印 -->
            <pattern>${CONSOLE_LOG_PATTERN}</pattern>
            <charset>utf8</charset>
        </encoder>
    </appender>

    <!-- 配置输出级别，加入输出方式 -->
    <root level="INFO">
        <!--加入控制台输出-->
        <appender-ref ref="CONSOLE"/>
        <!-- 加入APPLICATION输出 -->
        <appender-ref ref="APPLICATION"/>
        <!-- 加入WARN日志输出 -->
        <appender-ref ref="WARN"/>
        <!-- 加入ERROR日志输出 -->
        <appender-ref ref="ERROR"/>
    </root>
</configuration>

```

启动之后，我添加了一条 WARN、ERROR 日志

![20240215162812](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240215162812.png)

同时 logs 目录下也生成了 warn.log 和 error.log 文件，文件也有对应级别的日志

![20240215162823](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240215162823.png)

![20240215162834](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240215162834.png)

![20240215162845](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240215162845.png)

## 进阶
### 打印指定目录下的日志
假设项目中有一个 service 包，要将 service 包中的日志单独输出到 service.log 文件中

![20240215162857](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240215162857.png)

#### 定义指定目录日志文件输出路径
```xml
<!-- 定义指定目录service日志文件名称和路径 -->
<property name="SERVICE_LOG_FILE" value="${LOG_PATH}/service.log"/>
```
#### 定义指定目录日志的appender
```xml
<!-- 定义指定目录service的appender -->
<appender name="SERVICE" class="ch.qos.logback.core.rolling.RollingFileAppender">
		<file>${SERVICE_LOG_FILE}</file>
		<encoder>
				<!-- 使用默认的输出格式打印 -->
				<pattern>${FILE_LOG_PATTERN}</pattern>
				<charset>utf8</charset>
		</encoder>
		<!-- 设置 RollingPolicy 属性，用于配置文件大小限制，保留天数、文件名格式 -->
		<rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
				<!-- 文件命名格式 -->
				<fileNamePattern>${LOG_PATH}/service.%d{yyyy-MM-dd}.%i.log</fileNamePattern>
				<!-- 文件保留最大天数 -->
				<maxHistory>7</maxHistory>
				<!-- 文件大小限制 -->
				<maxFileSize>50MB</maxFileSize>
				<!-- 文件总大小 -->
				<totalSizeCap>500MB</totalSizeCap>
		</rollingPolicy>
</appender>
```
#### 追加日志到service的appender中
不能直接将 service 加到标签 root 下，要使用标签`logger`，该标签继承了 root，是子 logger。该标签有一个 `additivity` 属性，若是 additivity 设为 true，则子 logger 不止会在自己的 appender 里输出，还会在 root 的 logger 的 appender 里输出；若是 additivity 设为 false，则子 logger 只会在自己的 appender 里输出，不会在 root 的 logger 的 appender 里输出
```xml
<!-- 配置扫描包路径，追加日志到service的appender中 -->
<!--若是additivity设为true，则子Logger不止会在自己的appender里输出，还会在root的logger的appender里输出-->
<logger name="xyz.kbws.logback.service" level="INFO" additivity="true">
		<appender-ref ref="SERVICE"/>
</logger>
```
启动之后会多一个 service.log 文件

![20240215162919](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240215162919.png)

