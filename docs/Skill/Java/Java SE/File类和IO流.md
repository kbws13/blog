---
id: file-class-and-io-stream
slug: /file-class-and-io-stream
title: File类和IO流
date: 2024-04-03
tags: [File, IO流]
keywords: [File, IO流]
---
## java.io.File类的使用

### 概述

- File 类及本章下的各种流，都定义在`java.io`包下
- 一个 File 对象代表硬盘或网络中可能存在的一个文件或者文件目录（俗称文件夹），与平台无关。（体会万事万物皆对象）
- File 能新建、删除、重命名文件和目录，但 File 不能访问文件内容本身。如果需要访问文件内容本身，则需要使用输入/输出流
   - File对象可以作为参数传递给流的构造器
- 想要在Java程序中表示一个真实存在的文件或目录，那么必须有一个 File 对象，但是 Java 程序中的一个 File 对象，可能没有一个真实存在的文件或目录

### 构造器

- `public File(String pathname)` ：以 pathname 为路径创建 File 对象，可以是绝对路径或者相对路径，如果 pathname 是相对路径，则默认的当前路径在系统属性`user.dir`中存储
- `public File(String parent, String child)` ：以 parent 为父路径，child 为子路径创建 File 对象
- `public File(File parent, String child)` ：根据一个父 File 对象和子文件路径创建 File 对象

关于路径：

- **绝对路径：**从盘符开始的路径，这是一个完整的路径
- **相对路径：**相对于`项目目录`的路径，这是一个便捷的路径，开发中经常使用
   - IDEA 中，main 中的文件的相对路径，是相对于"`当前工程`"
   - IDEA 中，单元测试方法中的文件的相对路径，是相对于"`当前module`"

举例：

```java
import java.io.File;

public class FileObjectTest {
    public static void main(String[] args) {
        // 文件路径名
        String pathname = "D:\\aaa.txt";
        File file1 = new File(pathname);

        // 文件路径名
        String pathname2 = "D:\\aaa\\bbb.txt";
        File file2 = new File(pathname2);

        // 通过父路径和子路径字符串
        String parent = "d:\\aaa";
        String child = "bbb.txt";
        File file3 = new File(parent, child);

        // 通过父级File对象和子路径字符串
        File parentDir = new File("d:\\aaa");
        String childFile = "bbb.txt";
        File file4 = new File(parentDir, childFile);
    }
    
    @Test
    public void test01() throws IOException{
        File f1 = new File("d:\\atguigu\\javase\\HelloIO.java"); //绝对路径
        System.out.println("文件/目录的名称：" + f1.getName());
        System.out.println("文件/目录的构造路径名：" + f1.getPath());
        System.out.println("文件/目录的绝对路径名：" + f1.getAbsolutePath());
        System.out.println("文件/目录的父目录名：" + f1.getParent());
    }
    @Test
    public void test02()throws IOException{
        File f2 = new File("/HelloIO.java");//绝对路径，从根路径开始
        System.out.println("文件/目录的名称：" + f2.getName());
        System.out.println("文件/目录的构造路径名：" + f2.getPath());
        System.out.println("文件/目录的绝对路径名：" + f2.getAbsolutePath());
        System.out.println("文件/目录的父目录名：" + f2.getParent());
    }

    @Test
    public void test03() throws IOException {
        File f3 = new File("HelloIO.java");//相对路径
        System.out.println("user.dir =" + System.getProperty("user.dir"));
        System.out.println("文件/目录的名称：" + f3.getName());
        System.out.println("文件/目录的构造路径名：" + f3.getPath());
        System.out.println("文件/目录的绝对路径名：" + f3.getAbsolutePath());
        System.out.println("文件/目录的父目录名：" + f3.getParent());
    }
    @Test
    public void test04() throws IOException{
        File f5 = new File("HelloIO.java");//相对路径
        System.out.println("user.dir =" + System.getProperty("user.dir"));
        System.out.println("文件/目录的名称：" + f5.getName());
        System.out.println("文件/目录的构造路径名：" + f5.getPath());
        System.out.println("文件/目录的绝对路径名：" + f5.getAbsolutePath());
        System.out.println("文件/目录的父目录名：" + f5.getParent());
    }
}
```

> 注意：
> 1.  无论该路径下是否存在文件或者目录，都不影响 File 对象的创建。 
> 2.  window 的路径分隔符使用“\”，而 Java 程序中的“\”表示转义字符，所以在 Windows 中表示路径，需要用“\”。或者直接使用“/”也可以，Java 程序支持将“/”当成平台无关的`路径分隔符`。或者直接使用`File.separator`常量值表示。比如：
`File file2 = new File("d:" + File.separator + "atguigu" + File.separator + "info.txt"); `
> 3.  当构造路径是绝对路径时，那么 getPath 和 getAbsolutePath 结果一样
当构造路径是相对路径时，那么getAbsolutePath的路径 = user.dir 的路径 + 构造路径 


### 常用方法

#### 获取文件和目录基本信息

- public String getName() ：获取名称
- public String getPath() ：获取路径
- `public String getAbsolutePath()`：获取绝对路径
- public File getAbsoluteFile()：获取绝对路径表示的文件
- `public String getParent()`：获取上层文件目录路径。若无，返回null
- public long length() ：获取文件长度（即：字节数）。不能获取目录的长度
- public long lastModified() ：获取最后一次的修改时间，毫秒值

> 如果File对象代表的文件或目录存在，则File对象实例初始化时，就会用硬盘中对应文件或目录的属性信息（例如，时间、类型等）为File对象的属性赋值，否则除了路径和名称，File对象的其他属性将会保留默认值

![20240403225023](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240403225023.png)

举例：

```java
import java.io.File;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

public class FileInfoMethod {
    public static void main(String[] args) {
        File f = new File("d:/aaa/bbb.txt");
        System.out.println("文件构造路径:"+f.getPath());
        System.out.println("文件名称:"+f.getName());
        System.out.println("文件长度:"+f.length()+"字节");
        System.out.println("文件最后修改时间：" + LocalDateTime.ofInstant(Instant.ofEpochMilli(f.lastModified()),ZoneId.of("Asia/Shanghai")));

        File f2 = new File("d:/aaa");
        System.out.println("目录构造路径:"+f2.getPath());
        System.out.println("目录名称:"+f2.getName());
        System.out.println("目录长度:"+f2.length()+"字节");
        System.out.println("文件最后修改时间：" + LocalDateTime.ofInstant(Instant.ofEpochMilli(f.lastModified()),ZoneId.of("Asia/Shanghai")));
    }
}
```

```java
输出结果：
文件构造路径:d:\aaa\bbb.java
文件名称:bbb.java
文件长度:636字节
文件最后修改时间：2022-07-23T22:01:32.065

目录构造路径:d:\aaa
目录名称:aaa
目录长度:4096字节
文件最后修改时间：2022-07-23T22:01:32.065
```

#### 列出目录的下一级

- `public String[] list()`：返回一个String数组，表示该File目录中的所有子文件或目录
- `public File[] listFiles()`：返回一个File数组，表示该File目录中的所有的子文件或目录

```java
package com.atguigu.file;

import org.junit.Test;

import java.io.File;
import java.io.FileFilter;
import java.io.FilenameFilter;

public class DirListFiles {
    @Test
    public void test01() {
        File dir = new File("d:/atguigu");
        String[] subs = dir.list();
        for (String sub : subs) {
            System.out.println(sub);
        }
    }

}
```

#### File类的重命名功能

- `public boolean renameTo(File dest)`:把文件重命名为指定的文件路径

#### 判断功能的方法

- `public boolean exists()` ：此File表示的文件或目录是否实际存在
- `public boolean isDirectory()` ：此File表示的是否为目录
- `public boolean isFile()` ：此File表示的是否为文件
- `public boolean canRead()`：判断是否可读
- `public boolean canWrite()`：判断是否可写
- `public boolean isHidden()`：判断是否隐藏

举例：

