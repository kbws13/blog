---
id: common-classes-and-apis
slug: /common-classes-and-apis
title: 常用类和API
date: 2024-02-25
tags: [常用类, API]
keywords: [常用类, API]
---
## String
### 特性

-  `java.lang.String` 类代表字符串。Java 程序中所有的字符串文字（例如`"hello"`）都可以看作是实现此类的实例。 
-  字符串是常量，用双引号引起来表示。它们的值在创建之后不能更改。 
```java
String s1 = "hello";
String s2 = "hello";
System.out.println(s1 == s2);
// 内存中只有一个"hello"对象被创建，同时被s1和s2共享。
```

对应内存结构为：（以下内存结构以`JDK6为例`绘制）：

-  字符串 String 类型本身是final声明的，意味着我们不能继承 String。 
-  String 对象的字符内容是存储在一个字符数组value[]中的。`"abc"` 等效于 `char[] data={'h','e','l','l','o'}`。 

![20240225223619](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240225223619.png)

-  private 意味着外面无法直接获取字符数组，而且 String 没有提供 value 的 get 和 set 方法。 
-  final 意味着字符数组的引用不可改变，而且 String 也没有提供方法来修改 value 数组某个元素值 
-  因此字符串的字符数组内容也不可变的，即 String 代表着不可变的字符序列。即，一旦对字符串进行修改，就会产生新对象。 
-  JDK9 只有，底层使用 byte[] 数组。 
- Java 语言提供对字符串串联符号（"+"）以及将其他对象转换为字符串的特殊支持(`toString()`方法）。
### 内存结构

**概述**

因为字符串对象设计为不可变，那么所以字符串有常量池来保存很多常量对象。

JDK6中，字符串常量池在方法区。 JDK7开始，就移到堆空间，直到JDK17版本。

举例内存结构分配：

![20240225223636](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240225223636.png)

> **结论：**
>  
> （1）常量+常量：结果是常量池。且常量池中不会存在相同内容的常量。
>  
> （2）常量与变量 或 变量与变量：结果在堆中
>  
> （3）拼接后调用intern方法：返回值在常量池中


练习：

**拼接**

```java
String s1 = "hello";
String s2 = "hello";
System.out.println(s1 == s2);
// 内存中只有一个"hello"对象被创建，同时被s1和s2共享。
```
对应内存结构为：（以下内存结构以`JDK6为例`绘制）：

![20240225223648](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240225223648.png)

![20240225223659](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240225223659.png)

```java
Person p1 = new Person();
p1.name = “Tom";

Person p2 = new Person();
p2.name = “Tom";

System.out.println(p1.name.equals( p2.name)); //
System.out.println(p1.name == p2.name); //
System.out.println(p1.name == "Tom"); //
```

![20240225223717](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240225223717.png)

**new**

`String str1 = “abc”; 与 String str2 = new String(“abc”);`的区别？

![20240225223729](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240225223729.png)

str2 首先指向堆中的一个字符串对象，然后堆中字符串的 value 数组指向常量池中常量对象的 value 数组。
> -  字符串常量存储在字符串常量池，目的是共享。 
> -  字符串非常量对象存储在堆中。 



**intern()**

- **String s1 = "a";**

说明：在字符串常量池中创建了一个字面量为"a"的字符串。

- **s1 = s1 + "b";**

说明：实际上原来的“a”字符串对象已经丢弃了，现在在堆空间中产生了一个字符串 s1+"b"（也就是"ab")。如果多次执行这些改变串内容的操作，会导致大量副本字符串对象存留在内存中，降低效率。如果这样的操作放到循环中，会极大影响程序的性能。

- **String s2 = "ab";**

说明：直接在字符串常量池中创建一个字面量为"ab"的字符串。

- **String s3 = "a" + "b";**

说明：s3 指向字符串常量池中已经创建的"ab"的字符串。

- **String s4 = s1.intern();**

说明：堆空间的 s1 对象在调用`intern()`之后，会将常量池中已经存在的"ab"字符串赋值给 s4。

练习：
```java
String s1 = "hello";
String s2 = "world";
String s3 = "hello" + "world";
String s4 = s1 + "world";
String s5 = s1 + s2;
String s6 = (s1 + s2).intern();

System.out.println(s3 == s4);
System.out.println(s3 == s5);
System.out.println(s4 == s5);
System.out.println(s3 == s6);
```
> **结论：**
> （1）常量+常量：结果是常量池。且常量池中不会存在相同内容的常量。
> （2）常量与变量 或 变量与变量：结果在堆中
> （3）拼接后调用intern方法：返回值在常量池中

### 常用API
#### 构造器

- `public String()` ：初始化新创建的 String 对象，以使其表示空字符序列。
- `String(String original)`： 初始化一个新创建的 `String` 对象，使其表示一个与参数相同的字符序列；换句话说，新创建的字符串是该参数字符串的副本。
- `public String(char[] value)` ：通过当前参数中的字符数组来构造新的 String。
- `public String(char[] value,int offset, int count)` ：通过字符数组的一部分来构造新的 String。
- `public String(byte[] bytes)` ：通过使用平台的**默认字符集**解码当前参数中的字节数组来构造新的 String。
- `public String(byte[] bytes,String charsetName)` ：通过使用指定的字符集解码当前参数中的字节数组来构造新的 String。

举例：
```java
//字面量定义方式：字符串常量对象
String str = "hello";

//构造器定义方式：无参构造
String str1 = new String();

//构造器定义方式：创建"hello"字符串常量的副本
String str2 = new String("hello");

//构造器定义方式：通过字符数组构造
char chars[] = {'a', 'b', 'c','d','e'};     
String str3 = new String(chars);
String str4 = new String(chars,0,3);

//构造器定义方式：通过字节数组构造
byte bytes[] = {97, 98, 99 };     
String str5 = new String(bytes);
String str6 = new String(bytes,"GBK");
```

```java
public static void main(String[] args) {
	char[] data = {'h','e','l','l','o','j','a','v','a'};
	String s1 = String.copyValueOf(data);
	String s2 = String.copyValueOf(data,0,5);
	int num = 123456;
	String s3 = String.valueOf(num);
	
    System.out.println(s1);
	System.out.println(s2);
	System.out.println(s3);
}
```

#### String与其他结构间的转换

**字符串 --> 基本数据类型、包装类：**

- Integer 包装类的`public static int parseInt(String s)`：可以将由“数字”字符组成的字符串转换为整型。
- 类似地，使用`java.lang`包中的 Byte、Short、Long、Float、Double 类调相应的类方法可以将由“数字”字符组成的字符串，转化为相应的基本数据类型。

**基本数据类型、包装类 --> 字符串：**

- 调用 String 类的`public String valueOf(int n)`可将 int 型转换为字符串
- 相应的`valueOf(byte b)`、`valueOf(long l)`、`valueOf(float f)`、`valueOf(double d)`、`valueOf(boolean b)`可由参数的相应类型到字符串的转换。

**字符数组 -->  字符串：**

- String 类的构造器：`String(char[])` 和 `String(char[]，int offset，int length)` 分别用字符数组中的全部字符和部分字符创建字符串对象。

**字符串 -->  字符数组：**

-  `public char[] toCharArray()`：将字符串中的全部字符存放在一个字符数组中的方法。 
-  `public void getChars(int srcBegin, int srcEnd, char[] dst, int dstBegin)`：提供了将指定索引范围内的字符串存放到数组中的方法。 

**字符串 --> 字节数组：（编码）**

