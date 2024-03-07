---
id: oj-init
slug: /oj-init
title: 前后端项目初始化
keywords:
  - oj
  - Online Judge
  - 项目
  - Java
---
## 后端
### 项目初始化
#### 创建数据库
```sql
-- 建表脚本

-- 创建库
create database if not exists oj;

-- 切换库
use oj;

-- 用户表
create table if not exists user
(
    id           bigint auto_increment comment 'id' primary key,
    userAccount  varchar(256)                           not null comment '账号',
    userPassword varchar(512)                           not null comment '密码',
    userName     varchar(256)                           null comment '用户昵称',
    userAvatar   varchar(1024)                          null comment '用户头像',
    userProfile  varchar(512)                           null comment '用户简介',
    gender       varchar(256) default '男'              null comment '性别 男 女',
    phone        varchar(128)                           null comment '电话',
    email        varchar(512)                           null comment '邮箱',
    userState    varchar(256) default '正常'            not null comment '状态:0-正常/1-注销/2-封号',
    userRole     varchar(256) default 'user'            not null comment '用户角色：user/admin/ban',
    createTime   datetime     default CURRENT_TIMESTAMP not null comment '创建时间',
    updateTime   datetime     default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    isDelete     tinyint      default 0                 not null comment '是否删除',
    index idx_unionId (userAccount)
) comment '用户表' collate = utf8mb4_unicode_ci;

INSERT INTO `user` VALUES (1762780953043824641,'kbws','c9a8afeb7ad9c28c58042cd3255ac7c2',NULL,NULL,NULL,'男',NULL,NULL,'正常','admin','2024-02-28 18:05:04','2024-02-28 18:05:24',0);

-- 用户编号表
create table if not exists user_code
(
    id         bigint auto_increment comment 'id' primary key,
    userId     bigint                             not null comment '用户id',
    createTime datetime default CURRENT_TIMESTAMP not null comment '创建时间',
    updateTime datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    isDelete   tinyint  default 0                 not null comment '是否删除',
    index idx_userAccount (userId)
) comment '用户编号表' collate = utf8mb4_unicode_ci;

-- 题目表
create table if not exists question
(
    id          bigint auto_increment comment 'id' primary key,
    userId      bigint                             not null comment '创建题目用户 id',
    title       varchar(512)                       null comment '标题',
    content     text                               null comment '内容',
    tags        varchar(1024)                      null comment '标签列表（json 数组）',
    answer      text                               null comment '题目答案',
    judgeCase   text                               null comment '判题用例（json 数组）',
    judgeConfig text                               null comment '判题配置（json 对象）',
    submitNum   int      default 0                 not null comment '题目提交数',
    acceptedNum int      default 0                 not null comment '题目通过数',
    thumbNum    int      default 0                 not null comment '点赞数',
    favourNum   int      default 0                 not null comment '收藏数',
    createTime  datetime default CURRENT_TIMESTAMP not null comment '创建时间',
    updateTime  datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    isDelete    tinyint  default 0                 not null comment '是否删除',
    index idx_userId (userId)
) comment '题目' collate = utf8mb4_unicode_ci;


-- 题目提交表
create table if not exists question_submit
(
    id             bigint auto_increment comment 'id' primary key,
    questionId     bigint                             not null comment '题目 id',
    userId         bigint                             not null comment '创建用户 id',
    judgeInfo      text                               null comment '判题信息（json 对象）',
    submitLanguage varchar(128)                       not null comment '编程语言',
    submitCode     text                               not null comment '用户提交代码',
    submitState    int      default 0                 not null comment '判题状态（0 - 待判题、1 - 判题中、2 - 成功、3 - 失败）',
    createTime     datetime default CURRENT_TIMESTAMP not null comment '创建时间',
    updateTime     datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    isDelete       tinyint  default 0                 not null comment '是否删除',
    index idx_questionId (questionId),
    index idx_userId (userId)
) comment '题目提交';
```
#### 创建Maven项目