```java
import java.io.File;

public class FileIs {
    public static void main(String[] args) {
        File f = new File("d:\\aaa\\bbb.java");
        File f2 = new File("d:\\aaa");
        // 判断是否存在
        System.out.println("d:\\aaa\\bbb.java 是否存在:"+f.exists());
        System.out.println("d:\\aaa 是否存在:"+f2.exists());
        // 判断是文件还是目录
        System.out.println("d:\\aaa 文件?:"+f2.isFile());
        System.out.println("d:\\aaa 目录?:"+f2.isDirectory());
    }
}
```

```
输出结果：
d:\aaa\bbb.java 是否存在:true
d:\aaa 是否存在:true
d:\aaa 文件?:false
d:\aaa 目录?:true
```

> 如果文件或目录不存在，那么`exists()`、`isFile()`和`isDirectory()`都是返回 true


#### 创建、删除功能

- `public boolean createNewFile()` ：创建文件。若文件存在，则不创建，返回 false
- `public boolean mkdir()`：创建文件目录。如果此文件目录存在，就不创建了。如果此文件目录的上层目录不存在，也不创建
- `public boolean mkdirs()` ：创建文件目录。如果上层文件目录不存在，一并创建
- `public boolean delete()` ：删除文件或者文件夹
删除注意事项：① Java中的删除不走回收站。② 要删除一个文件目录，请注意该文件目录内不能包含文件或者文件目录

举例：

```java
import java.io.File;
import java.io.IOException;

public class FileCreateDelete {
    public static void main(String[] args) throws IOException {
        // 文件的创建
        File f = new File("aaa.txt");
        System.out.println("aaa.txt是否存在:"+f.exists()); 
        System.out.println("aaa.txt是否创建:"+f.createNewFile()); 
        System.out.println("aaa.txt是否存在:"+f.exists()); 

        // 目录的创建
        File f2= new File("newDir");
        System.out.println("newDir是否存在:"+f2.exists());
        System.out.println("newDir是否创建:"+f2.mkdir());
        System.out.println("newDir是否存在:"+f2.exists());

        // 创建一级目录
        File f3= new File("newDira\\newDirb");
        System.out.println("newDira\\newDirb创建：" + f3.mkdir());
        File f4= new File("newDir\\newDirb");
        System.out.println("newDir\\newDirb创建：" + f4.mkdir());
        // 创建多级目录
        File f5= new File("newDira\\newDirb");
        System.out.println("newDira\\newDirb创建：" + f5.mkdirs());

        // 文件的删除
        System.out.println("aaa.txt删除：" + f.delete());

        // 目录的删除
        System.out.println("newDir删除：" + f2.delete());
        System.out.println("newDir\\newDirb删除：" + f4.delete());
    }
}
```

```java
运行结果：
aaa.txt是否存在:false
aaa.txt是否创建:true
aaa.txt是否存在:true
newDir是否存在:false
newDir是否创建:true
newDir是否存在:true
newDira\newDirb创建：false
newDir\newDirb创建：true
newDira\newDirb创建：true
aaa.txt删除：true
newDir删除：false
newDir\newDirb删除：true
```

> API 中说明：delete 方法，如果此 File 表示目录，则目录必须为空才能删除



## IO流原理及流的分类

### Java IO原理

-  Java 程序中，对于数据的输入/输出操作以“`流(stream)`” 的方式进行，可以看做是一种数据的流动。 ![20240403225213](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240403225213.png)
-  I/O流中的I/O是`Input/Output`的缩写， I/O 技术是非常实用的技术，用于处理设备之间的数据传输。如读/写文件，网络通讯等。
   - `输入input`：读取外部数据（磁盘、光盘等存储设备的数据）到程序（内存）中
   - `输出output`：将程序（内存）数据输出到磁盘、光盘等存储设备中

![20240403225232](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240403225232.png)

### 流的分类

`java.io`包下提供了各种“流”类和接口，用以获取不同种类的数据，并通过`标准的方法`输入或输出数据

-  按数据的流向不同分为：**输入流**和**输出流**
   - **输入流** ：把数据从`其他设备`上读取到`内存`中的流
      - 以 InputStream、Reader 结尾
   - **输出流** ：把数据从`内存` 中写出到`其他设备`上的流
      - 以 OutputStream、Writer 结尾
-  按操作数据单位的不同分为：**字节流（8bit）**和**字符流（16bit）**
   - **字节流** ：以字节为单位，读写数据的流
      - 以 InputStream、OutputStream 结尾
   - **字符流** ：以字符为单位，读写数据的流
      - 以 Reader、Writer 结尾
-  根据IO流的角色不同分为：**节点流**和**处理流**
   -  **节点流**：直接从数据源或目的地读写数据
   ![20240403225311](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240403225311.png)
   -  **处理流**：不直接连接到数据源或目的地，而是“连接”在已存在的流（节点流或处理流）之上，通过对数据的处理为程序提供更为强大的读写功能
   ![20240403225323](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240403225323.png)

图解

![20240403225331](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240403225331.png)

### 流的API

- Java 的 IO 流共涉及40多个类，实际上非常规则，都是从如下4个抽象基类派生的。
| （抽象基类） | 输入流 | 输出流 |
| --- | --- | --- |
| 字节流 | InputStream | OutputStream |
| 字符流 | Reader | Writer |


- 由这四个类派生出来的子类名称都是以其父类名作为子类名后缀。

![20240403225344](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240403225344.png)

**常用的节点流：**

- 文件流： FileInputStream、FileOutputStrean、FileReader、FileWriter
- 字节/字符数组流： ByteArrayInputStream、ByteArrayOutputStream、CharArrayReader、CharArrayWriter 
   - 对数组进行处理的节点流（对应的不再是文件，而是内存中的一个数组）

**常用处理流：**

- 缓冲流：BufferedInputStream、BufferedOutputStream、BufferedReader、BufferedWriter 
   - 作用：增加缓冲功能，避免频繁读写硬盘，进而提升读写效率
- 转换流：InputStreamReader、OutputStreamReader 
   - 作用：实现字节流和字符流之间的转换
- 对象流：ObjectInputStream、ObjectOutputStream 
   - 作用：提供直接读写Java对象功能

## 节点流之一：FileReader\FileWriter

### Reader与Writer

Java提供一些字符流类，以字符为单位读写数据，专门用于处理文本文件。不能操作图片，视频等非文本文件

> 常见的文本文件有如下的格式：.txt、.java、.c、.cpp、.py等
> 注意：.doc、.xls、.ppt这些都不是文本文件。


#### 字符输入流：Reader

`java.io.Reader`抽象类是表示用于读取字符流的所有类的父类，可以读取字符信息到内存中。它定义了字符输入流的基本共性功能方法

- `public int read()`： 从输入流读取一个字符。 虽然读取了一个字符，但是会自动提升为int类型。返回该字符的Unicode编码值。如果已经到达流末尾了，则返回-1
- `public int read(char[] cbuf)`： 从输入流中读取一些字符，并将它们存储到字符数组 cbuf中 。每次最多读取cbuf.length个字符。返回实际读取的字符个数。如果已经到达流末尾，没有数据可读，则返回-1
- `public int read(char[] cbuf,int off,int len)`：从输入流中读取一些字符，并将它们存储到字符数组 cbuf中，从cbuf[off]开始的位置存储。每次最多读取len个字符。返回实际读取的字符个数。如果已经到达流末尾，没有数据可读，则返回-1
- `public void close()` ：关闭此流并释放与此流相关联的任何系统资源

> 注意：当完成流的操作时，必须调用close()方法，释放系统资源，否则会造成内存泄漏


#### 字符输出流：Writer

`java.io.Writer`抽象类是表示用于写出字符流的所有类的超类，将指定的字符信息写出到目的地。它定义了字节输出流的基本共性功能方法

- `public void write(int c)` ：写出单个字符
- `public void write(char[] cbuf)`：写出字符数组
- `public void write(char[] cbuf, int off, int len)`：写出字符数组的某一部分。off：数组的开始索引；len：写出的字符个数
- `public void write(String str)`：写出字符串
- `public void write(String str, int off, int len)` ：写出字符串的某一部分。off：字符串的开始索引；len：写出的字符个数
- `public void flush()`：刷新该流的缓冲
- `public void close()` ：关闭此流

