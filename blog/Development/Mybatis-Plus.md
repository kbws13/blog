---
id: mybatis-plus-typehandler
slug: /mybatis-plus-typehandler
title: Mybatis-Plus使用字段类型处理器
date: 2024-02-14
tags: [Mybatis-Plus]
keywords: [Mybatis-Plus]
---
类型处理器用于 JavaType 和 JdbcType 之间的转换
## 介绍
开发过程经常遇到将对象转换成 JSON 然后存入数据库的场景，或者某个字段在数据库中是字符串，在实体类中却是数组或列表

像上面的情况可以查询到数据后，手动进行转换，但是这样很麻烦并且不优雅

Myabtis-Plus 提供了一些常用的类型处理器用于解决上面遇到的问题，将数据转换在持久层实现，这样大大方便了我们进行日常开发
## JacksonTypeHandler
先创建一个店铺表
```sql
-- 店铺表
create table shop
(
    id         int primary key auto_increment unique not null comment 'id',
    cover      varchar(125)                          not null comment '封面图片url',
    name       varchar(125)                          not null comment '店铺标题',
    category   varchar(125)                          not null comment '店铺分类',
    video      varchar(125)                          null comment '店铺视频',
    images     varchar(1024)                         not null default '[]' comment '文章图片链接数组',
    content    text                                  not null comment '文章内容',
    phone      varchar(120)                          null comment '店铺电话',
    address    varchar(1024)                         null comment '店铺地址',
    createTime datetime default CURRENT_TIMESTAMP    not null comment '创建时间',
    updateTime datetime default CURRENT_TIMESTAMP    not null on update CURRENT_TIMESTAMP comment '更新时间',
    isDelete   tinyint  default 0                    not null comment '是否删除'
) comment '店铺表';
```
其中 address 字段是`varchar`
下面是项目中的实体类：
Shop 类
```java
package xyz.kbws.model.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * 店铺表
 * @TableName shop
 */
@Data
public class Shop implements Serializable {
    /**
     * id
     */
    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     * 封面图片url
     */
    private String cover;

    /**
     * 店铺标题
     */
    private String name;

    /**
     * 店铺分类
     */
    private String category;

    /**
     * 店铺视频
     */
    private String video;

    /**
     * 文章图片链接数组
     */
    private String[] images;

    /**
     * 文章内容
     */
    private String content;

    /**
     * 店铺电话
     */
    private String phone;

    /**
     * 店铺地址
     */
    private Address address;

    /**
     * 创建时间
     */
    @JsonFormat(locale = "zh", timezone = "GMT+8", pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createTime;

    /**
     * 更新时间
     */
    @JsonFormat(locale = "zh", timezone = "GMT+8", pattern = "yyyy-MM-dd HH:mm:ss")
    private Date updateTime;

    /**
     * 是否收藏
     */
    @TableField(exist = false)
    private Boolean isFavor = false;

    /**
     * 是否删除
     */
    private Integer isDelete;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}
```
Address 类：
```java
package xyz.kbws.model.entity;

import lombok.Data;

import java.io.Serializable;

/**
 * @author kbws
 * @date 2024/2/14
 * @description: 店铺位置
 */
@Data
public class Address implements Serializable {

    /**
     * 地址
     */
    private String position;

    /**
     * 经度
     */
    private String longitude;

    /**
     * 纬度
     */
    private String latitude;

    private static final long serialVersionUID = 2767793004088171376L;
}

```
直接将数据存入数据库肯定会报错，因为 address 字段在数据库中是字符串而在项目中却是对象
可以用 Mybatis-Plus 提供的`JacksonTypeHandler`字段处理器，将对象转换为 JSON 字符串，然后就可以将数据存入数据库了

直接在 address 属性上添加`@TableField`注解，并通过`typeHandler`属性指定要使用的字段转换器
同时要在类上加上`@TableName`注解，并将`autoResultMap`属性设置为`true`
```java
package xyz.kbws.model.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * 店铺表
 * @TableName shop
 */
@TableName(value ="shop", autoResultMap = true)
@Data
public class Shop implements Serializable {
    /**
     * id
     */
    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     * 封面图片url
     */
    private String cover;

    /**
     * 店铺标题
     */
    private String name;

    /**
     * 店铺分类
     */
    private String category;

    /**
     * 店铺视频
     */
    private String video;

    /**
     * 文章图片链接数组
     */
    private String[] images;

    /**
     * 文章内容
     */
    private String content;

    /**
     * 店铺电话
     */
    private String phone;

    /**
     * 店铺地址
     */
    @TableField(typeHandler = JacksonTypeHandler.class)
    private Address address;

    /**
     * 创建时间
     */
    @JsonFormat(locale = "zh", timezone = "GMT+8", pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createTime;

    /**
     * 更新时间
     */
    @JsonFormat(locale = "zh", timezone = "GMT+8", pattern = "yyyy-MM-dd HH:mm:ss")
    private Date updateTime;

    /**
     * 是否收藏
     */
    @TableField(exist = false)
    private Boolean isFavor = false;

    /**
     * 是否删除
     */
    private Integer isDelete;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}
```
除了上面之外，还需要在 XML 文件中的标签指定`address`字段的转换处理器
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="xyz.kbws.mapper.ShopMapper">

    <resultMap id="BaseResultMap" type="xyz.kbws.model.entity.Shop">
            <id property="id" column="id" jdbcType="INTEGER"/>
            <result property="cover" column="cover" jdbcType="VARCHAR"/>
            <result property="name" column="name" jdbcType="VARCHAR"/>
            <result property="category" column="category" jdbcType="VARCHAR"/>
            <result property="video" column="video" jdbcType="VARCHAR"/>
            <result property="images" column="images" jdbcType="VARCHAR"/>
            <result property="content" column="content" jdbcType="VARCHAR"/>
            <result property="phone" column="phone" jdbcType="VARCHAR"/>
            <result property="address" column="address" jdbcType="VARCHAR" typeHandler="com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler"/>
            <result property="createTime" column="createTime" jdbcType="DATE" />
            <result property="updateTime" column="updateTime" jdbcType="DATE" />
            <result property="isDelete" column="isDelete" jdbcType="TINYINT"/>
    </resultMap>

    <sql id="Base_Column_List">
        id,cover,name,category,
        video,images,content,
        phone,address,createTime, updateTime,isDelete
    </sql>
