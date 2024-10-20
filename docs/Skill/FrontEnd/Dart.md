---
id: dart
slug: /dart
title: Dart
date: 2024-10-20
tags: [Dart]
keywords: [Dart]
---

## 环境配置
按照 Dart 环境有两种方法：

1. 直接去 Dart 官网安装：[Get the Dart SDK](https://dart.dev/get-dart)
2. 如果你已经按照了 Flutter SDK，那就不需要再安装 Dart 了，因为 Flutter 里面包含了完整的 Dart SDK

## 基础
### 入口方法
Dart 里面所有要被执行的方法都要放到入口方法（也就是 main 方法中）

main 方法的定义有两种：

第一种是，像下面这样所有的代码都放到 main 方法的方法体中

```dart
main() {
  print('你好');
}
```

第二种方法是，在前面加上 void 表示没有返回值

```dart
void main() {
  print('你好');
}
```

### 注释
```dart
// 单行注释

/// 多行注释
/// 多行注释

/**
 * 多行注释
 */
```

### 变量
Dart 是一个强大的脚本类语言，可以不预先定义变量的类型，会自动推导类型（Dart 里面是有类型校验的）

使用 var 关键字来声明变量，也可以通过类型来声明变量

```dart
void main() {
  var str = '你好';
  String clash = 'clash';
  int num = 123;
}
```

> 注意：写了 var 就不要用变量类型，用变量类型就不要使用 var
>

**Dart 的命名规则：**

1. 变量名称必须是由数字、字母、下划线和美元符（$）组成
2. 标识符开头不能是数字
3. 标识符不能是关键字和保留字
4. 变量的名字是区分大小写的如：age 和 Age 不是一个变量，实际应用中不建议这样用
5. 标识符一定要见名思义：变量名称建议使用名词，方法名使用动词

### 常量
final 和 const 修饰符

const 修饰的变量值不变，一开始就得赋值

final 修饰的变量可以一开始不赋值，只能赋值一次

final 不仅有 const 的编译时常量的特性，最重要的是它是运行时常量，并且 final 是惰性初始化的，即在第一次使用前才初始化

> 想要定义圆周率这种不变的常量时，final 和 const 都可以
>
> 如果想要调用方法定义一个当前时间常量（例如：`final a = new DateTime.now()`），需要使用 final
>

## 数据类型
 Dar 中支持以下数据类型：

常用数据类型：

+ Numbers（数值）：
    - int
    - double
+ Strings（字符串）：
    - String
+ Booleans（布尔）：
    - bool
+ List（数组）：
    - 在 Dart 中，数组是列表对象，一般称他为列表
+ Maps（字典）：
    - 通常来说，Map 是一个存储键值对的对象，键和值可以是任何类型的对象，每个键只出现一次， 而一个值则可以出现多次

### 字符串
**定义**

单行：可以使用一对`'`或者`"`定义单行字符串

多行：如果要定义多行字符串，可以使用一对`'''`或者`"""`来定义

```dart
void main(){

  //1、字符串定义的几种方式
  // var str1='this is str1';
  // var str2="this is str2";

  // print(str1);
  // print(str2);



  // String str1='this is str1';
  // String str2="this is str2";
  // print(str1);
  // print(str2);



  // String str1='''this is str1
  // this is str1
  // this is str1
  // ''';
  //  print(str1);

  

  //   String str1="""
  //   this is str1
  //   this is str1
  //   this is str1
  //   """;
  //  print(str1);
}
```

**字符串的拼接**

```dart
String str1='你好';
String str2='Dart';
// print("$str1 $str2");


print(str1 + str2);  
print(str1 +" "+ str2);
```

### 数值
```dart
void main(){

  //1、int   必须是整型
    int a=123;
    a=45;
    print(a);


  //2、double  既可以是整型 也可是浮点型
    double b=23.5;
    b=24;
    print(b);

  //3、运算符
    // + - * / %
    
    var c=a+b;
    print(c);


}
```

### 布尔
```dart
// bool flag1=true;
// print(flag1);

// bool flag2=false;
// print(flag2);
```

### 集合
```dart
void main() {
  //1、第一种定义List的方式

  // var l1=["张三",20,true];
  // print(l1);  //[张三, 20, true]
  // print(l1.length);  //3
  // print(l1[0]); //张三
  // print(l1[1]); //20

  //2、第二种定义List的方式 指定类型

  // var l2=<String>["张三","李四"];
  // print(l2);

  // var l3 = <int>[12, 30];
  // print(l3);

  //3、第三种定义List的方式  增加数据 ,通过[]创建的集合它的容量可以变化

  // var l4 = [];
  // print(l4);
  // print(l4.length);

  // l4.add("张三");
  // l4.add("李四");
  // l4.add(20);
  // print(l4);
  // print(l4.length);

  // var l5 = ["张三", 20, true];
  // l5.add("李四");
  // l5.add("zhaosi");
  // print(l5);


  //4、第四种定义List的方式

    //  var l6=new List();  //在新版本的dart里面没法使用这个方法了

    // var l6=List.filled(2, "");  //创建一个固定长度的集合
    // print(l6);
    // print(l6[0]);

    // l6[0]="张三";   //修改集合的内容
    // l6[1]="李四";
    // print(l6);  //[张三, 李四]
    // l6.add("王五");  //错误写法  通过List.filled创建的集合长度是固定  没法增加数据



    //通过List.filled创建的集合长度是固定
    // var l6=List.filled(2, "");
    // print(l6.length);
    // l6.length=0;  //修改集合的长度   报错



    // var l7=<String>["张三","李四"];
    // print(l7.length);  //2
    // l7.length=0;  //可以改变的
    // print(l7);  //[]




    var l8=List<String>.filled(2, "");
    l8[0]="string";
    // l8[0]=222;
    print(l8);

    
}
```

### Map
```dart
void main(){
  
  //第一种定义 Maps的方式

    // var person={
    //   "name":"张三",
    //   "age":20,
    //   "work":["程序员","送外卖"]
    // };

    // print(person);
    // print(person["name"]);
    // print(person["age"]);
    // print(person["work"]);

   //第二种定义 Maps的方式

    var p=new Map();
    p["name"]="李四";
    p["age"]=22;
    p["work"]=["程序员","送外卖"];
    print(p);
    print(p["age"]);   
}
```

### 类型判断
使用`is`关键字来判断类型

```dart
void main(){

  // var str='1234';
  // if(str is String){
  //   print('是string类型');
  // }else if(str is int){
  //    print('int');
  // }else{
  //    print('其他类型');
  // }

  var str=123;
  if(str is String){
    print('是string类型');
  }else if(str is int){
     print('int');
  }else{
     print('其他类型');
  }
}
```

## 运算符和类型转换
### 运算符
**算数运算符**

```dart
 +    -    *    /     ~/ (取整)     %（取余）
```



**算数运算符**

```dart
==    ！=   >    <    >=    <=
```



**逻辑运算符**

```dart
!  &&   ||
```



**赋值运算符**

```dart
基础赋值运算符   =   ??=
复合赋值运算符   +=  -=  *=   /=   %=  ~/=
```



### 条件表达式
```dart
void main(){
  
  //1、if  else   switch case 

    // bool flag=true;
    // if(flag){
    //   print('true');
    // }else{
    //   print('false');
    // }


  //判断一个人的成绩 如果大于60 显示及格   如果大于 70显示良好  如果大于90显示优秀

  // var score=41;
  // if(score>90){
  //   print('优秀');
  // }else if(score>70){
  //    print('良好');
  // }else if(score>=60){
  //   print('及格');
  // }else{
  //   print('不及格');
  // }


  // var sex="女";
  // switch(sex){
  //   case "男":
  //     print('性别是男');
  //     break;
  //   case "女":
  //     print('性别是女');
  //     print('性别是女');
  //     break;
  //   default:
  //     print('传入参数错误');
  //     break;
  // }


  //2、三目运算符 

  // var falg=true;
  // var c;
  // if(falg){
  //     c='我是true';
  // }else{
  //   c="我是false";
  // }
  // print(c);

  bool flag=false;
  String c=flag?'我是true':'我是false';
  print(c);

     
  //3  ??运算符

  // var a;
  // var b= a ?? 10;
  // print(b);   10


  var a=22;
  var b= a ?? 10;
  print(b);

}
```

### 类型转换
Number 与 String 类型直接转换

```dart
// Number类型转换成String类型 toString()
// String类型转成Number类型  int.parse()


// String str='123';
// var myNum=int.parse(str);
// print(myNum is int);


// String str='123.1';
// var myNum=double.parse(str);
// print(myNum is double);


//  String price='12';
// var myNum=double.parse(price);
// print(myNum);
// print(myNum is double);


//报错
// String price='';
// var myNum=double.parse(price);
// print(myNum);
// print(myNum is double);


// try  ... catch
//  String price='';
//   try{
//     var myNum=double.parse(price);
//     print(myNum);
//   }catch(err){
//        print(0);
//   } 


// var myNum=12;
// var str=myNum.toString();
// print(str is String);
```

## 循环语句
循环语句同 Java



## 集合类型
### List
List里面常用的属性和方法：

常用属性：

+ length：长度
+ reversed：翻转
+ isEmpty：是否为空
+ isNotEmpty：是否不为空

常用方法：  

+ add：增加
+ addAll：拼接数组
+ indexOf：查找  传入具体值
+ remove：删除  传入具体值
+ removeAt：删除  传入索引值
+ fillRange：修改   
+ insert(index,value);：指定位置插入    
+ insertAll(index,list)：指定位置插入List
+ toList()：其他类型转换成List  
+ join()：List转换成字符串
+ split()：字符串转化成List
+ forEach   
+ map
+ where
+ any
+ every

```dart
void main(){

  List myList=['香蕉','苹果','西瓜'];
  print(myList[1]);

  list.add('111');
  list.add('222');
  print(list);


//List里面的属性：
    List myList=['香蕉','苹果','西瓜'];
    print(myList.length);
    print(myList.isEmpty);
    print(myList.isNotEmpty);
    print(myList.reversed);  //对列表倒序排序
    var newMyList=myList.reversed.toList();
    print(newMyList);

//List里面的方法：


    List myList=['香蕉','苹果','西瓜'];
    myList.add('桃子');   //增加数据  增加一个
    myList.addAll(['桃子','葡萄']);  //拼接数组
    print(myList);
    print(myList.indexOf('苹x果'));    //indexOf查找数据 查找不到返回-1  查找到返回索引值


    myList.remove('西瓜');
    myList.removeAt(1);
    print(myList);
  

    List myList=['香蕉','苹果','西瓜'];
    myList.fillRange(1, 2,'aaa');  //修改
    myList.fillRange(1, 3,'aaa');  

    myList.insert(1,'aaa');      //插入  一个
    myList.insertAll(1, ['aaa','bbb']);  //插入 多个
    print(myList);


    List myList=['香蕉','苹果','西瓜'];
    var str=myList.join('-');   //list转换成字符串
    print(str);
    print(str is String);  //true


    var str='香蕉-苹果-西瓜';
    var list=str.split('-');
    print(list);
    print(list is List);

}
```

### Set
用它最主要的功能就是去除数组重复内容，Set 是没有顺序且不能重复的集合，所以不能通过索引去获取值

```dart
void main(){
  
  // var s=new Set();
  // s.add('香蕉');
  // s.add('苹果');
  // s.add('苹果');
  // print(s);   //{香蕉, 苹果}
  // print(s.toList()); 


  List myList=['香蕉','苹果','西瓜','香蕉','苹果','香蕉','苹果'];
  var s=new Set();
  s.addAll(myList);
  print(s);
  print(s.toList());
  
}
```

### Map
映射(Maps)是无序的键值对：

常用属性：

+ keys：获取所有的key值
+ values：获取所有的value值
+ isEmpty：是否为空
+ isNotEmpty：是否不为空

常用方法:

+ remove(key)：删除指定key的数据
+ addAll({...})：合并映射  给映射内增加属性
+ containsValue：查看映射内的值  返回true/false
+ forEach   
+ map
+ where
+ any
+ every

```dart
void main(){

 
  Map person={
    "name":"张三",
    "age":20
  };


  var m=new Map();
  m["name"]="李四";  
  print(person);
  print(m);

//常用属性：

    Map person={
      "name":"张三",
      "age":20,
      "sex":"男"
    };

    print(person.keys.toList());
    print(person.values.toList());
    print(person.isEmpty);
    print(person.isNotEmpty);


//常用方法：
    Map person={
      "name":"张三",
      "age":20,
      "sex":"男"
    };

    person.addAll({
      "work":['敲代码','送外卖'],
      "height":160
    });
    print(person);



    person.remove("sex");
    print(person);


    print(person.containsValue('张三'));
}
```

### 快捷方法
```dart
void main(){

      // 遍历列表中的元素
      List myList=['香蕉','苹果','西瓜'];
      // 原始方法
      for(var i=0;i<myList.length;i++){
        print(myList[i]);
      }
      // 快捷方法
      for(var item in myList){
        print(item);
      }

      myList.forEach((value){
          print("$value");
      });


      // 将列表中的每个元素 *2
      List myList=[1,3,4];
      // 原始方法
      List newList=new List();
      for(var i=0;i<myList.length;i++){
        newList.add(myList[i]*2);
      }
      print(newList);
      // 快捷方法
      List myList=[1,3,4];      
      var newList=myList.map((value){
          return value*2;
      });
      print(newList.toList());


      // 寻找集合中是否有满足条件的元素
      List myList=[1,3,4,5,7,8,9];
      // 原始方法
      var newList=myList.where((value){
          return value>5;
      });
      print(newList.toList());
      // 快捷方法
      List myList=[1,3,4,5,7,8,9];
      var f=myList.any((value){   //只要集合里面有满足条件的就返回true
          return value>5;
      });
      print(f);
      // 寻找集合中的元素是否都满足条件
      List myList=[1,3,4,5,7,8,9];
      var f=myList.every((value){   //每一个都满足条件返回true  否则返回false
          return value>5;
      });
      print(f);



      // set
      var s=new Set();

      s.addAll([1,222,333]);

      s.forEach((value)=>print(value));



      //map
       Map person={
          "name":"张三",
          "age":20
        };

        person.forEach((key,value){            
            print("$key---$value");
        });
}
```

## 函数
### **定义方法**
定义方法的基本格式：

```dart
返回类型  方法名称（参数1，参数2,...）{
  方法体
  return 返回值;
}
```

例如：

```dart
void printInfo(){
  print('我是一个自定义方法');
}

int getNum(){
  var myNum=123;
  return myNum;
}

String printUserInfo(){
  return 'this is str';
}


List getList(){
  return ['111','2222','333'];
}

void main(){

  print('调用系统内置的方法');

  printInfo();
  var n=getNum();
  print(n);


  print(printUserInfo());


  print(getList());
  print(getList());
  

//演示方法的作用域
void xxx(){
  aaa(){
        print(getList());
        print('aaa');
    }
    aaa();
  }

  // aaa();  错误写法 
  xxx();  //调用方法
}
```

### **传参**
```dart
//调用方法传参

main() {
//1、定义一个方法 求1到这个数的所有数的和 60    1+2+3+。。。+60
int sumNum(int n){
  var sum=0;
  for(var i=1;i<=n;i++)
  {
    sum+=i;
  }
  return sum;
} 

var n1=sumNum(5);
print(n1);
var n2=sumNum(100);
print(n2);


//2、定义一个方法然后打印用户信息

String printUserInfo(String username, int age) {
  //行参
  return "姓名:$username---年龄:$age";
}
print(printUserInfo('张三', 20)); //实参


//3、定义一个带可选参数的方法 ，最新的dart定义可选参数需要指定类型默认值

String printUserInfo(String username,[int age=0]){  //行参
  if(age!=0){
    return "姓名:$username---年龄:$age";
  }
  return "姓名:$username---年龄保密";
}
print(printUserInfo('张三',21)); //实参
print(printUserInfo('张三'));

//4、定义一个带默认参数的方法
  String printUserInfo(String username,[String sex='男',int age=0]){  //行参
    if(age!=0){
      return "姓名:$username---性别:$sex--年龄:$age";
    }
    return "姓名:$username---性别:$sex--年龄保密";
  }
  print(printUserInfo('张三'));
  print(printUserInfo('小李','女'));
  print(printUserInfo('小李','女',30));

//5、定义一个命名参数的方法，最新的dart定义命名参数需要指定类型默认值

  String printUserInfo(String username, {int age = 0, String sex = '男'}) {//行参    
    if (age != 0) {
      return "姓名:$username---性别:$sex--年龄:$age";
    }
    return "姓名:$username---性别:$sex--年龄保密";
  }
  print(printUserInfo('张三', age: 20, sex: '未知'));


//6、实现一个 把方法当做参数的方法

  var fn=(){
    print('我是一个匿名方法');
  };
  fn();


  //fn1方法
  fn1() {
    print('fn1');
  }
  //fn2方法
  fn2(fn) {
    fn();
  }
  //调用fn2这个方法 把fn1这个方法当做参数传入
  fn2(fn1);
}

```

### 箭头函数
```dart
void main() {
/*需求：使用forEach打印下面List里面的数据*/

List list=['苹果','香蕉','西瓜'];
list.forEach((value){
  print(value);
});
list.forEach((value)=>print(value));

注意和方法的区别: 箭头函数内只能写一条语句，并且语句后面没有分号(;)
list.forEach((value)=>{
  print(value)
});

/*需求：修改下面List里面的数据，让数组中大于2的值乘以2*/

  // List list=[4,1,2,3,4];
  // var newList=list.map((value){
  //     if(value>2){
  //       return value*2;
  //     }
  //     return value;
  // });
  // print(newList.toList());
  //  var newList=list.map((value)=>value>2?value*2:value);
  //  print(newList.toList());
  

/*
需求：    1、定义一个方法isEvenNumber来判断一个数是否是偶数  
         2、定义一个方法打印1-n以内的所有偶数
*/

// 1、定义一个方法isEvenNumber来判断一个数是否是偶数  
  bool isEvenNumber(int n) {
    if (n % 2 == 0) {
      return true;
    }
    return false;
  }
//  2、定义一个方法打印1-n以内的所有偶数
  printNum(int n) {
    for (var i = 1; i <= n; i++) {
      if (isEvenNumber(i)) {
        print(i);
      }
    }
  }
  printNum(10);
}
```

### 匿名方法
```dart
//匿名方法
var printNum=(){
  print(123);
};
printNum();

var printNum=(int n){
  print(n+2);
};
printNum(12);
```

### 自执行方法
```dart
((int n){
  print(n);
  print('我是自执行方法');
})(12);
```

### 闭包
1、全局变量特点:    全局变量常驻内存、全局变量污染全局

2、局部变量的特点：  不常驻内存会被垃圾机制回收、不会污染全局  

想实现的功能：

1.常驻内存        

2.不污染全局   

产生了闭包,闭包可以解决这个问题.....  

闭包: 函数嵌套函数, 内部函数会调用外部函数的变量或参数, 变量或参数不会被系统回收(不会释放内存)

闭包的写法： 函数嵌套函数，并return 里面的函数，这样就形成了闭包

```dart
/*全局变量*/
var a = 123;

void main() {
  print(a);

  fn(){
    a++;
    print(a);
  }
  fn();
  fn();
  fn();

//局部变量
  printInfo() {
    var myNum = 123;
    myNum++;
    print(myNum);
  }

  printInfo();
  printInfo();
  printInfo();

//闭包

  fn() {
    var a = 123; /*不会污染全局   常驻内存*/
    return () {
      a++;
      print(a);
    };
  }

  var b = fn();
  b();
  b();
  b();
}
```

## 面向对象
面向对象编程的三大特征：封装、继承、多态

Dart 中所有的东西都是对象，都继承自 Object 类

Dart 是一门使用类和单继承的面向对象语言，所有的对象都是类的实例，一个类是由属性和方法组成的

### 封装
```dart
class Person{
  String name="张三";
  int age=23;
  void getInfo(){
      // print("$name----$age");
      print("${this.name}----${this.age}");
  }
  void setInfo(int age){
    this.age=age;
  }

}
void main(){

  //实例化

  // var p1=new Person();
  // print(p1.name);
  // p1.getInfo();

  Person p1=new Person();
  // print(p1.name);
  p1.setInfo(28);
  p1.getInfo();
  
}
```

#### 构造函数
**默认构造函数**

```dart

class Person{
  String name='张三';
  int age=20; 
  //默认构造函数
  Person(){
    print('这是构造函数里面的内容  这个方法在实例化的时候触发');
  }
  void printInfo(){   
    print("${this.name}----${this.age}");
  }
}




//最新版本的dart中需要初始化不可为null的实例字段，如果不初始化的话需要在属性前面加上late
class Person{
  late String name;
  late int age; 
  //默认构造函数
  Person(String name,int age){
      this.name=name;
      this.age=age;
  }
  void printInfo(){   
    print("${this.name}----${this.age}");
  }
}

//最新版本的dart中需要初始化不可为null的实例字段，如果不初始化的话需要在属性前面加上late
class Person{
  late String name;
  late int age; 
  //默认构造函数的简写
  Person(this.name,this.age);
  void printInfo(){   
    print("${this.name}----${this.age}");
  }
}


void main(){
  
  Person p1=new Person('张三',20);
  p1.printInfo();


  Person p2=new Person('李四',25);
  p2.printInfo();

}
```

**自定义构造函数**

Dart 里面构造函数可以写多个

```dart
class Person {
  late String name;
  late int age;
  //默认构造函数的简写
  Person(this.name, this.age);
  // now 构造函数
  Person.now() {
    print('我是命名构造函数');
  }
  // setInfo 构造函数
  Person.setInfo(String name, int age) {
    this.name = name;
    this.age = age;
  }
  void printInfo() {
    print("${this.name}----${this.age}");
  }
}

void main() {
  var d=new DateTime.now();   //实例化DateTime调用它的命名构造函数
  print(d);

  Person p1=new Person('张三', 20);   //默认实例化类的时候调用的是 默认构造函数

  Person p1=new Person.now();   //命名构造函数

  Person p1 = new Person.setInfo('李四', 30);
  p1.printInfo();
}
```



**使用其他包的类**

![](https://cdn.nlark.com/yuque/0/2024/png/39124847/1729391511022-6afbc540-736b-44f3-9c85-7262f58418ba.png)

demo1.dart 代码如下：

```dart
import 'lib/Person.dart';

void main(List<String> args) {
  Person p1 = new Person.setInfo('kbws', 22);
  p1.printInfo();
}
```



**私有属性和私有方法**

Dart 中没有访问权限修饰符，想要将一个属性或者方法设置为私有的，需要在前面加一个`_`

```dart
class Animal{
  late String _name;   //私有属性
  late int age; 
  
  //默认构造函数的简写
  Animal(this._name,this.age);

  void printInfo(){   
    print("${this._name}----${this.age}");
  }

  String getName(){ 
    return this._name;
  } 
  
  void _run(){
    print('这是一个私有方法');
  }

  execRun(){
    this._run();  //类里面方法的相互调用
  }
}
```

```dart
import 'lib/Animal.dart';

void main(){
 
 Animal a=new Animal('小狗', 3);

 print(a.getName());

 a.execRun();   //间接的调用私有方法
}
```

#### Getter和Setter
使用`get`关键字定义`getter`或者访问器，`setter`或存取器是使用`set`关键字定义的

默认的`getter/setter`与每个类相关联。

但是，可以通过显式定义`setter/getter`来覆盖默认值。`getter`没有参数并返回一个值，`setter`只有一个参数但不返回值

```dart
class Rect {
  int height;
  int width; 
  Rect(this.height,this.width);
  get getArea {
    return this.height*this.width;
  } 
  set setHeight(value) {
    this.height = value;
  }
}

void main() {
  Rect r = new Rect(10, 4);
  //调用set方法
  r.setHeight = 6;
  //直接通过访问属性的方式访问area
  print("面积:${r.getArea}");

  print(r.getArea);
}
```



**提前初始化实例变量**

Dart 中可以在构造函数运行之前初始化实例变量

```dart
class Rect{
  int height;
  int width;
  Rect():height=2,width=10{    
    print("${this.height}---${this.width}");
  }
  getArea(){
    return this.height*this.width;
  } 
}

void main(){
  Rect r=new Rect();
  print(r.getArea()); 
   
}
```

#### 静态成员
+ 使用`static`关键字来定义类级别的变量和函数
+ 静态方法不能访问非静态成员，非静态成员可以访问静态成员

```dart
class Person {
  static String name = '张三';
  int age=20;  
  static void show() {
    print(name);
  }
  void printInfo(){  /*非静态方法可以访问静态成员以及非静态成员*/
      // print(name);  //访问静态属性
      // print(this.age);  //访问非静态属性
      show();   //调用静态方法
  }
  static void printUserInfo(){//静态方法
        print(name);   //静态属性
        show();        //静态方法
        //print(this.age);     //静态方法没法访问非静态的属性
        // this.printInfo();   //静态方法没法访问非静态的方法
        // printInfo();
  }

}

main(){
  // print(Person.name);
  // Person.show(); 

  // Person p=new Person();
  // p.printInfo(); 

  Person.printUserInfo();
}
```

#### 对象操作符
+ `as`：类型转换
+ `is`：类型判断
+ `..`：级联操作

```dart
class Person {
  String name;
  num age;
  Person(this.name, this.age);
  void printInfo() {
    print("${this.name}---${this.age}");
  }
}

main() {
  Person p=new Person('张三', 20);
  if(p is Person){
      p.name="李四";
  }
  p.printInfo();
  print(p is Object);

  var p1;
  p1='';
  p1=new Person('张三1', 20);
  p1.printInfo();
  (p1 as Person).printInfo();

  Person p1 = new Person('张三1', 20);
  p1.printInfo();
  p1
    ..name = "李四"
    ..age = 30
    ..printInfo();
}
```

### 继承
1. 子类使用 extends 关键字来继承父类
2. 子类会继承父类里面可见的属性和方法，但是不会继承构造函数
3. 子类能复写父类的方法 getter 和 setter

```dart
class Person {
  String name='张三';
  num age=20; 
  void printInfo() {
    print("${this.name}---${this.age}");  
  } 
}
class Web extends Person{
}

main(){   
  Web w=new Web();
  print(w.name);
  w.printInfo(); 
}
```

#### super关键字
```dart
class Person {
  late String name;
  late num age; 
  Person(this.name,this.age);
  void printInfo() {
    print("${this.name}---${this.age}");  
  }
}
class Web extends Person{
  Web(String name, num age) : super(name, age){    
  }  
}

main(){ 

  Web w=new Web('张三', 12);
  w.printInfo();
}
```



**给默认构造函数传参**

```dart
class Person {
  String name;
  num age; 
  Person(this.name,this.age);
  void printInfo() {
    print("${this.name}---${this.age}");  
  }
}

class Web extends Person{
  late String sex;
  Web(String name, num age,String sex) : super(name, age){
    this.sex=sex;
  }
  run(){
   print("${this.name}---${this.age}--${this.sex}");  
  }  
}

main(){ 
  Web w=new Web('张三', 12,"男");
  w.printInfo();
  w.run();
}
```



**给自定义构造函数传参**

```dart
class Person {
  String name;
  num age;
  Person(this.name, this.age);
  Person.xxx(this.name, this.age);
  void printInfo() {
    print("${this.name}---${this.age}");
  }
}

class Web extends Person {
  late String sex;
  Web(String name, num age, String sex) : super.xxx(name, age) {
    this.sex = sex;
  }
  run() {
    print("${this.name}---${this.age}--${this.sex}");
  }
}

main() {
  Web w = new Web('张三', 12, "男");
  w.printInfo();
  w.run();
}
```



#### 重写父类方法
```dart
class Person {
  String name;
  num age; 
  Person(this.name,this.age);
  void printInfo() {
    print("${this.name}---${this.age}");  
  }
  work(){
    print("${this.name}在工作...");
  }
}

class Web extends Person{
  Web(String name, num age) : super(name, age);
  run(){
    print('run');
  }
  //覆写父类的方法
  @override       //可以写也可以不写  建议在覆写父类方法的时候加上 @override 
  void printInfo(){
     print("姓名：${this.name}---年龄：${this.age}"); 
  }
  @override
  work(){
    print("${this.name}的工作是写代码");
  }
}

main(){
  Web w=new Web('李四',20);
  w.printInfo();
  w.work(); 
}
```



#### 子类调用父类方法
```dart
class Person {
  String name;
  num age; 
  Person(this.name,this.age);
  void printInfo() {
    print("${this.name}---${this.age}");  
  }
  work(){
    print("${this.name}在工作...");
  }
}

class Web extends Person{
  Web(String name, num age) : super(name, age);
  run(){
    print('run');
    super.work();  //子类调用父类的方法
  }
  //覆写父类的方法
  @override       //可以写也可以不写  建议在覆写父类方法的时候加上 @override 
  void printInfo(){
     print("姓名：${this.name}---年龄：${this.age}"); 
  }
}


main(){
  Web w=new Web('李四',20);
  w.printInfo();
  w.run(); 
}
```



#### 抽象类
Dart 中的抽象类主要用于定义标准，子类可以继承抽象类，也可以实现抽象接口

1. 抽象类使用`abstract`关键字来定义
2. Dart 中的抽象方法不能使用 abstract 来定义，Dart 中没有方法体的方法称为抽象方法
3. 如果子类继承抽象类必须得实现里面的抽象方法
4. 如果把抽象类当做接口实现的话，必须得实现抽象类里面的所有属性和方法
5. 抽象类不能被实例化，只有继承他的子类才行



extends 抽象类和 implements 抽象类的区别：

1. 如果要复用抽象类里面的方法，并且要用抽象类约束子类的话，使用 extend 继承抽象类
2. 如果只是把抽象类当做标准的话，使用 implements 实现抽象类

```dart
abstract class Animal{
  eat();   //抽象方法
  run();  //抽象方法  
  printInfo(){
    print('我是一个抽象类里面的普通方法');
  }
}

class Dog extends Animal{
  @override
  eat() {
     print('小狗在吃骨头');
  }

  @override
  run() {
    // TODO: implement run
    print('小狗在跑');
  }  
}
class Cat extends Animal{
  @override
  eat() {
    // TODO: implement eat
    print('小猫在吃老鼠');
  }

  @override
  run() {
    // TODO: implement run
    print('小猫在跑');
  }
}

main(){

  Dog d=new Dog();
  d.eat();
  d.printInfo();

  Cat c=new Cat();
  c.eat();
  c.printInfo();

  // Animal a=new Animal();   //抽象类没法直接被实例化

}
```

### 多态
允许将子类类型的指针赋值给父类类型的指针，同一个函数的调用会有不同的执行效果

子类的实例赋值给父类的引用

多态就是父类定义一个方法不去实现，让继承他的子类去实现，每个子类有不同的表现

```dart
abstract class Animal{
  eat();   //抽象方法 
}

class Dog extends Animal{
  @override
  eat() {
     print('小狗在吃骨头');
  }
  run(){
    print('run');
  }
}
class Cat extends Animal{
  @override
  eat() {   
    print('小猫在吃老鼠');
  }
  run(){
    print('run');
  }
}

main(){

  // Dog d=new Dog();
  // d.eat();
  // d.run();


  // Cat c=new Cat();
  // c.eat();

  Animal d=new Dog();
  d.eat();

 

  Animal c=new Cat();
  c.eat();

}
```



#### 接口
首先，Dart 的接口没有 interface 关键字定义接口，而普通类或抽象类都可以作为接口实现，同样使用 implements 关键字实现

但是dart的接口有点奇怪，如果实现的类是普通类，会将普通类和抽象中的属性的方法全部需要覆写一遍

而因为抽象类可以定义抽象方法，普通类不可以，所以一般如果要实现像Java接口那样的方式，一般会使用抽象类，建议使用抽象类定义接口

```dart
abstract class Db{   //当做接口   接口：就是约定 、规范
    late String uri;      //数据库的链接地址
    add(String data);
    save();
    delete();
}

class Mysql implements Db{
  
  @override
  String uri;

  Mysql(this.uri);

  @override
  add(data) {
    // TODO: implement add
    print('这是mysql的add方法'+data);
  }

  @override
  delete() {
    // TODO: implement delete
    return null;
  }

  @override
  save() {
    // TODO: implement save
    return null;
  }
  remove(){
      
  }
}

class MsSql implements Db{
  @override
  late String uri;
  @override
  add(String data) {
    print('这是mssql的add方法'+data);
  }

  @override
  delete() {
    // TODO: implement delete
    return null;
  }

  @override
  save() {
    // TODO: implement save
    return null;
  }
}

main() {

  Mysql mysql=new Mysql('xxxxxx');

  mysql.add('1243214');
  
}
```

### 实现多个接口
```dart
abstract class A{
  late String name;
  printA();
}

abstract class B{
  printB();
}

class C implements A,B{  
  @override
  late String name;  
  @override
  printA() {
    print('printA');
  }
  @override
  printB() {
    // TODO: implement printB
    return null;
  }
}

void main(){
  C c=new C();
  c.printA();
}
```



### 混入
mixins 的中文意思的混入，就是在类中混入其他功能

在 Dart 可以使用 mixins 实现类似多继承的效果

这里是Dart2.x中使用mixins的条件：

1. 作为mixins的类只能继承自Object，不能继承其他类
2. 作为mixins的类不能有构造函数
3. 一个类可以mixins多个mixins类
4. mixins绝不是继承，也不是接口，而是一种全新的特性

```dart
class A {
  String info="this is A";
  void printA(){
    print("A");
  }
}

class B {
  void printB(){
    print("B");
  }
}

class C with A,B{
  
}

void main(){
  
  var c=new C();  
  c.printA();
  c.printB();
  print(c.info);


}
```





**mixins的实例类型**

```dart
class A {
  String info="this is A";
  void printA(){
    print("A");
  }
}

class B {
  void printB(){
    print("B");
  }
}

class C with A,B{
  
}

void main(){  
  var c=new C();  
   
  print(c is C);    //true
  print(c is A);    //true
  print(c is B);   //true
}
```



## 泛型
泛型就是解决类、接口、方法的复用性，以及对不特定数据类型的支持（类型校验）

### 泛型方法
```dart
//只能返回string类型的数据

  // String getData(String value){
  //     return value;
  // }
  

//同时支持返回 string类型 和int类型  （代码冗余）


  // String getData1(String value){
  //     return value;
  // }

  // int getData2(int value){
  //     return value;
  // }



//同时返回 string类型 和number类型       不指定类型可以解决这个问题


  // getData(value){
  //     return value;
  // }





// 不指定类型放弃了类型检查。我们现在想实现的是传入什么 返回什么。
// 比如:传入number 类型必须返回number类型  传入 string类型必须返回string类型
 
  // T getData<T>(T value){
  //     return value;
  // }

  getData<T>(T value){
      return value;
  }

void main(){

    // print(getData(21));

    // print(getData('xxx'));

    // getData<String>('你好');

    print(getData<int>(12));

}
```



### 泛型类
MyList 里面可以增加 int 类型的数据，也可以增加 String 类型的数据

```dart
class MyList<T> {
  List list = <T>[];
  void add(T value) {
    this.list.add(value);
  }

  List getList() {
    return list;
  }
}

// MyList l2 = new MyList<String>();
  // l2.add("张三1");
  // // l2.add(11);  //错误的写法
  // print(l2.getList());

  // MyList l3 = new MyList<int>();
  // l3.add(11);
  // l3.add(12);
  // l3.add("aaaa");
  // print(l3.getList());

  // List list = List.filled(2, "");
  // list[0] = "张三";
  // list[1] = "李四";
  // print(list);
```

### 泛型接口
实现数据缓存的功能：有文件缓存、和内存缓存。内存缓存和文件缓存按照接口约束实现。

1. 定义一个泛型接口 约束实现它的子类必须有`getByKey(key)`和`setByKey(key,value)`
2. 要求 setByKey 的时候的 value 的类型和实例化子类的时候指定的类型一致



```dart
abstract class Cache<T> {
  getByKey(String key);
  void setByKey(String key, T value);
}

class FileCache<T> implements Cache<T> {
  @override
  getByKey(String key) {
    return null;
  }
  @override
  void setByKey(String key, T value) {
    print("我是文件缓存 把key=${key}  value=${value}的数据写入到了文件中");
  }
}

class MemoryCache<T> implements Cache<T> {
  @override
  getByKey(String key) {
    return null;
  }
  @override
  void setByKey(String key, T value) {
    print("我是内存缓存 把key=${key}  value=${value} -写入到了内存中");
  }
}

void main() {
  // MemoryCache m=new MemoryCache<String>();
  //  m.setByKey('index', '首页数据');

  MemoryCache m = new MemoryCache<Map>();
  m.setByKey('index', {"name": "张三", "age": 20});
}
```



## 库
在Dart中，库的使用时通过import关键字引入的

library 指令可以创建一个库，每个 Dart 文件都是一个库，即使没有使用 library 指令来指定

Dart中的库主要有三种：

1. 我们自定义的库：`import 'lib/xxx.dart';`
2. 系统内置库       

          import 'dart:math';    
    
          import 'dart:io'; 
    
          import 'dart:convert';

3. Pub包管理系统中的库  

        [https://pub.dev/packages](https://pub.dev/packages)
        
        [https://pub.flutter-io.cn/packages](https://pub.flutter-io.cn/packages)
        
        [https://pub.dartlang.org/flutter/](https://pub.dartlang.org/flutter/)



        1、需要在自己想项目根目录新建一个pubspec.yaml
    
        2、在pubspec.yaml文件 然后配置名称 、描述、依赖等信息
    
        3、然后运行 pub get 获取包下载到本地  
    
        4、项目中引入库 import 'package:http/http.dart' as http; 

## Async
+ 只有 async 方法才能使用 await 关键字调用方法
+ 如果调用别的 async 方法必须使用 await 关键字

async是让方法变成异步

await是等待异步方法执行完成

```dart
void main() async{
  var result = await testAsync();
  print(result);

}

//异步方法
testAsync() async{
  return 'Hello async';
}
```



## Pub包管理系统
1、从下面网址找到要用的库

        [https://pub.dev/packages](https://pub.dev/packages)
    
        [https://pub.flutter-io.cn/packages](https://pub.flutter-io.cn/packages)
    
        [https://pub.dartlang.org/flutter/](https://pub.dartlang.org/flutter/)

2、创建一个pubspec.yaml文件，内容如下

```yaml
name: xxx
    description: A new flutter module project.
    dependencies:  
        http: ^0.12.0+2
        date_format: ^1.0.6
```

3、配置dependencies

4、运行pub get 获取远程库

5、看文档引入库使用

```dart
import 'dart:convert' as convert;
import 'package:http/http.dart' as http;
import 'package:date_format/date_format.dart';

main() async {
  // var url = "http://www.phonegap100.com/appapi.php?a=getPortalList&catid=20&page=1";

  //   // Await the http get response, then decode the json-formatted responce.
  //   var response = await http.get(url);
  //   if (response.statusCode == 200) {
  //     var jsonResponse = convert.jsonDecode(response.body);
     
  //     print(jsonResponse);
  //   } else {
  //     print("Request failed with status: ${response.statusCode}.");
  //   }


  
    print(formatDate(DateTime(1989, 2, 21), [yyyy, '*', mm, '*', dd]));

}
```



**解决冲突**

当引入两个库中有相同名称标识符的时候，如果是 Java 通常通过写上完整的包名路径来指定使用的具体标识符，甚至不用 import 都可以，但是 Dart 里面是必须 import 的。当冲突的时候，可以使用 as 关键字来指定库的前缀。如下例子所示：

```dart
import 'lib/Person1.dart';
import 'lib/Person2.dart' as lib;

main(List<String> args) {
  Person p1=new Person('张三', 20);
  p1.printInfo();


  lib.Person p2=new lib.Person('李四', 20);
  p2.printInfo();

}
```



**部分导入**

如果只需要导入库的一部分，有两种模式：

模式一：只导入需要的部分，使用 show 关键字，如下例子所示：

```dart
import 'package:lib1/lib1.dart' show foo;
```

模式二：隐藏不需要的部分，使用hide关键字，如下例子所示：

```dart
import 'package:lib2/lib2.dart' hide foo; 
```



```dart
// import 'lib/myMath.dart' show getAge;

import 'lib/myMath.dart' hide getName;

void main(){
//  getName();
  getAge();
}
```



**延迟加载**

延迟加载也称为懒加载，可以在需要的时候再进行加载

懒加载的最大好处是可以减少APP的启动时间。

懒加载使用deferred as关键字来指定，如下例子所示：

```dart
import 'package:deferred/hello.dart' deferred as hello;
```

当需要使用的时候，需要使用`loadLibrary()`方法来加载：

```dart
greet() async {
  await hello.loadLibrary();
  hello.printGreeting();
}
```



## 新特性
### Null Safety
Null Safety 的意思是空安全，可以帮助开发者避免一些日常开发中很难发现的错误，还可以改善性能

+ `?`：可空类型
+ `!`：类型断言

```dart
String? getData(apiUrl){
  if(apiUrl!=null){
    return "this is server data";
  }
  return null;
}

void printLength(String? str){
  // print(str!.length);
  if (str!=null){
    print(str.length);
  }
}

void printLength(String? str){
  try {
    print(str!.length); 
  } catch (e) {
     print("str is null"); 
  }
}
```



### late关键字
late 关键字用于延迟初始化

```dart
class Person {
  late String name;
  late int age;
  void setName(String name, int age) {
    this.name = name;
    this.age = age;
  }
  String getName() {
    return "${this.name}---${this.age}";
  }
}

void main(args) {
  Person p = new Person();
  p.setName("张三", 20);
  print(p.getName());
}
```



### require
主要用于允许根据需要标记任何命名参数（函数或类），使得它们不为空。因为可选参数中必须有个 required 参数或者该参数有个默认值

```dart
String printUserInfo(String username, {int age=10, String sex="男"}) {//行参    
  return "姓名:$username---性别:$sex--年龄:$age";
}

String printInfo(String username, {required int age, required String sex}) {//行参    
  return "姓名:$username---性别:$sex--年龄:$age";
}


void main(args) {
    print(printUserInfo('张三'));

    print(printUserInfo('张三',age: 20,sex: "女"));
    
    //age 和 sex必须传入
    print(printInfo('张三',age: 22,sex: "女"));
}
```



```dart
//表示 name 和age 是必须传入的命名参数
class Person {
  String name;
  int age;
  Person({required this.name,required this.age});  //表示 name 和age 必须传入

  String getName() {
    return "${this.name}---${this.age}";
  }
}


void main(args) {
   Person p=new Person(
     name: "张三",
     age: 20
   );
   print(p.getName());
}
```



```dart
// name 可以传入也可以不传入   age必须传入
class Person {
  String? name;   //可空属性
  int age;
  Person({this.name,required this.age});  //表示 name 和age 必须传入

  String getName() {
    return "${this.name}---${this.age}";
  }
}


void main(args) {
   Person p=new Person(
     name: "张三",
     age: 20
   );
   print(p.getName());  //张三---20


  Person p1=new Person(    
     age: 20
   );
   print(p1.getName());  //null---20
}
```



### identical
用法：

```dart
bool identical(
   Object? a,    
   Object? b   
)
```

检查两个引用是否指向同一个对象



```dart
var o = new Object();

var isIdentical = identical(o, new Object()); // false, different objects.
print(isIdentical);

isIdentical = identical(o, o); // true, same object
print(isIdentical);

isIdentical = identical(const Object(), const Object()); // true, const canonicalizes
print(isIdentical);

isIdentical = identical([1], [1]); // false
print(isIdentical);

isIdentical = identical(const [1], const [1]); // true
print(isIdentical);

isIdentical = identical(const [1], const [2]); // false
print(isIdentical);

isIdentical = identical(2, 1 + 1); // true, integers canonicalizes
print(isIdentical);
```



### 常量构造函数
常量构造函数总结如下几点：

1. 常量构造函数需以 const 关键字修饰
2. const 构造函数必须用于成员变量都是 final 的类
3. 如果实例化时不加const修饰符，即使调用的是常量构造函数，实例化的对象也不是常量实例
4. 实例化常量构造函数的时候，多个地方创建这个对象，如果传入的值相同，只会保留一个对象。
5. Flutter 中 const 修饰不仅仅是节省组件构建时的内存开销，Flutter 在需要重新构建组件的时候，由于这个组件是不应该改变的，重新构建没有任何意义，因此 Flutter 不会重建构建 const 组件  

```dart
//常量构造函数
class Container{
  final int width;
  final int height;
  const Container({required this.width,required this.height});
}

void main(){

  var c1=Container(width: 100,height: 100);
  var c2=Container(width: 100,height: 100);
  print(identical(c1, c2)); //false

  
  var c3=const Container(width: 100,height: 100);
  var c4=const Container(width: 100,height: 100);
  print(identical(c3, c4)); //true


  var c5=const Container(width: 100,height: 110);
  var c6=const Container(width: 120,height: 100);
  print(identical(c5, c6)); //false
  
}
// 实例化常量构造函数的时候，多个地方创建这个对象，如果传入的值相同，只会保留一个对象。
```