> 注意：当完成流的操作时，必须调用`close()`方法，释放系统资源，否则会造成内存泄漏


### FileReader 与 FileWriter

#### FileReader

`java.io.FileReader`类用于读取字符文件，构造时使用系统默认的字符编码和默认字节缓冲区

- `FileReader(File file)`： 创建一个新的 FileReader ，给定要读取的File对象
- `FileReader(String fileName)`： 创建一个新的 FileReader ，给定要读取的文件的名称

**举例：**读取 hello.txt 文件中的字符数据，并显示在控制台上

```java
public class FileReaderWriterTest {
    
    //实现方式1
    @Test
    public void test1() throws IOException {
        //1. 创建File类的对象，对应着物理磁盘上的某个文件
        File file = new File("hello.txt");
        //2. 创建FileReader流对象，将File类的对象作为参数传递到FileReader的构造器中
        FileReader fr = new FileReader(file);
        //3. 通过相关流的方法，读取文件中的数据
//        int data = fr.read(); //每调用一次读取一个字符
//        while (data != -1) {
//            System.out.print((char) data);
//            data = fr.read();
//        }
        int data;
        while ((data = fr.read()) != -1) {
            System.out.print((char) data);
        }

        //4. 关闭相关的流资源，避免出现内存泄漏
        fr.close();

    }

    //实现方式2：在方式1的基础上改进，使用try-catch-finally处理异常。保证流是可以关闭的
    @Test
    public void test2() {
        FileReader fr = null;
        try {
            //1. 创建File类的对象，对应着物理磁盘上的某个文件
            File file = new File("hello.txt");
            //2. 创建FileReader流对象，将File类的对象作为参数传递到FileReader的构造器中
            fr = new FileReader(file);
            //3. 通过相关流的方法，读取文件中的数据
            /*
             * read():每次从对接的文件中读取一个字符。并将此字符返回。
             * 如果返回值为-1,则表示文件到了末尾，可以不再读取。
             * */
//            int data = fr.read();
//            while(data != -1){
//                System.out.print((char)data);
//                data = fr.read();
//            }

            int data;
            while ((data = fr.read()) != -1) {
                System.out.println((char) data);
            }

        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            //4. 关闭相关的流资源，避免出现内存泄漏
            try {
                if (fr != null)
                    fr.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    //实现方式3：调用read(char[] cbuf),每次从文件中读取多个字符
    @Test
    public void test3() {
        FileReader fr = null;
        try {
            //1. 创建File类的对象，对应着物理磁盘上的某个文件
            File file = new File("hello.txt");
            //2. 创建FileReader流对象，将File类的对象作为参数传递到FileReader的构造器中
            fr = new FileReader(file);
            //3. 通过相关流的方法，读取文件中的数据
            char[] cbuf = new char[5];
            /*
             * read(char[] cbuf) : 每次将文件中的数据读入到cbuf数组中，并返回读入到数组中的
             * 字符的个数。
             * */
            int len; //记录每次读入的字符的个数
            while ((len = fr.read(cbuf)) != -1) {
                //处理char[]数组即可
                //错误：
//                for(int i = 0;i < cbuf.length;i++){
//                    System.out.print(cbuf[i]);
//                }
                //错误：
//                String str = new String(cbuf);
//                System.out.print(str);
                //正确：
//                for(int i = 0;i < len;i++){
//                    System.out.print(cbuf[i]);
//                }
                //正确：
                String str = new String(cbuf, 0, len);
                System.out.print(str);
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            //4. 关闭相关的流资源，避免出现内存泄漏
            try {
                if (fr != null)
                    fr.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
```

不同实现方式的类比：

![20240403225523](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240403225523.png)

#### FileWriter

`java.io.FileWriter`类用于写出字符到文件，构造时使用系统默认的字符编码和默认字节缓冲区

- `FileWriter(File file)`： 创建一个新的 FileWriter，给定要读取的 File 对象
- `FileWriter(String fileName)`： 创建一个新的 FileWriter，给定要读取的文件的名称
- `FileWriter(File file,boolean append)`： 创建一个新的 FileWriter，指明是否在现有文件末尾追加内容

举例：

```java
public class FWWrite {
    //注意：应该使用try-catch-finally处理异常。这里出于方便阅读代码，使用了throws的方式
    @Test
    public void test01()throws IOException {
        // 使用文件名称创建流对象
        FileWriter fw = new FileWriter(new File("fw.txt"));
        // 写出数据
        fw.write(97); // 写出第1个字符
        fw.write('b'); // 写出第2个字符
        fw.write('C'); // 写出第3个字符
        fw.write(30000); // 写出第4个字符，中文编码表中30000对应一个汉字。
		
        //关闭资源
        fw.close();
    }
	//注意：应该使用try-catch-finally处理异常。这里出于方便阅读代码，使用了throws的方式
    @Test
    public void test02()throws IOException {
        // 使用文件名称创建流对象
        FileWriter fw = new FileWriter(new File("fw.txt"));
        // 字符串转换为字节数组
        char[] chars = "尚硅谷".toCharArray();

        // 写出字符数组
        fw.write(chars); // 尚硅谷

        // 写出从索引1开始，2个字符。
        fw.write(chars,1,2); // 硅谷

        // 关闭资源
        fw.close();
    }
	//注意：应该使用try-catch-finally处理异常。这里出于方便阅读代码，使用了throws的方式
    @Test
    public void test03()throws IOException {
        // 使用文件名称创建流对象
        FileWriter fw = new FileWriter("fw.txt");
        // 字符串
        String msg = "尚硅谷";

        // 写出字符数组
        fw.write(msg); //尚硅谷

        // 写出从索引1开始，2个字符。
        fw.write(msg,1,2);	// 硅谷

        // 关闭资源
        fw.close();
    }
    
    @Test
    public void test04(){
        FileWriter fw = null;
        try {
            //1. 创建File的对象
            File file = new File("personinfo.txt");
            //2. 创建FileWriter的对象，将File对象作为参数传递到FileWriter的构造器中
            //如果输出的文件已存在，则会对现有的文件进行覆盖
            fw = new FileWriter(file);
//            fw = new FileWriter(file,false);
            //如果输出的文件已存在，则会在现有的文件末尾写入数据
//            fw = new FileWriter(file,true);

            //3. 调用相关的方法，实现数据的写出操作
            //write(String str) / write(char[] cbuf)
            fw.write("I love you,");
            fw.write("you love him.");
            fw.write("so sad".toCharArray());
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            //4. 关闭资源，避免内存泄漏
            try {
                if (fw != null)
                    fw.close();
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
    }
}
```


### 关于flush（刷新）

因为内置缓冲区的原因，如果FileWriter不关闭输出流，无法写出字符到文件中。但是关闭的流对象，是无法继续写出数据的。如果我们既想写出数据，又想继续使用流，就需要`flush()` 方法了

- `flush()` ：刷新缓冲区，流对象可以继续使用
- `close()`：先刷新缓冲区，然后通知系统释放资源。流对象不可以再被使用了

注意：即便是`flush()`方法写出了数据，操作的最后还是要调用 close 方法，释放系统资源

举例：

```java
public class FWWriteFlush {
    //注意：应该使用try-catch-finally处理异常。这里出于方便阅读代码，使用了throws的方式
    @Test
    public void test() throws IOException {
        // 使用文件名称创建流对象
        FileWriter fw = new FileWriter("fw.txt");
        // 写出数据，通过flush
        fw.write('刷'); // 写出第1个字符
        fw.flush();
        fw.write('新'); // 继续写出第2个字符，写出成功
        fw.flush();

        // 写出数据，通过close
        fw.write('关'); // 写出第1个字符
        fw.close();
        fw.write('闭'); // 继续写出第2个字符,【报错】java.io.IOException: Stream closed
        fw.close();
    }
}
```

## 节点流之二：FileInputStream\FileOutputStream

如果我们读取或写出的数据是非文本文件，则Reader、Writer就无能为力了，必须使用字节流

### InputStream和OutputStream

#### 字节输入流：InputStream