</mapper>
```
这样，对象就能自动转换成成 JSON 字符串并存入数据库了，当查询数据时，也会自动从 JSON 字符串转换成 Address 对象，实在是太优雅了！
## 自定义字段类型处理器
官方提供的处理器不能适用全部的场景，当遇到一些特殊场景时，官方提供的处理器就乏力了

这时我们可以自定义处理器以满足我们的开发需求

拿上面表中的 images 字段来举例：数据库中存储的是字符串，但在 Java 类中是字符串数组，这明显是一个需要转换的场景，我们可以创建一个`StringArrayToStringTypeHandler`来处理字段转换问题
### 创建字段处理器
```java
package xyz.kbws.handler;

import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedJdbcTypes;
import org.apache.ibatis.type.MappedTypes;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Arrays;

/**
 * @author kbws
 * @date 2024/2/12
 * @description:
 */
@MappedTypes({String[].class})
@MappedJdbcTypes({JdbcType.VARCHAR})
public class StringArrayToStringTypeHandler extends BaseTypeHandler<String[]> {
    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, String[] parameter, JdbcType jdbcType) throws SQLException {
        ps.setString(i, Arrays.toString(parameter));
    }

    @Override
    public String[] getNullableResult(ResultSet rs, String columnName) throws SQLException {
        return stringToArray(rs.getString(columnName));
    }

    @Override
    public String[] getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        return stringToArray(rs.getString(columnIndex));
    }

    @Override
    public String[] getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        return stringToArray(cs.getString(columnIndex));
    }

	/**
	* 自定义的字符串转字符串数组方法
	* /
    private String[] stringToArray(String str) {
        if (str == null || str.isEmpty()) {
            return new String[0];
        }
        String[] array = str.substring(1, str.length() - 1).split(", ");
        for (int i = 0; i < array.length; i++) {
            array[i] = array[i].trim();
        }
        return array;
    }
}

```
### 使用
处理器定义好之后就可以在类中使用了
使用`@TableField`注解，将`typeHandler`属性设置为刚才定义的字段处理器类：`StringArrayToStringTypeHandler.class`
```java
package xyz.kbws.model.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import xyz.kbws.handler.StringArrayToStringTypeHandler;

import java.io.Serializable;
import java.util.Date;

/**
 * 店铺表
 * @TableName shop
 */
@TableName(value ="shop", autoResultMap = true)
@Data
public class Shop implements Serializable {
    /**
     * id
     */
    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     * 封面图片url
     */
    private String cover;

    /**
     * 店铺标题
     */
    private String name;

    /**
     * 店铺分类
     */
    private String category;

    /**
     * 店铺视频
     */
    private String video;

    /**
     * 文章图片链接数组
     */
    @TableField(typeHandler = StringArrayToStringTypeHandler.class)
    private String[] images;

    /**
     * 文章内容
     */
    private String content;

    /**
     * 店铺电话
     */
    private String phone;

    /**
     * 店铺地址
     */
    @TableField(typeHandler = JacksonTypeHandler.class)
    private Address address;

    /**
     * 创建时间
     */
    @JsonFormat(locale = "zh", timezone = "GMT+8", pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createTime;

    /**
     * 更新时间
     */
    @JsonFormat(locale = "zh", timezone = "GMT+8", pattern = "yyyy-MM-dd HH:mm:ss")
    private Date updateTime;

    /**
     * 是否收藏
     */
    @TableField(exist = false)
    private Boolean isFavor = false;

    /**
     * 是否删除
     */
    private Integer isDelete;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}
```

XML 文件中也要设置
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="xyz.kbws.mapper.ShopMapper">

    <resultMap id="BaseResultMap" type="xyz.kbws.model.entity.Shop">
            <id property="id" column="id" jdbcType="INTEGER"/>
            <result property="cover" column="cover" jdbcType="VARCHAR"/>
            <result property="name" column="name" jdbcType="VARCHAR"/>
            <result property="category" column="category" jdbcType="VARCHAR"/>
            <result property="video" column="video" jdbcType="VARCHAR"/>
            <result property="images" column="images" jdbcType="VARCHAR" typeHandler="xyz.kbws.handler.StringArrayToStringTypeHandler"/>
            <result property="content" column="content" jdbcType="VARCHAR"/>
            <result property="phone" column="phone" jdbcType="VARCHAR"/>
            <result property="address" column="address" jdbcType="VARCHAR" typeHandler="com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler"/>
            <result property="createTime" column="createTime" jdbcType="DATE" />
            <result property="updateTime" column="updateTime" jdbcType="DATE" />
            <result property="isDelete" column="isDelete" jdbcType="TINYINT"/>
    </resultMap>

    <sql id="Base_Column_List">
        id,cover,name,category,
        video,images,content,
        phone,address,createTime, updateTime,isDelete
    </sql>
</mapper>

```

这样，我们的问题就完美解决了！