- `public byte[] getBytes()` ：使用平台的默认字符集将此 String 编码为 byte 序列，并将结果存储到一个新的 byte 数组中。
- `public byte[] getBytes(String charsetName)` ：使用指定的字符集将此 String 编码到 byte 序列，并将结果存储到新的 byte 数组。

**字节数组 --> 字符串：（解码）**

- `String(byte[])`：通过使用平台的默认字符集解码指定的 byte 数组，构造一个新的 String。
- `String(byte[]，int offset，int length)` ：用指定的字节数组的一部分，即从数组起始位置offset开始取length个字节构造一个字符串对象。
- `String(byte[], String charsetName)` 或 `new String(byte[], int, int,String charsetName)`：解码，按照指定的编码方式进行解码。

代码示例：
```java
@Test
public void test01() throws Exception {
    String str = "中国";
    System.out.println(str.getBytes("ISO8859-1").length);// 2
    // ISO8859-1把所有的字符都当做一个byte处理，处理不了多个字节
    System.out.println(str.getBytes("GBK").length);// 4 每一个中文都是对应2个字节
    System.out.println(str.getBytes("UTF-8").length);// 6 常规的中文都是3个字节

    /*
     * 不乱码：（1）保证编码与解码的字符集名称一样（2）不缺字节
     */
    System.out.println(new String(str.getBytes("ISO8859-1"), "ISO8859-1"));// 乱码
    System.out.println(new String(str.getBytes("GBK"), "GBK"));// 中国
    System.out.println(new String(str.getBytes("UTF-8"), "UTF-8"));// 中国
}
```

#### 常用方法
（1）`boolean isEmpty()`：字符串是否为空

（2）`int length()`：返回字符串的长度

（3）`String concat(xx)`：拼接

（4）`boolean equals(Object obj)`：比较字符串是否相等，区分大小写

（5）`boolean equalsIgnoreCase(Object obj)`：比较字符串是否相等，不区分大小写

（6）`int compareTo(String other)`：比较字符串大小，区分大小写，按照Unicode编码值比较大小

（7）`int compareToIgnoreCase(String other)`：比较字符串大小，不区分大小写

（8）`String toLowerCase()`：将字符串中大写字母转为小写

（9）`String toUpperCase()`：将字符串中小写字母转为大写

（10）`String trim()`：去掉字符串前后空白符

（11）`public String intern()`：结果在常量池中共享

```java
	@Test
	public void test01(){
		//将用户输入的单词全部转为小写，如果用户没有输入单词，重新输入
		Scanner input = new Scanner(System.in);
		String word;
		while(true){
			System.out.print("请输入单词：");
			word = input.nextLine();
			if(word.trim().length()!=0){
				word = word.toLowerCase();
				break;
			}
		}
		System.out.println(word);
	}

	@Test
	public void test02(){
        //随机生成验证码，验证码由0-9，A-Z,a-z的字符组成
		char[] array = new char[26*2+10];
		for (int i = 0; i < 10; i++) {
			array[i] = (char)('0' + i);
		}
		for (int i = 10,j=0; i < 10+26; i++,j++) {
			array[i] = (char)('A' + j);
		}
		for (int i = 10+26,j=0; i < array.length; i++,j++) {
			array[i] = (char)('a' + j);
		}
		String code = "";
		Random rand = new Random();
		for (int i = 0; i < 4; i++) {
			code += array[rand.nextInt(array.length)];
		}
		System.out.println("验证码：" + code);
		//将用户输入的单词全部转为小写，如果用户没有输入单词，重新输入
		Scanner input = new Scanner(System.in);
		System.out.print("请输入验证码：");
		String inputCode = input.nextLine();
		
		if(!code.equalsIgnoreCase(inputCode)){
			System.out.println("验证码输入不正确");
		}
	}
```

#### 查找
（11）`boolean contains(xx)`：是否包含xx

（12）`int indexOf(xx)`：从前往后找当前字符串中xx，即如果有返回第一次出现的下标，要是没有返回-1

（13）`int indexOf(String str, int fromIndex)`：返回指定子字符串在此字符串中第一次出现处的索引，从指定的索引开始

（14）`int lastIndexOf(xx)`：从后往前找当前字符串中xx，即如果有返回最后一次出现的下标，要是没有返回-1

（15）`int lastIndexOf(String str, int fromIndex)`：返回指定子字符串在此字符串中最后一次出现处的索引，从指定的索引开始反向搜索。
```java
	@Test
	public void test01(){
		String str = "尚硅谷是一家靠谱的培训机构，尚硅谷可以说是IT培训的小清华，JavaEE是尚硅谷的当家学科，尚硅谷的大数据培训是行业独角兽。尚硅谷的前端和UI专业一样独领风骚。";
		System.out.println("是否包含清华：" + str.contains("清华"));
		System.out.println("培训出现的第一次下标：" + str.indexOf("培训"));
		System.out.println("培训出现的最后一次下标：" + str.lastIndexOf("培训"));
	}
```

#### 字符串截取
（16）`String substring(int beginIndex)` ：返回一个新的字符串，它是此字符串的从 beginIndex 开始截取到最后的一个子字符串。

（17）`String substring(int beginIndex, int endIndex)` ：返回一个新字符串，它是此字符串从 beginIndex 开始截取到 endIndex (不包含)的一个子字符串。

```java
@Test
public void test01(){
    String str = "helloworldjavaatguigu";
    String sub1 = str.substring(5);
    String sub2 = str.substring(5,10);
    System.out.println(sub1);
    System.out.println(sub2);
}

@Test
public void test02(){
    String fileName = "快速学习Java的秘诀.dat";
    //截取文件名
    System.out.println("文件名：" + fileName.substring(0,fileName.lastIndexOf(".")));
    //截取后缀名
    System.out.println("后缀名：" + fileName.substring(fileName.lastIndexOf(".")));
}
```

#### 和字符/字符数组相关
（18）`char charAt(index)`：返回[index]位置的字符

（19）`char[] toCharArray()`： 将此字符串转换为一个新的字符数组返回

（20）`static String valueOf(char[] data)`：返回指定数组中表示该字符序列的 String

（21）`static String valueOf(char[] data, int offset, int count)` ： 返回指定数组中表示该字符序列的 String

（22）`static String copyValueOf(char[] data)`： 返回指定数组中表示该字符序列的 String

（23）`static String copyValueOf(char[] data, int offset, int count)`：返回指定数组中表示该字符序列的 String

```java
	@Test
	public void test01(){
		//将字符串中的字符按照大小顺序排列
		String str = "helloworldjavaatguigu";
		char[] array = str.toCharArray();
		Arrays.sort(array);
		str = new String(array);
		System.out.println(str);
	}
	
	@Test
	public void test02(){
		//将首字母转为大写
		String str = "jack";
		str = Character.toUpperCase(str.charAt(0))+str.substring(1);
		System.out.println(str);
	}
	@Test
	public void test03(){
		char[] data = {'h','e','l','l','o','j','a','v','a'};
		String s1 = String.copyValueOf(data);
		String s2 = String.copyValueOf(data,0,5);
		int num = 123456;
		String s3 = String.valueOf(num);
	
    	System.out.println(s1);
		System.out.println(s2);
		System.out.println(s3);
	}
```

#### 开头与结尾
（24）`boolean startsWith(xx)`：测试此字符串是否以指定的前缀开始

（25）`boolean startsWith(String prefix, int toffset)`：测试此字符串从指定索引开始的子字符串是否以指定前缀开始

