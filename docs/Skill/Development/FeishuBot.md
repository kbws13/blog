---
id: feishu-bot
slug: /feishu-bot
title: 飞书机器人推送线上Bug
keywords:
  - feishu-bot
  - project
  - Java
---

## 创建一个告警群聊

![20241008185857](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20241008185857.png)

## 创建自定义机器人

1. 在群聊中依次选择：设置 -> 群机器人 -> 添加机器人![20241008185908](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20241008185908.png)
2. 在机器人详情页面获取`webhook`地址。确保地址不会泄露![20241008185915](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20241008185915.png)

## 编写代码

1. 创建一个`SpringBoot`项目，创建一个`BotUtil`工具类

![20241008185924](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20241008185924.png)

代码如下

```java
public class BotUtil {

    public static String sendLarkNotification(String webhookUrl, String user, String title, String messageBody) throws Exception {
        URL url = new URL(webhookUrl);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setDoOutput(true);
        connection.setRequestMethod("POST");
        connection.setRequestProperty("Content-Type", "application/json; charset=UTF-8");

        ObjectMapper mapper = new ObjectMapper();
        ObjectNode root = mapper.createObjectNode();
        ObjectNode content = root.putObject("content").putObject("post").putObject("zh_cn");
        content.put("title", title);

        ArrayNode contentArray = content.putArray("content");
        ArrayNode atUserArray = contentArray.addArray();
        atUserArray.addObject().put("tag", "at").put("user_id", user);

        ArrayNode messageArray = contentArray.addArray();
        messageArray.addObject().put("tag", "text").put("text", messageBody);

        root.put("msg_type", "post");

        byte[] input = mapper.writeValueAsBytes(root);

        try (OutputStream os = connection.getOutputStream()) {
            os.write(input, 0, input.length);
        }

        try (BufferedReader br = new BufferedReader(new InputStreamReader(connection.getInputStream(), StandardCharsets.UTF_8))) {
            StringBuilder response = new StringBuilder();
            String line;
            while ((line = br.readLine()) != null) {
                response.append(line);
            }
            return response.toString();
        }
    }

}
```

主要逻辑是通过 HTTP 请求向 webhook 地址发送带有告警信息的POST请求。为了实现这个请求，我们需要在全局异常处理中调用上述方法。为了便于展示，我直接在全局异常处理类中编写了这个方法,可以考虑创建一个专门的工具类来实现这一功能

2. 创建全局异常拦截器

![20241008190045](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20241008190045.png)

代码如下：

```java
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    @Value("${notifications.larkBotEnabled}")
    private boolean larkBotEnabled;

    @ExceptionHandler(value = RuntimeException.class)
    public String handleException(RuntimeException e) {
        if (!larkBotEnabled) return "发生错误";
        // Send notification to Lark
        String title = "线上BUG通报";
        String user = "all";
        String webhookUrl = "https://open.feishu.cn/open-apis/bot/v2/hook/aad4b9ff-dd46-463b-85a9-xxxxxxx";

        try {
            return BotUtil.sendLarkNotification(webhookUrl, user, title, e.getMessage());
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }
}
```

3. 编写配置文件

`application.yml`

```yaml
spring:
  profiles:
    active: dev  #决定是否使用本地配置
  application:
    name: app-name
    
notifications:
  larkBotEnabled: true  #自定义字段控制报警行为

```

`application-dev.yml`

```yaml
notifications:
  larkBotEnabled: false
```

4. 编写测试接口

![20241008190103](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20241008190103.png)

`TestController`

```java
@RestController
public class TestController {

    @GetMapping("/test")
    public String test() {
        throw new RuntimeException("运行时异常");
        //return "test success!";
    }
}
```

## 运行测试

运行项目，访问测试接口，测试接口中手动抛出了运行时异常

![20241008190120](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20241008190120.png)

飞书群聊中机器人自动发送报警信息

![20241008190126](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20241008190126.png)