`java.io.InputStream`抽象类是表示字节输入流的所有类的超类，可以读取字节信息到内存中。它定义了字节输入流的基本共性功能方法

- `public int read()`： 从输入流读取一个字节。返回读取的字节值。虽然读取了一个字节，但是会自动提升为int类型。如果已经到达流末尾，没有数据可读，则返回-1
- `public int read(byte[] b)`： 从输入流中读取一些字节数，并将它们存储到字节数组 b中 。每次最多读取b.length个字节。返回实际读取的字节个数。如果已经到达流末尾，没有数据可读，则返回-1
- `public int read(byte[] b,int off,int len)`：从输入流中读取一些字节数，并将它们存储到字节数组 b 中，从`b[off]`开始存储，每次最多读取 len 个字节。返回实际读取的字节个数。如果已经到达流末尾，没有数据可读，则返回-1
- `public void close()` ：关闭此输入流并释放与此流相关联的任何系统资源

> 说明：close()方法，当完成流的操作时，必须调用此方法，释放系统资源。


#### 字节输出流：OutputStream

`java.io.OutputStream`抽象类是表示字节输出流的所有类的超类，将指定的字节信息写出到目的地。它定义了字节输出流的基本共性功能方法

- `public void write(int b)` ：将指定的字节输出流。虽然参数为int类型四个字节，但是只会保留一个字节的信息写出
- `public void write(byte[] b)`：将 b.length字节从指定的字节数组写入此输出流
- `public void write(byte[] b, int off, int len)` ：从指定的字节数组写入 len字节，从偏移量 off开始输出到此输出流
- `public void flush()` ：刷新此输出流并强制任何缓冲的输出字节被写出
- `public void close()` ：关闭此输出流并释放与此流相关联的任何系统资源

> 说明：`close()`方法，当完成流的操作时，必须调用此方法，释放系统资源


### FileInputStream 与 FileOutputStream

#### FileInputStream

`java.io.FileInputStream`类是文件输入流，从文件中读取字节。

- `FileInputStream(File file)`： 通过打开与实际文件的连接来创建一个 FileInputStream ，该文件由文件系统中的 File 对象 file 命名
- `FileInputStream(String name)`： 通过打开与实际文件的连接来创建一个 FileInputStream ，该文件由文件系统中的路径名 name 命名

举例：

```java
//read.txt文件中的内容如下：
abcde
```

读取操作

```java
public class FISRead {
    //注意：应该使用try-catch-finally处理异常。这里出于方便阅读代码，使用了throws的方式
    @Test
    public void test() throws IOException {
        // 使用文件名称创建流对象
        FileInputStream fis = new FileInputStream("read.txt");
        // 读取数据，返回一个字节
        int read = fis.read();
        System.out.println((char) read);
        read = fis.read();
        System.out.println((char) read);
        read = fis.read();
        System.out.println((char) read);
        read = fis.read();
        System.out.println((char) read);
        read = fis.read();
        System.out.println((char) read);
        // 读取到末尾,返回-1
        read = fis.read();
        System.out.println(read);
        // 关闭资源
        fis.close();
        /*
        文件内容：abcde
        输出结果：
        a
        b
        c
        d
        e
        -1
         */
    }

    @Test
    public void test02()throws IOException{
        // 使用文件名称创建流对象
        FileInputStream fis = new FileInputStream("read.txt");
        // 定义变量，保存数据
        int b;
        // 循环读取
        while ((b = fis.read())!=-1) {
            System.out.println((char)b);
        }
        // 关闭资源
        fis.close();
    }
	
    @Test
    public void test03()throws IOException{
        // 使用文件名称创建流对象.
        FileInputStream fis = new FileInputStream("read.txt"); // 文件中为abcde
        // 定义变量，作为有效个数
        int len;
        // 定义字节数组，作为装字节数据的容器
        byte[] b = new byte[2];
        // 循环读取
        while (( len= fis.read(b))!=-1) {
            // 每次读取后,把数组变成字符串打印
            System.out.println(new String(b));
        }
        // 关闭资源
        fis.close();
        /*
        输出结果：
        ab
        cd
        ed
        最后错误数据`d`，是由于最后一次读取时，只读取一个字节`e`，数组中，
        上次读取的数据没有被完全替换，所以要通过`len` ，获取有效的字节
         */
    }

    @Test
    public void test04()throws IOException{
        // 使用文件名称创建流对象.
        FileInputStream fis = new FileInputStream("read.txt"); // 文件中为abcde
        // 定义变量，作为有效个数
        int len;
        // 定义字节数组，作为装字节数据的容器
        byte[] b = new byte[2];
        // 循环读取
        while (( len= fis.read(b))!=-1) {
            // 每次读取后,把数组的有效字节部分，变成字符串打印
            System.out.println(new String(b,0,len));//  len 每次读取的有效字节个数
        }
        // 关闭资源
        fis.close();
        /*
        输出结果：
        ab
        cd
        e
         */
    }
}
```

#### FileOutputStream

`java.io.FileOutputStream`类是文件输出流，用于将数据写出到文件

- `public FileOutputStream(File file)`：创建文件输出流，写出由指定的 File对象表示的文件
- `public FileOutputStream(String name)`： 创建文件输出流，指定的名称为写出文件
- `public FileOutputStream(File file, boolean append)`：  创建文件输出流，指明是否在现有文件末尾追加内容

举例：

```java
import org.junit.Test;

import java.io.FileOutputStream;
import java.io.IOException;

public class FOSWrite {
    //注意：应该使用try-catch-finally处理异常。这里出于方便阅读代码，使用了throws的方式
    @Test
    public void test01() throws IOException {
        // 使用文件名称创建流对象
        FileOutputStream fos = new FileOutputStream("fos.txt");
        // 写出数据
        fos.write(97); // 写出第1个字节
        fos.write(98); // 写出第2个字节
        fos.write(99); // 写出第3个字节
        // 关闭资源
        fos.close();
      /*  输出结果：abc*/
    }

    @Test
    public void test02()throws IOException {
        // 使用文件名称创建流对象
        FileOutputStream fos = new FileOutputStream("fos.txt");
        // 字符串转换为字节数组
        byte[] b = "abcde".getBytes();
        // 写出从索引2开始，2个字节。索引2是c，两个字节，也就是cd。
        fos.write(b,2,2);
        // 关闭资源
        fos.close();
    }
    //这段程序如果多运行几次，每次都会在原来文件末尾追加abcde
    @Test
    public void test03()throws IOException {
        // 使用文件名称创建流对象
        FileOutputStream fos = new FileOutputStream("fos.txt",true);
        // 字符串转换为字节数组
        byte[] b = "abcde".getBytes();
        fos.write(b);
        // 关闭资源
        fos.close();
    }
    
    //使用FileInputStream\FileOutputStream，实现对文件的复制
    @Test
    public void test05() {
        FileInputStream fis = null;
        FileOutputStream fos = null;
        try {
            //1. 造文件-造流
            //复制图片：成功
//            fis = new FileInputStream(new File("pony.jpg"));
//            fos = new FileOutputStream(new File("pony_copy1.jpg"));

            //复制文本文件：成功
            fis = new FileInputStream(new File("hello.txt"));
            fos = new FileOutputStream(new File("hello1.txt"));

            //2. 复制操作（读、写）
            byte[] buffer = new byte[1024];
            int len;//每次读入到buffer中字节的个数
            while ((len = fis.read(buffer)) != -1) {
                fos.write(buffer, 0, len);
//                String str = new String(buffer,0,len);
//                System.out.print(str);
            }
            System.out.println("复制成功");
        } catch (IOException e) {
            throw new RuntimeException(e);
        } finally {
            //3. 关闭资源
            try {
                if (fos != null)
                    fos.close();
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
            try {
                if (fis != null)
                    fis.close();
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }

    }
}
```

## 处理流之一：缓冲流

-  `为了提高数据读写的速度`，Java API 提供了带缓冲功能的流类：缓冲流
-  缓冲流要“套接”在相应的节点流之上，根据数据操作单位可以把缓冲流分为： 
   - **字节缓冲流**：`BufferedInputStream`，`BufferedOutputStream`
   - **字符缓冲流**：`BufferedReader`，`BufferedWriter`