首先打开 Idea，创建一个干净的 Maven 项目

![20240307214404](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240307214404.png)

创建项目成功后，界面如下

![20240307214415](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240307214415.png)

#### 添加项目依赖
完整 pom.xml 文件内容如下
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>xyz.kbws</groupId>
    <artifactId>oj-backend-microservice</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <packaging>pom</packaging>
    <name>oj-backend-microservice</name>
    <description>OnlineJudge 在线判题系统</description>

    <properties>
        <java.version>1.8</java.version>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
        <spring-boot.version>2.6.13</spring-boot.version>
        <spring-cloud-alibaba.version>2021.0.5.0</spring-cloud-alibaba.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <!--JWT-->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt</artifactId>
            <version>0.9.1</version>
        </dependency>
        <!--Spring Cloud 依赖-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-dependencies</artifactId>
            <version>2021.0.5</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
        <!--负载均衡-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-loadbalancer</artifactId>
            <version>3.1.5</version>
        </dependency>
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-alibaba-sentinel-gateway</artifactId>
        </dependency>
        <!--Alibaba nacos 注册中心-->
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
        </dependency>
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-sentinel</artifactId>
        </dependency>
        <!--Redis-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.session</groupId>
            <artifactId>spring-session-data-redis</artifactId>
        </dependency>
        <!--Mybatis-->
        <dependency>
            <groupId>org.mybatis.spring.boot</groupId>
            <artifactId>mybatis-spring-boot-starter</artifactId>
            <version>2.2.2</version>
        </dependency>
        <!--Mybatis-Plus-->
        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus-boot-starter</artifactId>
            <version>3.5.2</version>
        </dependency>
        <!--Apache Commons工具库-->
        <dependency>
            <groupId>org.apache.commons</groupId>
            <artifactId>commons-lang3</artifactId>
        </dependency>
        <!--Gson数据-->
        <dependency>
            <groupId>com.google.code.gson</groupId>
            <artifactId>gson</artifactId>
            <version>2.9.1</version>
        </dependency>
        <!--EasyExcel文件处理-->
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>easyexcel</artifactId>
            <version>3.1.1</version>
        </dependency>
        <!--Hutool工具-->
        <dependency>
            <groupId>cn.hutool</groupId>
            <artifactId>hutool-all</artifactId>
            <version>5.8.8</version>
        </dependency>
        <!--集合工具库-->
        <dependency>
            <groupId>org.apache.commons</groupId>
            <artifactId>commons-collections4</artifactId>
            <version>4.4</version>
        </dependency>
        <!--热部署工具-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        <!--MySQL连接驱动-->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>
        <!--Lombok-->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <!--测试依赖-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-dependencies</artifactId>
                <version>${spring-boot.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
            <dependency>
                <groupId>com.alibaba.cloud</groupId>
                <artifactId>spring-cloud-alibaba-dependencies</artifactId>
                <version>${spring-cloud-alibaba.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <build>
        <plugins>
            <!--打包插件-->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.8.1</version>
                <configuration>
                    <source>1.8</source>
                    <target>1.8</target>
                    <encoding>UTF-8</encoding>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <version>${spring-boot.version}</version>
            </plugin>
        </plugins>
    </build>

</project>
```
### 公共模块
右键项目，点击新建，创建一个新模块

![20240307214556](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240307214556.png)

模块名称为`oj-backend-common`，然后点击创建

![20240307214606](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240307214606.png)

然后就可以看到父模块下多了一个`oj-backend-common`模块，Idea 还自动帮我们把子模块写入了父模块中

![20240307214614](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240307214614.png)

接下来，我们要在这个模块中，创建一些公共的类或者工具类。这样其他模块要使用工具类时，只需在`pom.xml`中引入这个公共模块就可以了，不用编写重复代码

#### annotation
`annotation`包，用于存放自定义注解，方便使用注解实现权限校验、登录校验等

创建`AuthCheck`注解
```java
package xyz.kbws.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * @author kbws
 * @date 2024/3/7
 * @description: 权限校验
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface AuthCheck {
    /**
     * 必须有某个角色
     */
    String mustRole() default "";
}
```
`@Target`用来定义你的注解用在什么地方（方法、类、注解、包等）
> `ElementType.METHOD`该枚举说明，当前注解只能被用于修饰方法


`@Retention`是用来修饰注解的注解，这样的注解被称为元注解。该注解用来定义你的注解在哪一个级别可用，在源代码中（SOURCE）、类文件中（CLASS）或者运行时（RUNTIME）

1. `RetentionPolicy.SOURCE`：注解只保留在源文件，当 Java 文件编译成`.class`文件时，被其标注的注解会被遗弃
2. `RetentionPolicy.CLASS`：注解被保留到`class`文件中，JVM 加载`.class`文件后，被其标注的注解会被遗弃，这是默认的生命周期
3. `RetetionPolicy.RUNTIME`：注解不仅被保留到`.class`文件中，JVM 加载`.class`文件后，被其标注的注解仍然在，这个时候才能通过反射机制读取注解的信息，而在前两个生命周期中，通过反射机制是读取不到注解信息的

#### common
`common`包中存放通用返回类、返回结果工具类、错误码等

创建`ErrorCode`枚举类
```java
package xyz.kbws.common;

import lombok.Getter;

/**
 * @author kbws
 * @date 2024/3/7
 * @description: 自定义错误码
 */
@Getter
public enum ErrorCode {
    SUCCESS(0, "ok"),
    PARAMS_ERROR(40000, "请求参数错误"),
    NOT_LOGIN_ERROR(40100, "未登录"),
    NO_AUTH_ERROR(40101, "无权限"),
    NOT_FOUND_ERROR(40400, "请求数据不存在"),
    FORBIDDEN_ERROR(40300, "禁止访问"),
    SYSTEM_ERROR(50000, "系统内部异常"),
    OPERATION_ERROR(50001, "操作失败"),
    API_REQUEST_ERROR(50010, "接口调用失败"),
    NULL_ERROR(40001, "请求数据为空"),
    TOO_MANY_REQUEST(42900, "请求过于频繁");

    /**
     * 状态码
     */
    private final int code;

    /**
     * 信息
     */
    private final String message;

    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

}
```

创建`BaseResponse`通用返回类
```java
package xyz.kbws.common;

import java.io.Serializable;

/**
 * @author kbws
 * @date 2024/3/7
 * @description: 通用返回类
 */
public class BaseResponse<T> implements Serializable {
    private int code;

    private T data;

    private String message;

    public BaseResponse(int code, T data, String message) {
        this.code = code;
        this.data = data;
        this.message = message;
    }

    public BaseResponse(int code, T data) {
        this(code, data, "");
    }

    public BaseResponse(ErrorCode errorCode) {
        this(errorCode.getCode(), null, errorCode.getMessage());
    }
}
```

创建`ResultUtils`返回工具类，方便我们返回统一的数据格式（直接调用静态方法，而不需要手动 new 一个 BaseResponse 类）

```java
package xyz.kbws.common;

/**
 * @author kbws
 * @date 2024/3/7
 * @description: 返回工具类
 */
public class ResultUtils {
    /**
     * 成功
     *
     * @param data
     * @param <T>
     * @return
     */
    public static <T> BaseResponse<T> success(T data) {
        return new BaseResponse<>(0, data, "ok");
    }

    /**
     * 失败
     *
     * @param errorCode
     * @return
     */
    public static BaseResponse error(ErrorCode errorCode) {
        return new BaseResponse<>(errorCode);
    }

    /**
     * 失败
     *
     * @param code
     * @param message
     * @return
     */
    public static BaseResponse error(int code, String message) {
        return new BaseResponse(code, null, message);
    }

    /**
     * 失败
     *
     * @param errorCode
     * @return
     */
    public static BaseResponse error(ErrorCode errorCode, String message) {
        return new BaseResponse(errorCode.getCode(), null, message);
    }
}

```

分页请求和删除请求都是使用频率很高的请求，在本项目中，我们也将这两个请求放在公共模块中，省得重复编写

创建`PageRequest`分页请求

```java
package xyz.kbws.common;

import lombok.Data;

/**
 * @author kbws
 * @date 2024/3/7
 * @description: 分页请求
 */
@Data
public class PageRequest {
    /**
     * 当前页号
     */
    private long current = 1;

    /**
     * 页面大小
     */
    private long pageSize = 10;

    /**
     * 排序字段
     */
    private String sortField;

    /**
     * 排序顺序（默认升序）
     */
    private String sortOrder = "ascend";
}
```

创建`DeleteRequest`删除请求

```java
package xyz.kbws.common;

import lombok.Data;

import java.io.Serializable;

/**
 * @author kbws
 * @date 2024/3/7
 * @description: 删除请求
 */
@Data
public class DeleteRequest implements Serializable {
    /**
     * id
     */
    private Long id;

    private static final long serialVersionUID = 1L;
}
```

#### config
`config`包中存放通用的配置，例如 Long 型的数据转换成 JSON 字符串时，会有精度丢失的问题，可以将相关配置写在这个包中

创建`JsonConfig`配置文件

```java
package xyz.kbws.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import org.springframework.boot.jackson.JsonComponent;
import org.springframework.context.annotation.Bean;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

/**
 * @author kbws
 * @date 2024/3/7
 * @description: JSON字符串相关配置
 */
@JsonComponent
public class JsonConfig {
    /**
     * 添加 Long 转 JSON 精度丢失的配置
     */
    @Bean
    public ObjectMapper jacksonObjectMapper(Jackson2ObjectMapperBuilder builder) {
        ObjectMapper objectMapper = builder.createXmlMapper(false).build();
        SimpleModule module = new SimpleModule();
        module.addSerializer(Long.class, ToStringSerializer.instance);
        module.addSerializer(Long.TYPE, ToStringSerializer.instance);
        objectMapper.registerModule(module);
        return objectMapper;
    }
}
```

#### constant

`constant`包中存放项目中用到常量：COS 对象存储的地址，RabbitMQ 中交换机、队列名称、路由键，用户常量和通用常量

创建`CommonConstant`接口，该文件用于存放通用常量

```java
package xyz.kbws.constants;

/**
 * @author kbws
 * @date 2024/3/7
 * @description: 通用常量
 */
public interface CommonConstant {
    /**
     * 升序
     */
    String SORT_ORDER_ASC = "ascend";

    /**
     * 降序
     */
    String SORT_ORDER_DESC = " descend";
}
```

创建`UserConstant`接口，存放用户相关常量

```java
package xyz.kbws.constants;

/**
 * @author kbws
 * @date 2024/3/7
 * @description: 用户常量
 */
public interface UserConstant {
    /**
     * 用户登录态键
     */
    String USER_LOGIN_STATE = "user_login";

    /**
     * 默认角色
     */
    String DEFAULT_ROLE = "user";

    /**
     * 管理员角色
     */
    String ADMIN_ROLE = "admin";

    /**
     * 被封号
     */
    String BAN_ROLE = "ban";
}
```

创建`FileConstant`，存放 COS 腾讯对象云存储的访问地址

> 关于腾讯对象云存储，请自行百度开通

```java
package xyz.kbws.constants;

/**
 * @author kbws
 * @date 2024/3/7
 * @description: 文件常量
 */
public interface FileConstant {
    /**
     * COS 访问地址
     */
    String COS_HOST = "https://blog-1312417182.cos.ap-chengdu.myqcloud.com";
}
```

创建`MqConstant`，保存 MQ 相关信息

```java
package xyz.kbws.constants;

/**
 * @author kbws
 * @date 2024/3/7
 * @description: MQ 信息
 */
public interface MqConstant {
    /**
     * 普通交换机
     */
    String CODE_EXCHANGE_NAME = "code_exchange";
    String CODE_QUEUE = "code_queue";
    String CODE_ROUTING_KEY = "code_routingKey";
    String CODE_DIRECT_EXCHANGE = "direct";

    /**
     * 死信队列交换机
     */
    String CODE_DLX_EXCHANGE = "code-dlx-exchange";

    /**
     * 死信队列
     */
    String CODE_DLX_QUEUE = "code_dlx_queue";

    /**
     * 死信队列路由键
     */
    String CODE_DLX_ROUTING_KEY = "code_dlx_routingKey";
}
```

#### exception
`exception`中是我们的自定义异常、全局异常拦截器和抛异常工具类

- 自定义异常：Java 中本来就有异常，为什么我们还要自定义异常呢？因为程序抛出同样的异常可能是不同的原因：在设置服务器、等待客户机连接和获取通讯流时，可抛出 IOException，在通信期间及试图断开连接时，也会抛出 IOException。使用自定义异常，是为了采用对应用程序更有意义的方式来灵活表示错误
- 全局异常拦截器：每个方法中可能会抛出不同的异常，如果都是用 try catch 去处理，显得非常冗余，可以通过 Spring 提供的`@ExceptionHandler`注解来实现异常的统一封装和处理
- 抛异常工具类：可以根据判断条件，选择是否抛出异常，而不用自己手动判断

创建`BusinessException`，自定义异常类
```java
package xyz.kbws.exception;

import lombok.Getter;
import xyz.kbws.common.ErrorCode;

/**
 * @author kbws
 * @date 2024/3/7
 * @description: 自定义异常类
 */
@Getter
public class BusinessException extends RuntimeException{
    /**
     * 错误码
     */
    private final int code;

    public BusinessException(int code, String message) {
        super(message);
        this.code = code;
    }

    public BusinessException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.code = errorCode.getCode();
    }

    public BusinessException(ErrorCode errorCode, String message) {
        super(message);
        this.code = errorCode.getCode();
    }

}
```

创建`GlobalExceptionHandler`，全局异常处理器

```java
package xyz.kbws.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import xyz.kbws.common.BaseResponse;
import xyz.kbws.common.ErrorCode;
import xyz.kbws.common.ResultUtils;

/**
 * @author kbws
 * @date 2024/3/7
 * @description: 全局异常处理器
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    @ExceptionHandler(BusinessException.class)
    public BaseResponse<?> businessExceptionHandler(BusinessException e) {
        log.error("BusinessException", e);
        return ResultUtils.error(e.getCode(), e.getMessage());
    }

    @ExceptionHandler(RuntimeException.class)
    public BaseResponse<?> runtimeExceptionHandler(RuntimeException e) {
        log.error("RuntimeException", e);
        return ResultUtils.error(ErrorCode.SYSTEM_ERROR, "系统错误");
    }
}
```

创建`ThrowUtils`，抛异常工具类

```java
package xyz.kbws.exception;

import xyz.kbws.common.ErrorCode;

/**
 * @author kbws
 * @date 2024/3/7
 * @description: 抛异常工具类
 */
public class ThrowUtils {
    /**
     * 条件成立则抛异常
     *
     * @param condition
     * @param runtimeException
     */
    public static void throwIf(boolean condition, RuntimeException runtimeException) {
        if (condition) {
            throw runtimeException;
        }
    }

    /**
     * 条件成立则抛异常
     *
     * @param condition
     * @param errorCode
     */
    public static void throwIf(boolean condition, ErrorCode errorCode) {
        throwIf(condition, new BusinessException(errorCode));
    }

    /**
     * 条件成立则抛异常
     *
     * @param condition
     * @param errorCode
     * @param message
     */
    public static void throwIf(boolean condition, ErrorCode errorCode, String message) {
        throwIf(condition, new BusinessException(errorCode, message));
    }
}
```

#### utils

> 未完待续