（26）`boolean endsWith(xx)`：测试此字符串是否以指定的后缀结束

```java
@Test
public void test1(){
    String name = "张三";
    System.out.println(name.startsWith("张"));
}

@Test
public void test2(){
    String file = "Hello.txt";
    if(file.endsWith(".java")){
        System.out.println("Java源文件");
    }else if(file.endsWith(".class")){
        System.out.println("Java字节码文件");
    }else{
        System.out.println("其他文件");
    }
}
```
#### 替换
（27）`String replace(char oldChar, char newChar)`：返回一个新的字符串，它是通过用 newChar 替换此字符串中出现的所有 oldChar 得到的。 不支持正则。

（28）`String replace(CharSequence target, CharSequence replacement)`：使用指定的字面值替换序列替换此字符串所有匹配字面值目标序列的子字符串。 

（29）`String replaceAll(String regex, String replacement)`：使用给定的 replacement 替换此字符串所有匹配给定的正则表达式的子字符串。 

（30）`String replaceFirst(String regex, String replacement)`：使用给定的 replacement 替换此字符串匹配给定的正则表达式的第一个子字符串。 
```java
@Test
public void test1(){
    String str1 = "hello244world.java;887";
    //把其中的非字母去掉
    str1 = str1.replaceAll("[^a-zA-Z]", "");
    System.out.println(str1);

    String str2 = "12hello34world5java7891mysql456";
    //把字符串中的数字替换成,，如果结果中开头和结尾有，的话去掉
    String string = str2.replaceAll("\\d+", ",").replaceAll("^,|,$", "");
    System.out.println(string);

}
```
## StringBuffer、StringBuilder
因为 String 对象是不可变对象，虽然可以共享常量对象，但是对于频繁字符串的修改和拼接操作，效率极低，空间消耗也比较高。因此，JDK 又在 java.lang 包提供了可变字符序列 StringBuffer 和 StringBuilder 类型。

## StringBuffer与StringBuilder的理解

-  `java.lang.StringBuffer`代表`可变的字符序列`，JDK1.0中声明，可以对字符串内容进行增删，此时不会产生新的对象。比如： 
```java
//情况1:
String s = new String("我喜欢学习"); 
//情况2：
StringBuffer buffer = new StringBuffer("我喜欢学习"); 
buffer.append("数学");
```

![20240225223838](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240225223838.png)

![20240225223854](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240225223854.png)

继承结构：

![20240225223911](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240225223911.png)

![20240225223922](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240225223922.png)