-  缓冲流的基本原理：在创建流对象时，内部会创建一个缓冲区数组（缺省使用`8192个字节(8Kb)`的缓冲区），通过缓冲区读写，减少系统 IO 次数，从而提高读写的效率。 

![20240403225727](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240403225727.png)

![20240403225734](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240403225734.png)

### 构造器

- `public BufferedInputStream(InputStream in)` ：创建一个 新的字节型的缓冲输入流
- `public BufferedOutputStream(OutputStream out)`： 创建一个新的字节型的缓冲输出流

代码举例：

```java
// 创建字节缓冲输入流
BufferedInputStream bis = new BufferedInputStream(new FileInputStream("abc.jpg"));
// 创建字节缓冲输出流
BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream("abc_copy.jpg"));
```

- `public BufferedReader(Reader in)` ：创建一个 新的字符型的缓冲输入流
- `public BufferedWriter(Writer out)`： 创建一个新的字符型的缓冲输出流

代码举例：

```java
// 创建字符缓冲输入流
BufferedReader br = new BufferedReader(new FileReader("br.txt"));
// 创建字符缓冲输出流
BufferedWriter bw = new BufferedWriter(new FileWriter("bw.txt"));
```

### 字符缓冲流特有方法

字符缓冲流的基本方法与普通字符流调用方式一致，不再阐述，我们来看它们具备的特有方法

- BufferedReader：`public String readLine()`: 读一行文字
- BufferedWriter：`public void newLine()`: 写一行行分隔符,由系统属性定义符号

```java
public class BufferedIOLine {
    @Test
    public void testReadLine()throws IOException {
        // 创建流对象
        BufferedReader br = new BufferedReader(new FileReader("in.txt"));
        // 定义字符串,保存读取的一行文字
        String line;
        // 循环读取,读取到最后返回null
        while ((line = br.readLine())!=null) {
            System.out.println(line);
        }
        // 释放资源
        br.close();
    }

    @Test
    public void testNewLine()throws IOException{
        // 创建流对象
        BufferedWriter bw = new BufferedWriter(new FileWriter("out.txt"));
        // 写出数据
        bw.write("尚");
        // 写出换行
        bw.newLine();
        bw.write("硅");
        bw.newLine();
        bw.write("谷");
        bw.newLine();
        // 释放资源
        bw.close();
    }
}
```

> 说明：
>  
> 1.  涉及到嵌套的多个流时，如果都显式关闭的话，需要先关闭外层的流，再关闭内层的流 
> 2.  其实在开发中，只需要关闭最外层的流即可，因为在关闭外层流时，内层的流也会被关闭



## 处理流之二：转换流

### 问题引入

**引入情况1：**

使用`FileReader` 读取项目中的文本文件。由于 IDEA 设置中针对项目设置了 UTF-8 编码，当读取 Windows 系统中创建的文本文件时，如果 Windows 系统默认的是 GBK 编码，则读入内存中会出现乱码

```java
import java.io.FileReader;
import java.io.IOException;

public class Problem {
    public static void main(String[] args) throws IOException {
        FileReader fileReader = new FileReader("E:\\File_GBK.txt");
        int data;
        while ((data = fileReader.read()) != -1) {
            System.out.print((char)data);
        }
        fileReader.close();
    }
}

输出结果：
���
```

那么如何读取GBK编码的文件呢？

**引入情况2：**

针对文本文件，现在使用一个字节流进行数据的读入，希望将数据显示在控制台上。此时针对包含中文的文本数据，可能会出现乱码

### 转换流的理解

**作用：转换流是字节与字符间的桥梁！**

![20240403225836](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240403225836.png)

具体来说：

![20240403225843](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240403225843.png)

### InputStreamReader 与 OutputStreamWriter

-  **InputStreamReader** 
   -  转换流`java.io.InputStreamReader`，是 Reader 的子类，是从字节流到字符流的桥梁。它读取字节，并使用指定的字符集将其解码为字符。它的字符集可以由名称指定，也可以接受平台的默认字符集
   -  构造器 
      - `InputStreamReader(InputStream in)`: 创建一个使用默认字符集的字符流
      - `InputStreamReader(InputStream in, String charsetName)`: 创建一个指定字符集的字符流
   -  举例 
```java
//使用默认字符集
InputStreamReader isr1 = new InputStreamReader(new FileInputStream("in.txt"));
//使用指定字符集
InputStreamReader isr2 = new InputStreamReader(new FileInputStream("in.txt") , "GBK");
```


   -  示例代码： 
```java
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;

public class InputStreamReaderDemo {
    public static void main(String[] args) throws IOException {
        // 定义文件路径,文件为gbk编码
        String fileName = "E:\\file_gbk.txt";
        //方式1：
        // 创建流对象,默认UTF8编码
        InputStreamReader isr1 = new InputStreamReader(new FileInputStream(fileName));
        // 定义变量,保存字符
        int charData;
        // 使用默认编码字符流读取,乱码
        while ((charData = isr1.read()) != -1) {
            System.out.print((char)charData); // ��Һ�
        }
        isr1.close();
		
        //方式2：
        // 创建流对象,指定GBK编码
        InputStreamReader isr2 = new InputStreamReader(new FileInputStream(fileName) , "GBK");
        // 使用指定编码字符流读取,正常解析
        while ((charData = isr2.read()) != -1) {
            System.out.print((char)charData);// 大家好
        }
        isr2.close();
    }
}
```


-  **OutputStreamWriter** 
   -  转换流`java.io.OutputStreamWriter` ，是 Writer 的子类，是从字符流到字节流的桥梁。使用指定的字符集将字符编码为字节。它的字符集可以由名称指定，也可以接受平台的默认字符集
   -  构造器 
      - `OutputStreamWriter(OutputStream in)`: 创建一个使用默认字符集的字符流
      - `OutputStreamWriter(OutputStream in,String charsetName)`: 创建一个指定字符集的字符流
   -  举例： 
```java
//使用默认字符集
OutputStreamWriter isr = new OutputStreamWriter(new FileOutputStream("out.txt"));
//使用指定的字符集
OutputStreamWriter isr2 = new OutputStreamWriter(new FileOutputStream("out.txt") , "GBK");
```


   -  示例代码： 
```java
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;

public class OutputStreamWriterDemo {
    public static void main(String[] args) throws IOException {
        // 定义文件路径
        String FileName = "E:\\out_utf8.txt";
        // 创建流对象,默认UTF8编码
        OutputStreamWriter osw = new OutputStreamWriter(new FileOutputStream(FileName));
        // 写出数据
        osw.write("你好"); // 保存为6个字节
        osw.close();

        // 定义文件路径
        String FileName2 = "E:\\out_gbk.txt";
        // 创建流对象,指定GBK编码
        OutputStreamWriter osw2 = new OutputStreamWriter(new                     
                                                FileOutputStream(FileName2),"GBK");
        // 写出数据
        osw2.write("你好");// 保存为4个字节
        osw2.close();
    }
}
```


### 字符编码和字符集

#### 编码与解码

计算机中储存的信息都是用`二进制数`表示的，而我们在屏幕上看到的数字、英文、标点符号、汉字等字符是二进制数转换之后的结果。按照某种规则，将字符存储到计算机中，称为**编码** 。反之，将存储在计算机中的二进制数按照某种规则解析显示出来，称为**解码** 

**字符编码（Character Encoding）** : 就是一套自然语言的字符与二进制数之间的对应规则

**编码表**：生活中文字和计算机中二进制的对应规则

**乱码的情况**：按照A规则存储，同样按照A规则解析，那么就能显示正确的文本符号。反之，按照A规则存储，再按照B规则解析，就会导致乱码现象

```
编码:字符(人能看懂的)--字节(人看不懂的)

解码:字节(人看不懂的)-->字符(人能看懂的)
```

#### 字符集

- **字符集Charset**：也叫编码表。是一个系统支持的所有字符的集合，包括各国家文字、标点符号、图形符号、数字等

- 计算机要准确的存储和识别各种字符集符号，需要进行字符编码，一套字符集必然至少有一套字符编码。常见字符集有 ASCII 字符集、GBK 字符集、Unicode 字符集等

可见，当指定了**编码**，它所对应的**字符集**自然就指定了，所以**编码**才是我们最终要关心的

-  **ASCII 字符集** ： 
   - ASCII 码（American Standard Code for Information Interchange，美国信息交换标准代码）：上个世纪60年代，美国制定了一套字符编码，对`英语字符`与二进制位之间的关系，做了统一规定。这被称为 ASCII 码
   - ASCII 码用于显示现代英语，主要包括控制字符（回车键、退格、换行键等）和可显示字符（英文大小写字符、阿拉伯数字和西文符号）
   - 基本的 ASCII 字符集，使用7位（bits）表示一个字符（最前面的1位统一规定为0），共`128个`字符。比如：空格“SPACE”是32（二进制00100000），大写的字母A是65（二进制01000001）
   - 缺点：不能表示所有字符
-  **ISO-8859-1字符集**： 
   - 拉丁码表，别名 Latin-1，用于显示欧洲使用的语言，包括荷兰语、德语、意大利语、葡萄牙语等
   - ISO-8859-1 使用单字节编码，兼容 ASCII 编码。
-  **GBxxx字符集**： 
   - GB 就是国标的意思，是为了`显示中文`而设计的一套字符集
   - **GB2312**：简体中文码表。一个小于127的字符的意义与原来相同，即向下兼容 ASCII 码。但两个大于127的字符连在一起时，就表示一个汉字，这样大约可以组合了包含`7000多个简体汉字`，此外数学符号、罗马希腊的字母、日文的假名们都编进去了，这就是常说的"全角"字符，而原来在127号以下的那些符号就叫"半角"字符了。
   - **GBK**：最常用的中文码表。是在 GB2312 标准基础上的扩展规范，使用了`双字节`编码方案，共收录了`21003个`汉字，完全兼容GB2312标准，同时支持`繁体汉字`以及日韩汉字等
   - **GB18030**：最新的中文码表。收录汉字`70244个`，采用`多字节`编码，每个字可以由1个、2个或4个字节组成。支持中国国内少数民族的文字，同时支持繁体汉字以及日韩汉字等
-  **Unicode字符集** ： 
   - Unicode编码为表达`任意语言的任意字符`而设计，也称为统一码、标准万国码。Unicode 将世界上所有的文字用`2个字节`统一进行编码，为每个字符设定唯一的二进制编码，以满足跨语言、跨平台进行文本处理的要求
   - Unicode 的缺点：这里有三个问题： 
      - 第一，英文字母只用一个字节表示就够了，如果用更多的字节存储是`极大的浪费`
      - 第二，如何才能`区别Unicode和ASCII`？计算机怎么知道两个字节表示一个符号，而不是分别表示两个符号呢？
      - 第三，如果和GBK等双字节编码方式一样，用最高位是1或0表示两个字节和一个字节，就少了很多值无法用于表示字符，`不够表示所有字符`
   - Unicode在很长一段时间内无法推广，直到互联网的出现，为解决Unicode如何在网络上传输的问题，于是面向传输的众多 UTF（UCS Transfer Format）标准出现。具体来说，有三种编码方案，UTF-8、UTF-16 和 UTF-32
-  **UTF-8字符集**： 
   - Unicode 是字符集，UTF-8、UTF-16、UTF-32是三种`将数字转换到程序数据`的编码方案。顾名思义，UTF-8就是每次8个位传输数据，而 UTF-16 就是每次16个位。其中，UTF-8 是在互联网上`使用最广`的一种 Unicode 的实现方式
   - 互联网工程工作小组（IETF）要求所有互联网协议都必须支持 UTF-8 编码。所以，我们开发 Web 应用，也要使用UTF-8编码。UTF-8 是一种`变长的编码方式`。它使用1-4个字节为每个字符编码，编码规则： 
      1. 128个 US-ASCII 字符，只需一个字节编码
      2. 拉丁文等字符，需要二个字节编码
      3. 大部分常用字（含中文），使用三个字节编码
      4. 其他极少使用的Unicode辅助字符，使用四字节编码

- 举例

Unicode 符号范围  | UTF-8 编码方式

```
(十六进制)           | （二进制）

————————————————————|—–—–—–—–—–—–—–—–—–—–—–—–—–—–

0000 0000-0000 007F | 0xxxxxxx（兼容原来的 ASCII）

0000 0080-0000 07FF | 110xxxxx 10xxxxxx

0000 0800-0000 FFFF | 1110xxxx 10xxxxxx 10xxxxxx

0001 0000-0010 FFFF | 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
```

![20240403230118](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240403230118.png)

- 小结

> 注意：在中文操作系统上，ANSI（美国国家标准学会、AMERICAN NATIONAL STANDARDS INSTITUTE: ANSI）编码即为 GBK；在英文操作系统上，ANSI 编码即为 ISO-8859-1


## 处理流之三/四：数据流、对象流

### 数据流与对象流说明

如果需要将内存中定义的变量（包括基本数据类型或引用数据类型）保存在文件中，那怎么办呢？

```java
int age = 300;
char gender = '男';
int energy = 5000;
double price = 75.5;
boolean relive = true;

String name = "巫师";
Student stu = new Student("张三",23,89);
```

Java 提供了数据流和对象流来处理这些类型的数据：

- **数据流：DataOutputStream、DataInputStream** 
   -  DataOutputStream：允许应用程序将基本数据类型、String 类型的变量写入输出流中 
   -  DataInputStream：允许应用程序以与机器无关的方式从底层输入流中读取基本数据类型、String 类型的变量
- 对象流DataInputStream中的方法：

```java
  byte readByte()                short readShort()
  int readInt()                  long readLong()
  float readFloat()              double readDouble()
  char readChar()				 boolean readBoolean()					
  String readUTF()               void readFully(byte[] b)
```

-  对象流 DataOutputStream 中的方法：将上述的方法的 read 改为相应的 write 即可。 
-  数据流的弊端：只支持 Java 基本数据类型和字符串的读写，而不支持其它 Java 对象的类型。而 ObjectOutputStream 和 ObjectInputStream 既支持 Java 基本数据类型的数据读写，又支持 Java 对象的读写，所以重点介绍对象流 ObjectOutputStream 和 ObjectInputStream
-  **对象流：ObjectOutputStream、ObjectInputStream** 
   - ObjectOutputStream：将 Java 基本数据类型和对象写入字节输出流中。通过在流中使用文件可以实现 Java 各种基本数据类型的数据以及对象的持久存储
   - ObjectInputStream：ObjectInputStream 对以前使用 ObjectOutputStream 写出的基本数据类型的数据和对象进行读入操作，保存在内存中

> 说明：对象流的强大之处就是可以把Java中的对象写入到数据源中，也能把对象从数据源中还原回来


### 对象流API

**ObjectOutputStream中的构造器：**

`public ObjectOutputStream(OutputStream out)`： 创建一个指定的ObjectOutputStream

```java
FileOutputStream fos = new FileOutputStream("game.dat");
ObjectOutputStream oos = new ObjectOutputStream(fos);
```

**ObjectOutputStream中的方法：**

- `public void writeBoolean(boolean val)`：写出一个 boolean 值
- `public void writeByte(int val)`：写出一个8位字节
- `public void writeShort(int val)`：写出一个16位的 short 值
- `public void writeChar(int val)`：写出一个16位的 char 值
- `public void writeInt(int val)`：写出一个32位的 int 值
- `public void writeLong(long val)`：写出一个64位的 long 值
- `public void writeFloat(float val)`：写出一个32位的 float 值。
- `public void writeDouble(double val)`：写出一个64位的 double 值
- `public void writeUTF(String str)`：将表示长度信息的两个字节写入输出流，后跟字符串 s 中每个字符的 UTF-8 修改版表示形式。根据字符的值，将字符串 s 中每个字符转换成一个字节、两个字节或三个字节的字节组。注意，将 String 作为基本数据写入流中与将它作为 Object 写入流中明显不同。 如果 s 为 null，则抛出 NullPointerException
- `public void writeObject(Object obj)`：写出一个 obj 对象
- `public void close()`：关闭此输出流并释放与此流相关联的任何系统资源