- StringBuilder 和 StringBuffer 非常类似，均代表可变的字符序列，而且提供相关功能的方法也一样。
- 区分 String、StringBuffer、StringBuilder 
   - String:不可变的字符序列； 底层使用 char[] 数组存储(JDK8.0中)
   - StringBuffer:可变的字符序列；线程安全(方法有 synchronized 修饰），效率低；底层使用 char[] 数组存储 (JDK8.0中)
   - StringBuilder:可变的字符序列； jdk1.5引入，线程不安全的，效率高；底层使用 char[] 数组存储(JDK8.0中)
### API
StringBuilder、StringBuffer 的 API 是完全一致的，并且很多方法与 String 相同。

**常用API**
（1）`StringBuffer append(xx)`：提供了很多的append()方法，用于进行字符串追加的方式拼接

（2）`StringBuffer delete(int start, int end)`：删除[start,end)之间字符

（3）`StringBuffer deleteCharAt(int index)`：删除[index]位置字符

（4）`StringBuffer replace(int start, int end, String str)`：替换[start,end)范围的字符序列为str

（5）`void setCharAt(int index, char c)`：替换[index]位置字符

（6）`char charAt(int index)`：查找指定index位置上的字符

（7）`StringBuffer insert(int index, xx)`：在[index]位置插入xx

（8）`int length()`：返回存储的字符数据的长度

（9）`StringBuffer reverse()`：反转

**2、其它API**

（1）`int indexOf(String str)`：在当前字符序列中查询 str 的第一次出现下标

（2）`int indexOf(String str, int fromIndex)`：在当前字符序列[fromIndex,最后]中查询 str 的第一次出现下标

（3）`int lastIndexOf(String str)`：在当前字符序列中查询 str 的最后一次出现下标

（4）`int lastIndexOf(String str, int fromIndex)`：在当前字符序列[fromIndex,最后]中查询 str 的最后一次出现下标

（5）`String substring(int start)`：截取当前字符序列[start,最后]

（6）`String substring(int start, int end)`：截取当前字符序列[start,end)

（7）`String toString()`：返回此序列中数据的字符串表示形式

（8）`void setLength(int newLength)` ：设置当前字符序列长度为 newLength
```java
@Test
public void test1(){
    StringBuilder s = new StringBuilder();
    s.append("hello").append(true).append('a').append(12).append("atguigu");
    System.out.println(s);
    System.out.println(s.length());
}

@Test
public void test2(){
    StringBuilder s = new StringBuilder("helloworld");
    s.insert(5, "java");
    s.insert(5, "chailinyan");
    System.out.println(s);
}

@Test
public void test3(){
    StringBuilder s = new StringBuilder("helloworld");
    s.delete(1, 3);
    s.deleteCharAt(4);
    System.out.println(s);
}
@Test
public void test4(){
    StringBuilder s = new StringBuilder("helloworld");
    s.reverse();
    System.out.println(s);
}

@Test
public void test5(){
    StringBuilder s = new StringBuilder("helloworld");
    s.setCharAt(2, 'a');
    System.out.println(s);
}

@Test
public void test6(){
    StringBuilder s = new StringBuilder("helloworld");
    s.setLength(30);
    System.out.println(s);
}
```
## JDK8之前：日期API
### java.lang.System类的方法

-  System 类提供的`public static long currentTimeMillis()`：用来返回当前时间与1970年1月1日0时0分0秒之间以毫秒为单位的时间差。 
   - 此方法适于计算时间差。
-  计算世界时间的主要标准有： 
   - UTC(Coordinated Universal Time)
   - GMT(Greenwich Mean Time)
   - CST(Central Standard Time)

### java.util.Date
表示特定的瞬间，精确到毫秒。

- 构造器： 
   - Date()：使用无参构造器创建的对象可以获取本地当前时间。
   - Date(long 毫秒数)：把该毫秒值换算成日期时间对象
- 常用方法 
   - getTime(): 返回自 1970 年 1 月 1 日 00:00:00 GMT 以来此 Date 对象表示的毫秒数。
   - toString(): 把此 Date 对象转换为以下形式的 String： dow mon dd hh:mm:ss zzz yyyy 其中： dow 是一周中的某一天 (Sun, Mon, Tue, Wed, Thu, Fri, Sat)，zzz是时间标准。
   - 其它很多方法都过时了。
- 举例：

```java
@Test
public void test1(){
    Date d = new Date();
    System.out.println(d);
}

@Test
public void test2(){
    long time = System.currentTimeMillis();
    System.out.println(time);//1559806982971
    //当前系统时间距离1970-1-1 0:0:0 0毫秒的时间差，毫秒为单位
}

@Test
public void test3(){
    Date d = new Date();
    long time = d.getTime();
    System.out.println(time);//1559807047979
}

@Test
public void test4(){
    long time = 1559807047979L;
    Date d = new Date(time);
    System.out.println(d);
}

@Test
public void test5(){
    long time = Long.MAX_VALUE;
    Date d = new Date(time);
    System.out.println(d);
}
```

### java.text.SimpleDateFormat

- `java.text.SimpleDateFormat`类是一个不与语言环境有关的方式来格式化和解析日期的具体类。
- 可以进行格式化：日期 --> 文本
- 可以进行解析：文本 --> 日期
- **构造器：** 
   - `SimpleDateFormat()` ：默认的模式和语言环境创建对象
   - `public SimpleDateFormat(String pattern)`：该构造方法可以用参数 pattern 指定的格式创建一个对象
- **格式化：** 
   - `public String format(Date date)`：方法格式化时间对象 date
- **解析：** 
   - `public Date parse(String source)`：从给定字符串的开始解析文本，以生成一个日期。

![20240225224018](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240225224018.png)

```java
//格式化
@Test
public void test1(){
    Date d = new Date();

    SimpleDateFormat sf = new SimpleDateFormat("yyyy年MM月dd日 HH时mm分ss秒 SSS毫秒  E Z");
    //把Date日期转成字符串，按照指定的格式转
    String str = sf.format(d);
    System.out.println(str);
}
//解析
@Test
public void test2() throws ParseException{
    String str = "2022年06月06日 16时03分14秒 545毫秒  星期四 +0800";
    SimpleDateFormat sf = new SimpleDateFormat("yyyy年MM月dd日 HH时mm分ss秒 SSS毫秒  E Z");
    Date d = sf.parse(str);
    System.out.println(d);
}
```
### **java.util.Calendar(日历)**

-  Date 类的 API 大部分被废弃了，替换为 Calendar。 
-  `Calendar` 类是一个抽象类，主用用于完成日期字段之间相互操作的功能。 
-  获取 Calendar 实例的方法 
   - 使用`Calendar.getInstance()`方法
   - ![20240225224036](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240225224036.png)
   - 调用它的子类 GregorianCalendar(公历)的构造器。
   - ![20240225224045](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240225224045.png)
- 一个 Calendar 的实例是系统时间的抽象表示，可以修改或获取 YEAR、MONTH、DAY_OF_WEEK、HOUR_OF_DAY 、MINUTE、SECOND 等日历字段对应的时间值。
   - `public int get(int field)`：返回给定日历字段的值
   - `public void set(int field,int value)` ：将给定的日历字段设置为指定的值
   - `public void add(int field,int amount)`：根据日历的规则，为给定的日历字段添加或者减去指定的时间量
   - `public final Date getTime()`：将 Calendar 转成 Date 对象
   - `public final void setTime(Date date)`：使用指定的 Date 对象重置 Calendar 的时间
- 常用字段
- ![20240225224055](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240225224055.png)
- 注意：
   - 获取月份时：一月是0，二月是1，以此类推，12月是11
   - 获取星期时：周日是1，周二是2 ， 。。。。周六是7
- 示例代码
```java
import org.junit.Test;

import java.util.Calendar;
import java.util.TimeZone;

public class TestCalendar {
    @Test
    public void test1(){
        Calendar c = Calendar.getInstance();
        System.out.println(c);

        int year = c.get(Calendar.YEAR);
        int month = c.get(Calendar.MONTH)+1;
        int day = c.get(Calendar.DATE);
        int hour = c.get(Calendar.HOUR_OF_DAY);
        int minute = c.get(Calendar.MINUTE);

        System.out.println(year + "-" + month + "-" + day + " " + hour + ":" + minute);
    }

    @Test
    public void test2(){
        TimeZone t = TimeZone.getTimeZone("America/Los_Angeles");
        Calendar c = Calendar.getInstance(t);
        int year = c.get(Calendar.YEAR);
        int month = c.get(Calendar.MONTH)+1;
        int day = c.get(Calendar.DATE);
        int hour = c.get(Calendar.HOUR_OF_DAY);
        int minute = c.get(Calendar.MINUTE);

        System.out.println(year + "-" + month + "-" + day + " " + hour + ":" + minute);
    }
    
    @Test
    public void test3(){
        Calendar calendar = Calendar.getInstance();
		// 从一个 Calendar 对象中获取 Date 对象
		Date date = calendar.getTime();
        
		// 使用给定的 Date 设置此 Calendar 的时间
		date = new Date(234234235235L);
		calendar.setTime(date);
		calendar.set(Calendar.DAY_OF_MONTH, 8);
		System.out.println("当前时间日设置为8后,时间是:" + calendar.getTime());
        
		calendar.add(Calendar.HOUR, 2);
		System.out.println("当前时间加2小时后,时间是:" + calendar.getTime());
        
		calendar.add(Calendar.MONTH, -2);
		System.out.println("当前日期减2个月后,时间是:" + calendar.getTime());  
    }
}
```

## **JDK8：新的日期时间API**
### 本地日期时间：LocalDate、LocalTime、LocalDateTime
| 方法 | **描述** |
| --- | --- |
| `now()`
/ now(ZoneId zone) | 静态方法，根据当前时间创建对象/指定时区的对象 |
| `of(xx,xx,xx,xx,xx,xxx)` | 静态方法，根据指定日期/时间创建对象 |
| getDayOfMonth()/getDayOfYear() | 获得月份天数(1-31) /获得年份天数(1-366) |
| getDayOfWeek() | 获得星期几(返回一个 DayOfWeek 枚举值) |
| getMonth() | 获得月份, 返回一个 Month 枚举值 |
| getMonthValue() / getYear() | 获得月份(1-12) /获得年份 |
| getHours()/getMinute()/getSecond() | 获得当前对象对应的小时、分钟、秒 |
| withDayOfMonth()/withDayOfYear()/withMonth()/withYear() | 将月份天数、年份天数、月份、年份修改为指定的值并返回新的对象 |
| with(TemporalAdjuster  t) | 将当前日期时间设置为校对器指定的日期时间 |
| plusDays(), plusWeeks(), plusMonths(), plusYears(),plusHours() | 向当前对象添加几天、几周、几个月、几年、几小时 |
| minusMonths() / minusWeeks()/minusDays()/minusYears()/minusHours() | 从当前对象减去几月、几周、几天、几年、几小时 |
| plus(TemporalAmount t)/minus(TemporalAmount t) | 添加或减少一个 Duration 或 Period |
| isBefore()/isAfter() | 比较两个 LocalDate |
| isLeapYear() | 判断是否是闰年（在LocalDate类中声明） |
| format(DateTimeFormatter  t) | 格式化本地日期、时间，返回一个字符串 |
| parse(Charsequence text) | 将指定格式的字符串解析为日期、时间 |


```java
import org.junit.Test;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class TestLocalDateTime {
    @Test
    public void test01(){
        LocalDate now = LocalDate.now();
        System.out.println(now);
    }
    @Test
    public void test02(){
        LocalTime now = LocalTime.now();
        System.out.println(now);
    }
    @Test
    public void test03(){
        LocalDateTime now = LocalDateTime.now();
        System.out.println(now);
    }
    @Test
    public void test04(){
        LocalDate lai = LocalDate.of(2019, 5, 13);
        System.out.println(lai);
    }
	@Test
    public void test05(){
        LocalDate lai = LocalDate.of(2019, 5, 13);
        System.out.println(lai.getDayOfYear());
    }
	@Test
    public void test06(){
        LocalDate lai = LocalDate.of(2019, 5, 13);
        LocalDate go = lai.plusDays(160);
        System.out.println(go);//2019-10-20
    }
    @Test
    public void test7(){
        LocalDate now = LocalDate.now();
        LocalDate before = now.minusDays(100);
        System.out.println(before);//2019-02-26
    }   
}
```

### 瞬时：Instant

- Instant：时间线上的一个瞬时点。 这可能被用来记录应用程序中的事件时间戳。 
   - 时间戳是指格林威治时间1970年01月01日00时00分00秒(北京时间1970年01月01日08时00分00秒)起至现在的总秒数。
- `java.time.Instant`表示时间线上的一点，而不需要任何上下文信息，例如，时区。概念上讲，`它只是简单的表示自1970年1月1日0时0分0秒（UTC）开始的秒数。`
| **方法** | **描述** |
| --- | --- |
| `now()` | 静态方法，返回默认UTC时区的Instant类的对象 |
| `ofEpochMilli(long epochMilli)` | 静态方法，返回在1970-01-01 00:00:00基础上加上指定毫秒数之后的Instant类的对象 |
| atOffset(ZoneOffset offset) | 结合即时的偏移来创建一个 OffsetDateTime |
| `toEpochMilli()` | 返回1970-01-01 00:00:00到当前时间的毫秒数，即为时间戳 |


> 中国大陆、中国香港、中国澳门、中国台湾、蒙古国、新加坡、马来西亚、菲律宾、西澳大利亚州的时间与UTC的时差均为+8，也就是UTC+8。
> instant.atOffset(ZoneOffset.ofHours(8));

### 日期时间格式化：DateTimeFormatter

该类提供了三种格式化方法：

-  (了解)预定义的标准格式。如：ISO_LOCAL_DATE_TIME、ISO_LOCAL_DATE、ISO_LOCAL_TIME 
-  (了解)本地化相关的格式。如：ofLocalizedDate(FormatStyle.LONG) 
```java
// 本地化相关的格式。如：ofLocalizedDateTime()
// FormatStyle.MEDIUM / FormatStyle.SHORT :适用于LocalDateTime
				
// 本地化相关的格式。如：ofLocalizedDate()
// FormatStyle.FULL / FormatStyle.LONG / FormatStyle.MEDIUM / FormatStyle.SHORT : 适用于LocalDate
```

-  自定义的格式。如：ofPattern(“yyyy-MM-dd hh:mm:ss”) 
| **方法** | **描述** |
| --- | --- |
| **ofPattern(Stringpattern)** | 静态方法，返回一个指定字符串格式的DateTimeFormatter |
| **format(TemporalAccessort)** | 格式化一个日期、时间，返回字符串 |
| **parse(CharSequencetext)** | 将指定格式的字符序列解析为一个日期、时间 |


举例：
```java
import org.junit.Test;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.FormatStyle;

public class TestDatetimeFormatter {
    @Test
    public void test1(){
        // 方式一：预定义的标准格式。如：ISO_LOCAL_DATE_TIME;ISO_LOCAL_DATE;ISO_LOCAL_TIME
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
        // 格式化:日期-->字符串
        LocalDateTime localDateTime = LocalDateTime.now();
        String str1 = formatter.format(localDateTime);
        System.out.println(localDateTime);
        System.out.println(str1);//2022-12-04T21:02:14.808

        // 解析：字符串 -->日期
        TemporalAccessor parse = formatter.parse("2022-12-04T21:02:14.808");
        LocalDateTime dateTime = LocalDateTime.from(parse);
        System.out.println(dateTime);
    }

    @Test
    public void test2(){
        LocalDateTime localDateTime = LocalDateTime.now();
        // 方式二：
        // 本地化相关的格式。如：ofLocalizedDateTime()
        // FormatStyle.LONG / FormatStyle.MEDIUM / FormatStyle.SHORT :适用于LocalDateTime
        DateTimeFormatter formatter1 = DateTimeFormatter.ofLocalizedDateTime(FormatStyle.LONG);
        
        // 格式化
        String str2 = formatter1.format(localDateTime);
        System.out.println(str2);// 2022年12月4日 下午09时03分55秒

        // 本地化相关的格式。如：ofLocalizedDate()
        // FormatStyle.FULL / FormatStyle.LONG / FormatStyle.MEDIUM / FormatStyle.SHORT : 适用于LocalDate
        DateTimeFormatter formatter2 = DateTimeFormatter.ofLocalizedDate(FormatStyle.FULL);
        // 格式化
        String str3 = formatter2.format(LocalDate.now());
        System.out.println(str3);// 2022年12月4日 星期日
    }

    @Test
    public void test3(){
        //方式三：自定义的方式（关注、重点）
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss");
        //格式化
        String strDateTime = dateTimeFormatter.format(LocalDateTime.now());
        System.out.println(strDateTime); //2022/12/04 21:05:42
        //解析
        TemporalAccessor accessor = dateTimeFormatter.parse("2022/12/04 21:05:42");
        LocalDateTime localDateTime = LocalDateTime.from(accessor);
        System.out.println(localDateTime); //2022-12-04T21:05:42
    }
}
```

### 其它API
**1、指定时区日期时间：ZondId 和 ZonedDateTime**

-  ZoneId：该类中包含了所有的时区信息，一个时区的ID，如 Europe/Paris 
-  ZonedDateTime：一个在ISO-8601日历系统时区的日期时间，如 2007-12-03T10:15:30+01:00 Europe/Paris。 
   - 其中每个时区都对应着 ID，地区 ID 都为“{区域}/{城市}”的格式，例如：Asia/Shanghai 等
-  常见时区ID： 
```java
Asia/Shanghai
UTC
America/New_York
```

- 可以通过ZondId获取所有可用的时区ID：
```java
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Set;

public class TestZone {
    @Test
    public void test01() {
        //需要知道一些时区的id
        //Set<String>是一个集合，容器
        Set<String> availableZoneIds = ZoneId.getAvailableZoneIds();
        //快捷模板iter
        for (String availableZoneId : availableZoneIds) {
            System.out.println(availableZoneId);
        }
    }

    @Test
    public void test02(){
        ZonedDateTime t1 = ZonedDateTime.now();
        System.out.println(t1);

        ZonedDateTime t2 = ZonedDateTime.now(ZoneId.of("America/New_York"));
        System.out.println(t2);
    }
}
```

**2、持续日期/时间：Period和Duration**

- 持续时间：Duration，用于计算两个“时间”间隔
- 日期间隔：Period，用于计算两个“日期”间隔

```java
import org.junit.Test;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;

public class TestPeriodDuration {
    @Test
    public void test01(){
        LocalDate t1 = LocalDate.now();
        LocalDate t2 = LocalDate.of(2018, 12, 31);
        Period between = Period.between(t1, t2);
        System.out.println(between);

        System.out.println("相差的年数："+between.getYears());
        System.out.println("相差的月数："+between.getMonths());
        System.out.println("相差的天数："+between.getDays());
        System.out.println("相差的总数："+between.toTotalMonths());
    }

    @Test
    public void test02(){
        LocalDateTime t1 = LocalDateTime.now();
        LocalDateTime t2 = LocalDateTime.of(2017, 8, 29, 0, 0, 0, 0);
        Duration between = Duration.between(t1, t2);
        System.out.println(between);

        System.out.println("相差的总天数："+between.toDays());
        System.out.println("相差的总小时数："+between.toHours());
        System.out.println("相差的总分钟数："+between.toMinutes());
        System.out.println("相差的总秒数："+between.getSeconds());
        System.out.println("相差的总毫秒数："+between.toMillis());
        System.out.println("相差的总纳秒数："+between.toNanos());
        System.out.println("不够一秒的纳秒数："+between.getNano());
    }
    @Test
    public void test03(){
        //Duration:用于计算两个“时间”间隔，以秒和纳秒为基准
		LocalTime localTime = LocalTime.now();
		LocalTime localTime1 = LocalTime.of(15, 23, 32);
		//between():静态方法，返回Duration对象，表示两个时间的间隔
		Duration duration = Duration.between(localTime1, localTime);
		System.out.println(duration);

		System.out.println(duration.getSeconds());
		System.out.println(duration.getNano());

		LocalDateTime localDateTime = LocalDateTime.of(2016, 6, 12, 15, 23, 32);
		LocalDateTime localDateTime1 = LocalDateTime.of(2017, 6, 12, 15, 23, 32);

		Duration duration1 = Duration.between(localDateTime1, localDateTime);
		System.out.println(duration1.toDays());
    }
    
    @Test
    public void test4(){
        //Period:用于计算两个“日期”间隔，以年、月、日衡量
		LocalDate localDate = LocalDate.now();
		LocalDate localDate1 = LocalDate.of(2028, 3, 18);

		Period period = Period.between(localDate, localDate1);
		System.out.println(period);

		System.out.println(period.getYears());
		System.out.println(period.getMonths());
		System.out.println(period.getDays());

		Period period1 = period.withYears(2);
		System.out.println(period1);

    }
}
```

3、Clock：使用时区提供对当前即时、日期和时间的访问的时钟。

4、TemporalAdjuster : 时间校正器。有时我们可能需要获取例如：将日期调整到“下一个工作日”等操作。

5、TemporalAdjusters : 该类通过静态方法(`firstDayOfXxx()`/`lastDayOfXxx()`/`nextXxx()`)提供了大量的常用 TemporalAdjuster 的实现。

```java
@Test
public void test1(){
    // TemporalAdjuster:时间校正器
	// 获取当前日期的下一个周日是哪天？
	TemporalAdjuster temporalAdjuster = TemporalAdjusters.next(DayOfWeek.SUNDAY);
	LocalDateTime localDateTime = LocalDateTime.now().with(temporalAdjuster);
	System.out.println(localDateTime);
	// 获取下一个工作日是哪天？
	LocalDate localDate = LocalDate.now().with(new TemporalAdjuster() {
   	 	@Override
   	 	public Temporal adjustInto(Temporal temporal) {
        	LocalDate date = (LocalDate) temporal;
     	  	if (date.getDayOfWeek().equals(DayOfWeek.FRIDAY)) {
           		return date.plusDays(3);
        	} else if (date.getDayOfWeek().equals(DayOfWeek.SATURDAY)) {
            	return date.plusDays(2);
        	} else {
            	return date.plusDays(1);
        	}
    	}
	});
	System.out.println("下一个工作日是：" + localDate);

}
```

### 与传统日期处理的转换
| **类** | **To遗留类** | **From遗留类** |
| --- | --- | --- |
| **java.time.Instant与java.util.Date** | Date.from(instant) | date.toInstant() |
| **java.time.Instant与java.sql.Timestamp** | Timestamp.from(instant) | timestamp.toInstant() |
| **java.time.ZonedDateTime与java.util.GregorianCalendar** | GregorianCalendar.from(zonedDateTime) | cal.toZonedDateTime() |
| **java.time.LocalDate与java.sql.Time** | Date.valueOf(localDate) | date.toLocalDate() |
| **java.time.LocalTime与java.sql.Time** | Date.valueOf(localDate) | date.toLocalTime() |
| **java.time.LocalDateTime与java.sql.Timestamp** | Timestamp.valueOf(localDateTime) | timestamp.toLocalDateTime() |
| **java.time.ZoneId与java.util.TimeZone** | Timezone.getTimeZone(id) | timeZone.toZoneId() |
| **java.time.format.DateTimeFormatter与java.text.DateFormat** | formatter.toFormat() | 无 |

## Java比较器

-  在Java中经常会涉及到对象数组的排序问题，那么就涉及到对象之间的比较问题。 
-  Java实现对象排序的方式有两种： 
   - 自然排序：java.lang.Comparable
   - 定制排序：java.util.Comparator
### 自然排序：java.lang.Comparable

- Comparable 接口强行对实现它的每个类的对象进行整体排序。这种排序被称为类的自然排序。
- 实现 Comparable 的类必须实现 `compareTo(Object obj)`方法，两个对象即通过`compareTo(Object obj)`方法的返回值来比较大小。如果当前对象 this 大于形参对象 obj，则返回正整数，如果当前对象 this 小于形参对象 obj，则返回负整数，如果当前对象 this 等于形参对象 obj，则返回零。

```java
package java.lang;

public interface Comparable{
    int compareTo(Object obj);
}
```

-  实现 Comparable 接口的对象列表（和数组）可以通过`Collections.sort`或`Arrays.sort`进行自动排序。实现此接口的对象可以用作有序映射中的键或有序集合中的元素，无需指定比较器。 
-  对于类 C 的每一个 e1 和 e2 来说，当且仅当 e1.compareTo(e2) == 0 与 e1.equals(e2) 具有相同的 boolean 值时，类 C 的自然排序才叫做与 equals 一致。建议（虽然不是必需的）`最好使自然排序与 equals 一致`。 
-  Comparable 的典型实现：(`默认都是从小到大排列的`) 
   - String：按照字符串中字符的Unicode值进行比较
   - Character：按照字符的Unicode值来进行比较
   - 数值类型对应的包装类以及 BigInteger、BigDecimal：按照它们对应的数值大小进行比较
   - Boolean：true 对应的包装类实例大于 false 对应的包装类实例
   - Date、Time等：后面的日期时间比前面的日期时间大
-  代码示例： 

```java
package com.atguigu.api;

public class Student implements Comparable {
    private int id;
    private String name;
    private int score;
    private int age;

    public Student(int id, String name, int score, int age) {
        this.id = id;
        this.name = name;
        this.score = score;
        this.age = age;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    @Override
    public String toString() {
        return "Student{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", score=" + score +
                ", age=" + age +
                '}';
    }

    @Override
    public int compareTo(Object o) {
        //这些需要强制，将o对象向下转型为Student类型的变量，才能调用Student类中的属性
        //默认按照学号比较大小
        Student stu = (Student) o;
        return this.id - stu.id;
    }
}
```

测试类

```java
package com.atguigu.api;

public class TestStudent {
    public static void main(String[] args) {
        Student[] arr = new Student[5];
        arr[0] = new Student(3,"张三",90,23);
        arr[1] = new Student(1,"熊大",100,22);
        arr[2] = new Student(5,"王五",75,25);
        arr[3] = new Student(4,"李四",85,24);
        arr[4] = new Student(2,"熊二",85,18);

        //单独比较两个对象
        System.out.println(arr[0].compareTo(arr[1]));
        System.out.println(arr[1].compareTo(arr[2]));
        System.out.println(arr[2].compareTo(arr[2]));

        System.out.println("所有学生：");
        for (int i = 0; i < arr.length; i++) {
            System.out.println(arr[i]);
        }
        System.out.println("按照学号排序：");
        for (int i = 1; i < arr.length; i++) {
            for (int j = 0; j < arr.length-i; j++) {
                if(arr[j].compareTo(arr[j+1])>0){
                    Student temp = arr[j];
                    arr[j] = arr[j+1];
                    arr[j+1] = temp;
                }
            }
        }
        for (int i = 0; i < arr.length; i++) {
            System.out.println(arr[i]);
        }
    }
}
```
### 定制排序：java.util.Comparator

- 思考 
   - 当元素的类型没有实现`java.lang.Comparable`接口而又不方便修改代码（例如：一些第三方的类，你只有`.class`文件，没有源文件）
   - 如果一个类，实现了 Comparable 接口，也指定了两个对象的比较大小的规则，但是此时此刻我不想按照它预定义的方法比较大小，但是我又不能随意修改，因为会影响其他地方的使用，怎么办？
- JDK在设计类库之初，也考虑到这种情况，所以又增加了一个`java.util.Comparator`接口。强行对多个对象进行整体排序的比较。 
   - 重写`compare(Object o1,Object o2)`方法，比较o1和o2的大小：如果方法返回正整数，则表示o1大于o2；如果返回0，表示相等；返回负整数，表示o1小于o2。
   - 可以将 Comparator 传递给 sort 方法（如`Collections.sort`或`Arrays.sort`），从而允许在排序顺序上实现精确控制。

```java
package java.util;

public interface Comparator{
    int compare(Object o1,Object o2);
}
```

举例：
```java
package com.atguigu.api;

import java.util.Comparator;
//定义定制比较器类
public class StudentScoreComparator implements Comparator { 
    @Override
    public int compare(Object o1, Object o2) {
        Student s1 = (Student) o1;
        Student s2 = (Student) o2;
        int result = s1.getScore() - s2.getScore();
        return result != 0 ? result : s1.getId() - s2.getId();
    }
}
```

测试类
```java
package com.atguigu.api;

public class TestStudent {
    public static void main(String[] args) {
        Student[] arr = new Student[5];
        arr[0] = new Student(3, "张三", 90, 23);
        arr[1] = new Student(1, "熊大", 100, 22);
        arr[2] = new Student(5, "王五", 75, 25);
        arr[3] = new Student(4, "李四", 85, 24);
        arr[4] = new Student(2, "熊二", 85, 18);


        System.out.println("所有学生：");
        for (int i = 0; i < arr.length; i++) {
            System.out.println(arr[i]);
        }

        System.out.println("按照成绩排序");
        StudentScoreComparator sc = new StudentScoreComparator();
        for (int i = 1; i < arr.length; i++) {
            for (int j = 0; j < arr.length - i; j++) {
                if (sc.compare(arr[j], arr[j + 1]) > 0) {
                    Student temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
        for (int i = 0; i < arr.length; i++) {
            System.out.println(arr[i]);
        }
    }
}
```
## 系统相关类
### java.lang.System类

-  System 类代表系统，系统级的很多属性和控制方法都放置在该类的内部。该类位于`java.lang包`。 
-  由于该类的构造器是 private 的，所以无法创建该类的对象。其内部的成员变量和成员方法都是`static的`，所以也可以很方便的进行调用。 
-  成员变量`Scanner scan = new Scanner(System.in);` 
   - System类内部包含`in`、`out`和`err`三个成员变量，分别代表标准输入流(键盘输入)，标准输出流(显示器)和标准错误输出流(显示器)。
-  成员方法 
   -  `native long currentTimeMillis()`：
   该方法的作用是返回当前的计算机时间，时间的表达格式为当前计算机时间和GMT时间(格林威治时间)1970年1月1号0时0分0秒所差的毫秒数。 
   -  `void exit(int status)`：
   该方法的作用是退出程序。其中status的值为0代表正常退出，非零代表异常退出。使用该方法可以在图形界面编程中实现程序的退出功能等。 
   -  `void gc()`：
   该方法的作用是请求系统进行垃圾回收。至于系统是否立刻回收，则取决于系统中垃圾回收算法的实现以及系统执行时的情况。 
   -  `String getProperty(String key)`：
   该方法的作用是获得系统中属性名为key的属性对应的值。系统中常见的属性名以及属性的作用如下表所示： 
   - ![20240225224139](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240225224139.png)
```java
import org.junit.Test;

public class TestSystem {
    @Test
    public void test01(){
        long time = System.currentTimeMillis();
        System.out.println("现在的系统时间距离1970年1月1日凌晨：" + time + "毫秒");

        System.exit(0);

        System.out.println("over");//不会执行
    }

    @Test
    public void test02(){
        String javaVersion = System.getProperty("java.version");
		System.out.println("java的version:" + javaVersion);

		String javaHome = System.getProperty("java.home");
		System.out.println("java的home:" + javaHome);

		String osName = System.getProperty("os.name");
		System.out.println("os的name:" + osName);

		String osVersion = System.getProperty("os.version");
		System.out.println("os的version:" + osVersion);

		String userName = System.getProperty("user.name");
		System.out.println("user的name:" + userName);

		String userHome = System.getProperty("user.home");
		System.out.println("user的home:" + userHome);

		String userDir = System.getProperty("user.dir");
		System.out.println("user的dir:" + userDir);
    }

    @Test
    public void test03() throws InterruptedException {
        for (int i=1; i <=10; i++){
            MyDemo my = new MyDemo(i);
            //每一次循环my就会指向新的对象，那么上次的对象就没有变量引用它了，就成垃圾对象
        }

        //为了看到垃圾回收器工作，我要加下面的代码，让main方法不那么快结束，因为main结束就会导致JVM退出，GC也会跟着结束。
        System.gc();//如果不调用这句代码，GC可能不工作，因为当前内存很充足，GC就觉得不着急回收垃圾对象。
        			//调用这句代码，会让GC尽快来工作。
        Thread.sleep(5000);
    }
}

class MyDemo{
    private int value;

    public MyDemo(int value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return "MyDemo{" + "value=" + value + '}';
    }

    //重写finalize方法，让大家看一下它的调用效果
    @Override
    protected void finalize() throws Throwable {
//        正常重写，这里是编写清理系统内存的代码
//        这里写输出语句是为了看到finalize()方法被调用的效果
        System.out.println(this+ "轻轻的我走了，不带走一段代码....");
    }
}
```

- `static void arraycopy(Object src, int srcPos, Object dest, int destPos, int length)`： 从指定源数组中复制一个数组，复制从指定的位置开始，到目标数组的指定位置结束。常用于数组的插入和删除
### **java.lang.Runtime类**
每个 Java 应用程序都有一个 `Runtime` 类实例，使应用程序能够与其运行的环境相连接。

`public static Runtime getRuntime()`： 返回与当前 Java 应用程序相关的运行时对象。应用程序不能创建自己的 Runtime 类实例。
`public long totalMemory()`：返回 Java 虚拟机中初始化时的内存总量。此方法返回的值可能随时间的推移而变化，这取决于主机环境。默认为物理电脑内存的1/64。
`public long maxMemory()`：返回 Java 虚拟机中最大程度能使用的内存总量。默认为物理电脑内存的1/4。
`public long freeMemory()`：回 Java 虚拟机中的空闲内存量。调用 gc 方法可能导致 freeMemory 返回值的增加。

```java
package com.atguigu.system;

public class TestRuntime {
    public static void main(String[] args) {
        Runtime runtime = Runtime.getRuntime();
        long initialMemory = runtime.totalMemory(); //获取虚拟机初始化时堆内存总量
        long maxMemory = runtime.maxMemory(); //获取虚拟机最大堆内存总量
        String str = "";
        //模拟占用内存
        for (int i = 0; i < 10000; i++) {
            str += i;
        }
        long freeMemory = runtime.freeMemory(); //获取空闲堆内存总量
        System.out.println("总内存：" + initialMemory / 1024 / 1024 * 64 + "MB");
        System.out.println("总内存：" + maxMemory / 1024 / 1024 * 4 + "MB");
        System.out.println("空闲内存：" + freeMemory / 1024 / 1024 + "MB") ;
        System.out.println("已用内存：" + (initialMemory-freeMemory) / 1024 / 1024 + "MB");
    }
}
```

## 和数学相关的类
### java.lang.Math
`java.lang.Math`类包含用于执行基本数学运算的方法，如初等指数、对数、平方根和三角函数。类似这样的工具类，其所有方法均为静态方法，并且不会创建对象，调用起来非常简单。

- `public static double abs(double a)` ：返回 double 值的绝对值。 
```
double d1 = Math.abs(-5); //d1的值为5
double d2 = Math.abs(5); //d2的值为5
```

- `public static double ceil(double a)` ：返回大于等于参数的最小的整数。
```
double d1 = Math.ceil(3.3); //d1的值为 4.0
double d2 = Math.ceil(-3.3); //d2的值为 -3.0
double d3 = Math.ceil(5.1); //d3的值为 6.0
```

- `public static double floor(double a)` ：返回小于等于参数最大的整数。
```
double d1 = Math.floor(3.3); //d1的值为3.0
double d2 = Math.floor(-3.3); //d2的值为-4.0
double d3 = Math.floor(5.1); //d3的值为 5.0
```

- `public static long round(double a)` ：返回最接近参数的 long。(相当于四舍五入方法) 
```
long d1 = Math.round(5.5); //d1的值为6
long d2 = Math.round(5.4); //d2的值为5
long d3 = Math.round(-3.3); //d3的值为-3
long d4 = Math.round(-3.8); //d4的值为-4
```

- `public static double pow(double a,double b)`：返回a的b幂次方法
- `public static double sqrt(double a)`：返回a的平方根
- `public static double random()`：返回[0,1)的随机值
- `public static final double PI`：返回圆周率
- `public static double max(double x, double y)`：返回x,y中的最大值
- `public static double min(double x, double y)`：返回x,y中的最小值
- 其它：acos,asin,atan,cos,sin,tan 三角函数
```java
double result = Math.pow(2,31);
double sqrt = Math.sqrt(256);
double rand = Math.random();
double pi = Math.PI;
```
### java.math包
#### BigInteger

-  Integer 类作为 int 的包装类，能存储的最大整型值为231-1，Long 类也是有限的，最大为263-1。如果要表示再大的整数，不管是基本数据类型还是他们的包装类都无能为力，更不用说进行运算了。 
-  `java.math`包的 BigInteger 可以表示`不可变的任意精度的整数`。BigInteger 提供所有 Java 的基本整数操作符的对应物，并提供 `java.lang.Math`的所有相关方法。另外，BigInteger 还提供以下运算：模算术、GCD 计算、质数测试、素数生成、位操作以及一些其他操作。 
-  构造器 
   - `BigInteger(String val)`：根据字符串构建BigInteger对象
-  方法 
   - public BigInteger `abs`()：返回此 BigInteger 的绝对值的 BigInteger。
   - BigInteger `add`(BigInteger val) ：返回其值为 (this + val) 的 BigInteger
   - BigInteger `subtract`(BigInteger val) ：返回其值为 (this - val) 的 BigInteger
   - BigInteger `multiply`(BigInteger val) ：返回其值为 (this * val) 的 BigInteger
   - BigInteger `divide`(BigInteger val) ：返回其值为 (this / val) 的 BigInteger。整数相除只保留整数部分。
   - BigInteger `remainder`(BigInteger val) ：返回其值为 (this % val) 的 BigInteger。
   - BigInteger[] `divideAndRemainder`(BigInteger val)：返回包含 (this / val) 后跟 (this % val) 的两个 BigInteger 的数组。
   - BigInteger `pow`(int exponent) ：返回其值为 (this^exponent) 的 BigInteger。

```java
@Test
public void test01(){
    //long bigNum = 123456789123456789123456789L;

    BigInteger b1 = new BigInteger("12345678912345678912345678");
    BigInteger b2 = new BigInteger("78923456789123456789123456789");

    //System.out.println("和：" + (b1+b2));//错误的，无法直接使用+进行求和

    System.out.println("和：" + b1.add(b2));
    System.out.println("减：" + b1.subtract(b2));
    System.out.println("乘：" + b1.multiply(b2));
    System.out.println("除：" + b2.divide(b1));
    System.out.println("余：" + b2.remainder(b1));
}
```

#### BigDecimal

-  一般的 Float 类和 Double 类可以用来做科学计算或工程计算，但在**商业计算中，要求数字精度比较高，故用到`java.math.BigDecimal`类。** 
-  BigDecimal 类支持不可变的、任意精度的有符号十进制定点数。 
-  构造器 
   - `public BigDecimal(double val)`
   - `public BigDecimal(String val)` --> 推荐
-  常用方法 
   - public BigDecimal `add`(BigDecimal augend)
   - public BigDecimal `subtract`(BigDecimal subtrahend)
   - public BigDecimal `multiply`(BigDecimal multiplicand)
   - public BigDecimal `divide`(BigDecimal divisor, int scale, int roundingMode)：divisor是除数，scale指明保留几位小数，roundingMode指明舍入模式（ROUND_UP :向上加1、ROUND_DOWN :直接舍去、ROUND_HALF_UP:四舍五入）
-  举例 

```java
@Test
public void test03(){
    BigInteger bi = new BigInteger("12433241123");
    BigDecimal bd = new BigDecimal("12435.351");
    BigDecimal bd2 = new BigDecimal("11");
    System.out.println(bi);
    // System.out.println(bd.divide(bd2));
    System.out.println(bd.divide(bd2, BigDecimal.ROUND_HALF_UP));
    System.out.println(bd.divide(bd2, 15, BigDecimal.ROUND_HALF_UP));
}
```

#### java.util.Random
用于产生随机数

-  `boolean nextBoolean()`:返回下一个伪随机数，它是取自此随机数生成器序列的均匀分布的 boolean 值。 
-  `void nextBytes(byte[] bytes)`:生成随机字节并将其置于用户提供的 byte 数组中。 
-  `double nextDouble()`:返回下一个伪随机数，它是取自此随机数生成器序列的、在 0.0 和 1.0 之间均匀分布的 double 值。 
-  `float nextFloat()`:返回下一个伪随机数，它是取自此随机数生成器序列的、在 0.0 和 1.0 之间均匀分布的 float 值。 
-  `double nextGaussian()`:返回下一个伪随机数，它是取自此随机数生成器序列的、呈高斯（“正态”）分布的 double 值，其平均值是 0.0，标准差是 1.0。 
-  `int nextInt()`:返回下一个伪随机数，它是此随机数生成器的序列中均匀分布的 int 值。 
-  `int nextInt(int n)`:返回一个伪随机数，它是取自此随机数生成器序列的、在 0（包括）和指定值（不包括）之间均匀分布的 int 值。 
-  `long nextLong()`:返回下一个伪随机数，它是取自此随机数生成器序列的均匀分布的 long 值。 

```java
@Test
public void test04(){
    Random r = new Random();
    System.out.println("随机整数：" + r.nextInt());
    System.out.println("随机小数：" + r.nextDouble());
    System.out.println("随机布尔值：" + r.nextBoolean());
}
```