**ObjectInputStream中的构造器：**

`public ObjectInputStream(InputStream in)`： 创建一个指定的 ObjectInputStream

```java
FileInputStream fis = new FileInputStream("game.dat");
ObjectInputStream ois = new ObjectInputStream(fis);
```

**ObjectInputStream中的方法：**

- `public boolean readBoolean()`：读取一个 boolean 值
- `public byte readByte()`：读取一个 8 位的字节
- `public short readShort()`：读取一个 16 位的 short 值
- `public char readChar()`：读取一个 16 位的 char 值
- `public int readInt()`：读取一个 32 位的 int 值
- `public long readLong()`：读取一个 64 位的 long 值
- `public float readFloat()`：读取一个 32 位的 float 值
- `public double readDouble()`：读取一个 64 位的 double 值
- `public String readUTF()`：读取 UTF-8 修改版格式的 String
- `public void readObject(Object obj)`：读入一个 obj 对象
- `public void close()`：关闭此输入流并释放与此流相关联的任何系统资源

### 认识对象序列化机制

**1、何为对象序列化机制？**

`对象序列化机制`允许把内存中的 Java 对象转换成平台无关的二进制流，从而允许把这种二进制流持久地保存在磁盘上，或通过网络将这种二进制流传输到另一个网络节点。当其它程序获取了这种二进制流，就可以恢复成原来的 Java 对象

-  序列化过程：用一个字节序列可以表示一个对象，该字节序列包含该`对象的类型`和`对象中存储的属性`等信息。字节序列写出到文件之后，相当于文件中`持久保存`了一个对象的信息
-  反序列化过程：该字节序列还可以从文件中读取回来，重构对象，对它进行`反序列化`。`对象的数据`、`对象的类型`和`对象中存储的数据`信息，都可以用来在内存中创建对象

![20240403230430](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240403230430.png)

**2、序列化机制的重要性**

序列化是 RMI（Remote Method Invoke、远程方法调用）过程的参数和返回值都必须实现的机制，而 RMI 是 JavaEE 的基础。因此序列化机制是 JavaEE 平台的基础

序列化的好处，在于可将任何实现了Serializable接口的对象转化为**字节数据**，使其在保存和传输时可被还原。

**3、实现原理**

-  序列化：用 ObjectOutputStream 类保存基本类型数据或对象的机制。方法为： 
   - `public final void writeObject (Object obj)` : 将指定的对象写出
-  反序列化：用ObjectInputStream类读取基本类型数据或对象的机制。方法为： 
   - `public final Object readObject ()` : 读取一个对象

![20240403230455](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240403230455.png)

### 如何实现序列化机制

如果需要让某个对象支持序列化机制，则必须让对象所属的类及其属性是可序列化的，为了让某个类是可序列化的，该类必须实现`java.io.Serializable` 接口。`Serializable` 是一个`标记接口`，不实现此接口的类将不会使任何状态序列化或反序列化，会抛出`NotSerializableException`

- 如果对象的某个属性也是引用数据类型，那么如果该属性也要序列化的话，也要实现`Serializable` 接口
- 该类的所有属性必须是可序列化的。如果有一个属性不需要可序列化的，则该属性必须注明是瞬态的，使用`transient` 关键字修饰
- `静态（static）变量`的值不会序列化。因为静态变量的值不属于某个对象

举例：

```java
import org.junit.Test;

import java.io.*;

public class ReadWriteDataOfAnyType {
    @Test
    public void save() throws IOException {
        String name = "巫师";
        int age = 300;
        char gender = '男';
        int energy = 5000;
        double price = 75.5;
        boolean relive = true;

        ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("game.dat"));
        oos.writeUTF(name);
        oos.writeInt(age);
        oos.writeChar(gender);
        oos.writeInt(energy);
        oos.writeDouble(price);
        oos.writeBoolean(relive);
        oos.close();
    }
    @Test
    public void reload()throws IOException{
        ObjectInputStream ois = new ObjectInputStream(new FileInputStream("game.dat"));
        String name = ois.readUTF();
        int age = ois.readInt();
        char gender = ois.readChar();
        int energy = ois.readInt();
        double price = ois.readDouble();
        boolean relive = ois.readBoolean();

        System.out.println(name+"," + age + "," + gender + "," + energy + "," + price + "," + relive);

        ois.close();
    }
}
```


### 反序列化失败问题

**问题1：**

对于 JVM 可以反序列化对象，它必须是能够找到 class 文件的类。如果找不到该类的 class 文件，则抛出一个 `ClassNotFoundException` 异常

**问题2：**

当 JVM 反序列化对象时，能找到 class 文件，但是 class 文件在序列化对象之后发生了修改，那么反序列化操作也会失败，抛出一个`InvalidClassException`异常。发生这个异常的原因如下：

- 该类的序列版本号与从流中读取的类描述符的版本号不匹配
- 该类包含未知数据类型

解决办法：

`Serializable` 接口给需要序列化的类，提供了一个序列版本号：`serialVersionUID` 。凡是实现 Serializable 接口的类都应该有一个表示序列化版本标识符的静态变量：

```java
static final long serialVersionUID = 234242343243L; //它的值由程序员随意指定即可。
```

- serialVersionUID 用来表明类的不同版本间的兼容性。简单来说，Java 的序列化机制是通过在运行时判断类的 serialVersionUID 来验证版本一致性的。在进行反序列化时，JVM会把传来的字节流中的 serialVersionUID 与本地相应实体类的 serialVersionUID 进行比较，如果相同就认为是一致的，可以进行反序列化，否则就会出现序列化版本不一致的异常(InvalidCastException)
- 如果类没有显示定义这个静态常量，它的值是Java运行时环境根据类的内部细节`自动生成`的。若类的实例变量做了修改，serialVersionUID `可能发生变化`。因此，建议显式声明
- 如果声明了 serialVersionUID，即使在序列化完成之后修改了类导致类重新编译，则原来的数据也能正常反序列化，只是新增的字段值是默认值而已

```java
import java.io.Serializable;

public class Employee implements Serializable {
    private static final long serialVersionUID = 1324234L; //增加serialVersionUID
    
    //其它结构：略
}
```

### 面试题

面试题：谈谈你对`java.io.Serializable`接口的理解，我们知道它用于序列化，是空方法接口，还有其它认识吗？

```java
实现了 Serializable 接口的对象，可将它们转换成一系列字节，并可在以后完全恢复回原来的样子。这一过程亦可通过网络进行。这意味着序列化机制能自动补偿操作系统间的差异。换句话说，可以先在 Windows 机器上创建一个对象，对其序列化，然后通过网络发给一台 Unix 机器，然后在那里准确无误地重新“装配”。不必关心数据在不同机器上如何表示，也不必关心字节的顺序或者其他任何细节
    
由于大部分作为参数的类如 String、Integer 等都实现了`java.io.Serializable`的接口，也可以利用多态的性质，作为参数使接口更灵活
```


## 其他流的使用

### 标准输入、输出流

- `System.in`和`System.out`分别代表了系统标准的输入和输出设备
- 默认输入设备是：键盘，输出设备是：显示器
- `System.in`的类型是 InputStream
- `System.out`的类型是 PrintStream，其是 OutputStream 的子类 FilterOutputStream 的子类
- 重定向：通过 System 类的 setIn，setOut 方法对默认设备进行改变。 
   - `public static void setIn(InputStream in)`
   - `public static void setOut(PrintStream out)`

**举例：**

从键盘输入字符串，要求将读取到的整行字符串转成大写输出。然后继续进行输入操作，直至当输入“e”或者“exit”时，退出程序

```java
System.out.println("请输入信息(退出输入e或exit):");
// 把"标准"输入流(键盘输入)这个字节流包装成字符流,再包装成缓冲流
BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
String s = null;
try {
    while ((s = br.readLine()) != null) { // 读取用户输入的一行数据 --> 阻塞程序
        if ("e".equalsIgnoreCase(s) || "exit".equalsIgnoreCase(s)) {
            System.out.println("安全退出!!");
            break;
        }
        // 将读取到的整行字符串转成大写输出
        System.out.println("-->:" + s.toUpperCase());
        System.out.println("继续输入信息");
    }
} catch (IOException e) {
    e.printStackTrace();
} finally {
    try {
        if (br != null) {
            br.close(); // 关闭过滤流时,会自动关闭它包装的底层节点流
        }
    } catch (IOException e) {
        e.printStackTrace();
    }
}
```

**拓展：**

System 类中有三个常量对象：System.out、System.in、System.err

查看 System 类中这三个常量对象的声明：

```java
public final static InputStream in = null;
public final static PrintStream out = null;
public final static PrintStream err = null;
```

奇怪的是，

- 这三个常量对象有 final 声明，但是却初始化为 null。final 声明的常量一旦赋值就不能修改，那么 null 不会空指针异常吗？
- 这三个常量对象为什么要小写？final 声明的常量按照命名规范不是应该大写吗？
- 这三个常量的对象有 set 方法？final 声明的常量不是不能修改值吗？set 方法是如何修改它们的值的？

```java
final 声明的常量，表示在 Java 的语法体系中它们的值是不能修改的，而这三个常量对象的值是由 C/C++ 等系统函数进行初始化和修改值的，所以它们故意没有用大写，也有 set 方法
```

```java
public static void setOut(PrintStream out) {
    checkIO();
    setOut0(out);
}
public static void setErr(PrintStream err) {
    checkIO();
    setErr0(err);
}
public static void setIn(InputStream in) {
    checkIO();
    setIn0(in);
}
private static void checkIO() {
    SecurityManager sm = getSecurityManager();
    if (sm != null) {
        sm.checkPermission(new RuntimePermission("setIO"));
    }
}
private static native void setIn0(InputStream in);
private static native void setOut0(PrintStream out);
private static native void setErr0(PrintStream err);
```

### 打印流

-  实现将基本数据类型的数据格式转化为字符串输出。 
-  打印流：`PrintStream`和`PrintWriter` 
   -  提供了一系列重载的`print()`和`println()`方法，用于多种数据类型的输出
   ![20240403230753](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240403230753.png)
   ![20240403230802](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240403230802.png)
   -  PrintStream 和 PrintWriter 的输出不会抛出 IOException 异常 
   -  PrintStream 和 PrintWriter 有自动 flush 功能 
   -  PrintStream 打印的所有字符都使用平台的默认字符编码转换为字节。在需要写入字符而不是写入字节的情况下，应该使用 PrintWriter 类
   -  `System.out`返回的是 PrintStream 的实例 
-  构造器 
   - `PrintStream(File file)`：创建具有指定文件且不带自动行刷新的新打印流
   - `PrintStream(File file, String csn)`：创建具有指定文件名称和字符集且不带自动行刷新的新打印流
   - `PrintStream(OutputStream out)`：创建新的打印流
   - `PrintStream(OutputStream out, boolean autoFlush)`：创建新的打印流。 autoFlush如果为 true，则每当写入 byte 数组、调用其中一个 println 方法或写入换行符或字节 ('\n') 时都会刷新输出缓冲区
   - `PrintStream(OutputStream out, boolean autoFlush, String encoding)`：创建新的打印流
   - `PrintStream(String fileName)`：创建具有指定文件名称且不带自动行刷新的新打印流
   - `PrintStream(String fileName, String csn)`：创建具有指定文件名称和字符集且不带自动行刷新的新打印流
-  代码举例 

```java
package com.atguigu.systemio;

import java.io.FileNotFoundException;
import java.io.PrintStream;

public class TestPrintStream {
    public static void main(String[] args) throws FileNotFoundException {
        PrintStream ps = new PrintStream("io.txt");
        ps.println("hello");
        ps.println(1);
        ps.println(1.5);
        ps.close();
    }
}
```


### Scanner类

构造方法

- `Scanner(File source)`：构造一个新的 Scanner，它生成的值是从指定文件扫描的
- `Scanner(File source, String charsetName)`：构造一个新的 Scanner，它生成的值是从指定文件扫描的
- `Scanner(InputStream source)`：构造一个新的 Scanner，它生成的值是从指定的输入流扫描的
- `Scanner(InputStream source, String charsetName)`：构造一个新的 Scanner，它生成的值是从指定的输入流扫描的

常用方法：

- `boolean hasNextXxx()`： 如果通过使用`nextXxx()`方法，此扫描器输入信息中的下一个标记可以解释为默认基数中的一个 Xxx 值，则返回 true
- `Xxx nextXxx()`： 将输入信息的下一个标记扫描为一个 Xxx

```java
import org.junit.Test;

import java.io.*;
import java.util.Scanner;

public class TestScanner {

    @Test
    public void test01() throws IOException {
        Scanner input = new Scanner(System.in);
        PrintStream ps = new PrintStream("1.txt");
        while(true){
            System.out.print("请输入一个单词：");
            String str = input.nextLine();
            if("stop".equals(str)){
                break;
            }
            ps.println(str);
        }
        input.close();
        ps.close();
    }
    
    @Test
    public void test2() throws IOException {
        Scanner input = new Scanner(new FileInputStream("1.txt"));
        while(input.hasNextLine()){
            String str = input.nextLine();
            System.out.println(str);
        }
        input.close();
    }
}
```

## apache-common包的使用

### 介绍

IO 技术开发中，代码量很大，而且代码的重复率较高，为此 Apache 软件基金会，开发了 IO 技术的工具类`commonsIO`，大大简化了 IO 开发

Apahce 软件基金会属于第三方，（Oracle 公司第一方，我们自己第二方，其他都是第三方）我们要使用第三方开发好的工具，需要添加 jar 包

- IOUtils类的使用

```java
- 静态方法：`IOUtils.copy(InputStream in,OutputStream out)`传递字节流，实现文件复制
- 静态方法：`IOUtils.closeQuietly(任意流对象)`悄悄的释放资源，自动处理`close()`方法抛出的异常
```

```java
public class Test01 {
    public static void main(String[] args)throws Exception {
        //- 静态方法：IOUtils.copy(InputStream in,OutputStream out)传递字节流，实现文件复制。
        IOUtils.copy(new FileInputStream("E:\\Idea\\io\\1.jpg"),new FileOutputStream("E:\\Idea\\io\\file\\柳岩.jpg"));
        //- 静态方法：IOUtils.closeQuietly(任意流对象)悄悄的释放资源，自动处理close()方法抛出的异常。
       /* FileWriter fw = null;
        try {
            fw = new FileWriter("day21\\io\\writer.txt");
            fw.write("hahah");
        } catch (IOException e) {
            e.printStackTrace();
        }finally {
           IOUtils.closeQuietly(fw);
        }*/
    }
}
```

- FileUtils类的使用

```java
- 静态方法：void copyDirectoryToDirectory(File src,File dest)：整个目录的复制，自动进行递归遍历
          参数:
          src:要复制的文件夹路径
          dest:要将文件夹粘贴到哪里去
             
- 静态方法：void writeStringToFile(File file,String content)：将内容 content 写入到 file 中
- 静态方法：String readFileToString(File file)：读取文件内容，并返回一个 String
- 静态方法：void copyFile(File srcFile,File destFile)：文件复制
```

```java
public class Test02 {
    public static void main(String[] args) {
        try {
            //- 静态方法：void copyDirectoryToDirectory(File src,File dest);
            FileUtils.copyDirectoryToDirectory(new File("E:\\Idea\\io\\aa"),new File("E:\\Idea\\io\\file"));


            //- 静态方法：writeStringToFile(File file,String str)
            FileUtils.writeStringToFile(new File("day21\\io\\commons.txt"),"柳岩你好");

            //- 静态方法：String readFileToString(File file)
            String s = FileUtils.readFileToString(new File("day21\\io\\commons.txt"));
            System.out.println(s);
            //- 静态方法：void copyFile(File srcFile,File destFile)
            FileUtils.copyFile(new File("io\\yangm.png"),new File("io\\yangm2.png"));
            System.out.println("复制成功");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

