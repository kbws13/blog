---
id: spring-stateMachine
slug: /spring-stateMachine
title: Spring StateMachine
date: 2024-10-03
tags: [State, Transition, Action, Guard, Region, StateMachine, 状态机]
keywords: [State, Transition, Action, Guard, Region, StateMachine, 状态机]
---

Spring 状态机是 Spring Framework 提供的一个模块，用于支持有限状态机（Finite State Machine，FSM）的实现，有限状态机是一个数学模型，描述了一个系统在不同状态之间的转换，以及触发这些转换之间的条件

Spring 状态机主要用于处理对象的状态变化和状态之间的转换。它提供了一种以声明性的方式定义状态和状态之间转换的机制，并能够处理各种事件触发的状态迁移，在一些场景中非常有用，比如：工作流、订单处理、游戏引擎等领域

## 基本概念

| **概念** | **定义** | **解释** | **示例** |
| --- | --- | --- | --- |
| State（状态） | 代表状态机中的一个具体状态。在状态机中，状态是系统在某一时刻的条件或情景 | 1. 每个状态可以定义进入（entry）和退出（exit）时的行为<br/>2. 一个状态可以是终态（end state），当状态机到达这个状态的时候，状态机的声明周期就结束了 | 在订单处理中`unpaid`和`waiting_for_receive` |
| Transition（状态转换） | 表示状态机从一个状态到另一个状态的转换条件。通常伴随着一个事件（event）的发生 | 1. 一个 Transition 通常会绑定一个事件（event）<br/>2. Transition 还可以有条件（Guard）和动作（Action）绑定 | 订单处理中`unpaid`到`waiting_for_receive`有 PAY 事件触发 |
| Action（动作） | 在状态转换过程中执行的操作，它可以在状态转换时触发，或者在进入/退出状态时触发 | 1. Action 可以在状态转换之前（before transition）或之后（after transition）执行<br/>2. Action 是业务逻辑的具体表现，比如记录日志、更新数据库、发送通知等 | 订单状态从`unpaid`变为`waiting_for_receive`时，Action 可以发生短信通知用户 |
| Guard（守卫条件） | 一个布尔表达式，用于判断状态转换是否允许执行。它决定了在事件触发时，是否允许从一个状态转换到另一个状态 | 1. Guard 返回 true，则状态转换可以执行<br/>2. Guard 返回 false。则状态转换不可执行 | 一个 Guard 可以检查订单是否已经完成支付，只有当订单支付完成时，才允许从`unpaid`转换到`waiting_for_receive` |
| Region（区域） | 状态机中的一个子状态机，可以看作是状态机中的一个独立区域，允许并行状态和多个子状态存在 | 1. Region 允许状态机在不同区域中同时处于不同状态<br/>2. 支持复杂的状态模型，比如并行状态或层次化状态 | 如果一个订单在处理过程中可以同时进入“支付”流程和“物流”流程，这两个流程可以定义为并行的`Region` |
| StateMachine（状态机） | StateMachine 是整个状态机的核心组件，管理状态、事件和状态转换。它封装了所有状态、转换、动作、守卫条件等的定义和执行逻辑 | 1. StateMachine 控制状态的变化和事件的处理<br/>2. 可以监听状态变化和转换，提供钩子来执行特定的业务逻辑 | |


## 构建状态机
### 项目结构

![20241003225621](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20241003225621.png)

### 定义实体类

Order 类

```java
package xyz.kbws.statemachine.models;

import lombok.Data;
import xyz.kbws.statemachine.enums.States;

/**
 * @author kbws
 * @date 2024/10/2
 * @description: 订单实体类
 */
@Data
public class Order {
    // 订单号
    private int id;
    // 订单状态
    private States states;

    public Order(int orderId) {
        this.id = orderId;
    }

    public Order() {
    }

    @Override
    public String toString() {
        return "订单号：" + id + ", 订单状态：" + states;
    }
}
```

### 定义状态和事件

状态机中最基本的元素就是状态和事件，整个业务逻辑的组织变更流程都是围绕着状态和事件展开的

State 状态枚举

```java
package xyz.kbws.statemachine.enums;

/**
 * @author kbws
 * @date 2024/10/2
 * @description: 状态枚举
 */
public enum States {
    // 未支付
    UNPAID,
    // 待审核
    WAITING_FOR_CHECK,
    // 待收货
    WAITING_FOR_RECEIVE,
    // 结束
    DONE
}
```

Events 事件枚举

```java
package xyz.kbws.statemachine.enums;

/**
 * @author kbws
 * @date 2024/10/2
 * @description: 事件枚举
 */
public enum Events {
    PAY,        // 支付
    RECEIVE     // 收货
}
```

### 定义守卫条件

OrderIdCheckGuard 类

```java
package xyz.kbws.statemachine.guards;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.guard.Guard;
import xyz.kbws.statemachine.enums.Events;
import xyz.kbws.statemachine.enums.States;
import xyz.kbws.statemachine.models.Order;

/**
 * @author kbws
 * @date 2024/10/2
 * @description: 订单检查守卫
 * 要求订单从“待支付”变为“待收货”状态需要满足某个条件（这里为方便演示，只有订单 id 不小于 0 的才满足条件）
 */
public class OrderIdCheckGuard implements Guard<States, Events> {

    private static final Logger LOGGER = LoggerFactory.getLogger("SM");

    /**
     * 检查方法
     *
     * @param stateContext
     * @return
     */
    @Override
    public boolean evaluate(StateContext<States, Events> stateContext) {
        // 获取消息中的订单对象
        Order order = (Order) stateContext.getMessage().getHeaders().get("order");
        // 订单号长度不等于0位，则订单号非法
        if (String.valueOf(order.getId()).length() == 0) {
            LOGGER.info("检查订单：不通过，不合法的订单号：" + order.getId());
            return false;
        } else {
            LOGGER.info("检查订单：通过");
            return true;
        }
    }
}

```

### 定义行为

这里的 Action 包括针对检查成功和检查失败两个分支逻辑的处理，`OrderIdCheckPassedAction`和`OrderIdCheckFailedAction`

```java
package xyz.kbws.statemachine.actions;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import xyz.kbws.statemachine.enums.Events;
import xyz.kbws.statemachine.enums.States;
import xyz.kbws.statemachine.models.Order;

/**
 * @author kbws
 * @date 2024/10/2
 * @description: 订单检查通过 Action
 */
public class OrderIdCheckPassedAction implements Action<States, Events> {

    private static final Logger LOGGER = LoggerFactory.getLogger("SM");

    /**
     * 执行方法
     *
     * @param stateContext 状态上下文
     */
    @Override
    public void execute(StateContext<States, Events> stateContext) {
        // 获取消息中的订单对象
        Order order = (Order) stateContext.getMessage().getHeaders().get("order");
        // 设置新状态
        order.setStates(States.WAITING_FOR_RECEIVE);
        LOGGER.info("通过检查，等待收货......");
    }
}

```

```java
package xyz.kbws.statemachine.actions;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import xyz.kbws.statemachine.enums.Events;
import xyz.kbws.statemachine.enums.States;
import xyz.kbws.statemachine.models.Order;

/**
 * @author kbws
 * @date 2024/10/2
 * @description: 订单检查未通过 Action
 */
public class OrderIdCheckFailedAction implements Action<States, Events> {

    private static final Logger LOGGER = LoggerFactory.getLogger("SM");

    @Override
    public void execute(StateContext<States, Events> stateContext) {
        // 获取消息中的订单对象
        Order order = (Order) stateContext.getMessage().getHeaders().get("order");
        // 设置新状态
        order.setStates(States.UNPAID);
        LOGGER.info("检查未通过，状态不流转......");
    }
}

```

Action 异常处理类

```java
package xyz.kbws.statemachine.actions;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import xyz.kbws.statemachine.enums.Events;
import xyz.kbws.statemachine.enums.States;

/**
 * @author kbws
 * @date 2024/10/2
 * @description: 如果 action 执行报错了，会执行此类的逻辑
 */
public class ErrorHandlerAction implements Action<States, Events> {

    private static final Logger LOGGER = LoggerFactory.getLogger("SM");

    @Override
    public void execute(StateContext<States, Events> stateContext) {
        RuntimeException exception = (RuntimeException) stateContext.getException();
        LOGGER.error("捕获到异常：" + exception);
        // 将发生的异常信息记录在StateMachineContext中，在外部可以根据这个这个值是否存在来判断是否有异常发生
        stateContext.getStateMachine().getExtendedState().getVariables().put(RuntimeException.class, exception);
    }
}

```

### 配置状态转换监听器

状态转换监听器的实现有两种

一种是通过继承`StateMachineListenerAdapter`

```java
package xyz.kbws.statemachine.listener;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.statemachine.listener.StateMachineListenerAdapter;
import org.springframework.statemachine.transition.Transition;
import org.springframework.stereotype.Component;
import xyz.kbws.statemachine.enums.Events;
import xyz.kbws.statemachine.enums.States;

/**
 * @author kbws
 * @date 2024/10/2
 * @description: 基于 StateMachineListenerAdapter 的状态机监听器实现方式
 */
@Deprecated
@Component
public class OrderStateMachineListener extends StateMachineListenerAdapter<States, Events> {

    private static final Logger LOGGER = LoggerFactory.getLogger(OrderStateMachineListener.class);

    /**
     * 在状态机进行状态转换时调用
     *
     * @param transition the transition
     */
    @Override
    public void transition(Transition<States, Events> transition) {
        // 当前是未支付状态
        if (transition.getTarget().getId() == States.UNPAID) {
            LOGGER.info("订单创建");
        }

        // 从未支付->待收货状态
        if (transition.getSource().getId() == States.UNPAID && transition.getTarget()
                .getId() == States.WAITING_FOR_RECEIVE) {
            LOGGER.info("用户支付完毕");
        }

        // 从待收货->完成状态
        if (transition.getSource().getId() == States.WAITING_FOR_RECEIVE && transition.getTarget()
                .getId() == States.DONE) {
            LOGGER.info("用户已收货");
        }
    }

    /**
     * 在状态机开始进行状态转换时调用
     *
     * @param transition the transition
     */
    @Override
    public void transitionStarted(Transition<States, Events> transition) {
        // 从未支付->待收货状态
        if (transition.getSource().getId() == States.UNPAID && transition.getTarget()
                .getId() == States.WAITING_FOR_RECEIVE) {
            LOGGER.info("用户支付（状态转换开始）");
        }
    }

    /**
     * 在状态机进行状态转换结束时调用
     *
     * @param transition the transition
     */
    @Override
    public void transitionEnded(Transition<States, Events> transition) {
        // 从未支付->待收货状态
        if (transition.getSource().getId() == States.UNPAID && transition.getTarget()
                .getId() == States.WAITING_FOR_RECEIVE) {
            LOGGER.info("用户支付（状态转换结束）");
        }
    }
}

```

需要在状态机配置类中配置监听器

```java
@Autowired
private OrderStateMachineListener listener;

// 初始化当前状态机配置
@Override
public void configure(StateMachineConfigurationConfigurer<States, Events> config)
         throws Exception {
  	 // 设置监听器
     config.withConfiguration().listener(listener); 
}

```



第二种方式就是使用注解（推荐）

```java
package xyz.kbws.statemachine.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.statemachine.annotation.OnTransition;
import org.springframework.statemachine.annotation.OnTransitionEnd;
import org.springframework.statemachine.annotation.OnTransitionStart;
import org.springframework.statemachine.annotation.WithStateMachine;
import xyz.kbws.statemachine.enums.Events;
import xyz.kbws.statemachine.enums.States;
import xyz.kbws.statemachine.models.Order;

/**
 * @author kbws
 * @date 2024/10/2
 * @description: 基于注解的事件监听器实现方式，可以同于替代 OrderStateMachineListener
 */
@Configuration
// 这里配置id
@WithStateMachine(id = StateMachineFactoryConfig.ORDER_STATEMACHINE_ID)
public class StateMachineEventConfig {
    private static final Logger LOGGER = LoggerFactory.getLogger(StateMachineEventConfig.class);

    @OnTransition(target = "UNPAID")
    public void create() {
        LOGGER.info("订单创建");
    }

    @OnTransition(source = "UNPAID", target = "WAITING_FOR_CHECK")
    public void pay(Message<Events> message) {
        // 获取消息中的订单对象
        Order order = (Order) message.getHeaders().get("order");
        // 设置新状态
        order.setStates(States.WAITING_FOR_RECEIVE);
        LOGGER.info("用户支付完毕，状态机反馈信息：" + message.getHeaders().toString());
    }

    @OnTransition(source = "WAITING_FOR_RECEIVE", target = "DONE")
    public void receive(Message<Events> message) {
        // 获取消息中的订单对象
        Order order = (Order) message.getHeaders().get("order");
        // 设置新状态
        order.setStates(States.DONE);
        LOGGER.info("用户已收货，状态机反馈信息：" + message.getHeaders().toString());
    }

    // 监听状态从待检查订单到待收货
    @OnTransition(source = "WAITING_FOR_CHECK", target = "WAITING_FOR_RECEIVE")
    public void checkPassed() {
        System.out.println("检查通过，等待收货");
    }

    // 监听状态从待检查订单到待付款
    @OnTransition(source = "WAITING_FOR_CHECK", target = "UNPAID")
    public void checkFailed() {
        System.out.println("检查不通过，等待付款");
    }

    @OnTransitionStart(source = "UNPAID", target = "WAITING_FOR_RECEIVE")
    public void payStart() {
        LOGGER.info("用户支付（状态转换开始）");
    }

    @OnTransitionEnd(source = "UNPAID", target = "WAITING_FOR_RECEIVE")
    public void payEnd() {
        LOGGER.info("用户支付（状态转换结束）");
    }
}

```

### 配置状态机

上面的准备工作都完成后，开始定义状态机

```java
package xyz.kbws.statemachine.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.statemachine.config.EnableStateMachine;
import org.springframework.statemachine.config.StateMachineConfigurerAdapter;
import org.springframework.statemachine.config.builders.StateMachineStateConfigurer;
import org.springframework.statemachine.config.builders.StateMachineTransitionConfigurer;
import xyz.kbws.statemachine.actions.ErrorHandlerAction;
import xyz.kbws.statemachine.actions.OrderIdCheckFailedAction;
import xyz.kbws.statemachine.actions.OrderIdCheckPassedAction;
import xyz.kbws.statemachine.enums.Events;
import xyz.kbws.statemachine.enums.States;
import xyz.kbws.statemachine.guards.OrderIdCheckGuard;

import java.util.EnumSet;

/**
 * @author kbws
 * @date 2024/10/2
 * @description: 状态机配置类
 */
@Configuration
// 该注解用来启用 Spring StateMachine 状态机功能
@EnableStateMachine
public class StateMachineConfig extends StateMachineConfigurerAdapter<States, Events> {

    /**
     * 初始化当前状态机有哪些状态
     *
     * @param states the {@link StateMachineStateConfigurer}
     * @throws Exception
     */
    @Override
    public void configure(StateMachineStateConfigurer<States, Events> states) throws Exception {
        states.withStates()
                .initial(States.UNPAID) // 指定初始状态为未支付
                .choice(States.WAITING_FOR_CHECK) // 指定状态为待审核，这里是个选择状态
                .states(EnumSet.allOf(States.class)); // 指定 States 中的所有状态作为该状态机的状态定义
    }

    /**
     * 初始化当前状态机有哪些状态迁移动作, 有来源状态为 source，目标状态为 target，触发事件为 event
     * 1、UNPAID -> WAITING_FOR_CHECK  事件 PAY
     * 2、WAITING_FOR_CHECK
     * -> WAITING_FOR_RECEIVE 检查通过
     * -> UNPAID              检查未通过
     * 3、WAITING_FOR_RECEIVE -> DONE  事件 RECEIVE
     *
     * @param transitions the {@link StateMachineTransitionConfigurer}
     * @throws Exception
     */
    @Override
    public void configure(StateMachineTransitionConfigurer<States, Events> transitions) throws Exception {
        transitions.withExternal()
                .source(States.UNPAID)
                .target(States.WAITING_FOR_CHECK)
                .event(Events.PAY)
                .and()
                .withChoice()
                .source(States.WAITING_FOR_CHECK)
                .first(States.WAITING_FOR_RECEIVE, new OrderIdCheckGuard(), new OrderIdCheckPassedAction(), new ErrorHandlerAction()) // 如判断为true ->待收货状态
                .last(States.UNPAID, new OrderIdCheckFailedAction())
                .and()
                .withExternal()
                .source(States.WAITING_FOR_RECEIVE)
                .target(States.DONE)
                .event(Events.RECEIVE); // 收货事件将触发：待收货状态->结束状态
    }
}

```

**相关概念**

+ `Transition`：节点，是组成状态机引擎的核心
+ `source`：节点的当前状态
+ `target`：节点的目标状态
+ `event`：触发节点从当前状态到目标状态的动作
+ `guard`：校验功能，用于判断是否可以执行后续的 Action
+ `action`：用于实现当前节点的业务逻辑处理
+ `withExternal`：是当 source 和 target 不同时的写法
+ `withExternal`：当 source 和 target 相同时的串联写法，比如：付款失败时，付款前和付款后都是待付款状态
+ `withChoice`：当执行一个动作时，可能导致多种结果，可以选择使用 choice + guard 来跳转，没有选择分支
+ `and`：多个节点之间用 and 串联
+ `first/then/last`：类似 if-else if-else，then 可以不设置，但是 last 一定要有

### 使用状态机

上面已经定义好了状态机，下面是状态机在业务逻辑中的用法

```java
package xyz.kbws.statemachine.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.statemachine.StateMachine;
import org.springframework.statemachine.config.StateMachineFactory;
import org.springframework.statemachine.persist.StateMachinePersister;
import org.springframework.stereotype.Service;
import xyz.kbws.statemachine.enums.Events;
import xyz.kbws.statemachine.enums.States;
import xyz.kbws.statemachine.models.Order;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.Map;

/**
 * @author kbws
 * @date 2024/10/2
 * @description:
 */
@Service
public class OrderStateService {
    public static final String stateMachineId = "orderStateMachine";
    private static final Logger LOGGER = LoggerFactory.getLogger(OrderStateService.class);
    public final Map<Integer, Order> orders = new HashMap<>();
    private final Map<Integer, StateMachine<States, Events>> stateMachines = new HashMap<>();
    /**
     * 状态机
     */
    //@Resource
    //private StateMachine<States, Events> stateMachine;

    @Resource
    private StateMachineFactory<States, Events> stateMachineFactory;
    private Integer id = 1;

    public Order createModel() throws Exception {
        Order order = new Order();
        order.setStates(States.UNPAID);
        order.setId(id++);
        orders.put(order.getId(), order);
        StateMachine<States, Events> stateMachine = stateMachineFactory.getStateMachine(stateMachineId);
        stateMachine.start();
        stateMachines.put(order.getId(), stateMachine);
        return order;
    }

    public boolean pay(int orderId) {
        Order order = orders.get(orderId);
        return this.sendMessages(order, Events.PAY);
    }

    public boolean receive(int orderId) {
        return this.sendMessages(orders.get(orderId), Events.RECEIVE);
    }

    private synchronized boolean sendMessages(Order order, Events event) {
        LOGGER.info("--- 发送" + event + "事件 ---");
        StateMachine<States, Events> stateMachine = stateMachines.get(order.getId());
        try {
            // 构建消息
            Message message = MessageBuilder.withPayload(event).setHeader("order", order).build();
            Thread.sleep(1000);
            boolean result = stateMachine.sendEvent(message);
            LOGGER.info("事件是否发送成功：" + result + "，当前状态：" + stateMachine.getState().getId());
            return result;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }
}

```

### 测试

测试状态机功能流程

```java
package xyz.kbws.statemachine;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import xyz.kbws.statemachine.service.OrderStateService;

import javax.annotation.Resource;

@SpringBootTest
@RunWith(SpringRunner.class)
public class ApiTest {

    @Resource
    private OrderStateService orderStateService;

    @Test
    public void contextLoads() {
        orderStateService.createModel();
        orderStateService.createModel();
        orderStateService.pay(1);
        orderStateService.receive(1);
        orderStateService.pay(2);
        orderStateService.receive(2);
    }

}
```

输出如下：

![20241003225929](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20241003225929.png)

## 拓展

### 状态机工厂

上面我写的在业务逻辑中使用状态机的代码，不是用的 StateMachine 而是 StateMachineFactory

使用工厂的原因在于，如果用 StateMachine 的话，这个状态机是全局唯一并且共享的，如果有两个订单同时要走流程的话，代码会报错

使用 StateMachineFactory 可以每次创建一个新的状态机实例，并将实例缓存起来，这样多个订单之间就不会相互影响了

状态机工厂配置类的内容如下：

```java
package xyz.kbws.statemachine.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.statemachine.config.EnableStateMachineFactory;
import org.springframework.statemachine.config.StateMachineConfigurerAdapter;
import org.springframework.statemachine.config.builders.StateMachineStateConfigurer;
import org.springframework.statemachine.config.builders.StateMachineTransitionConfigurer;
import xyz.kbws.statemachine.actions.ErrorHandlerAction;
import xyz.kbws.statemachine.actions.OrderIdCheckFailedAction;
import xyz.kbws.statemachine.actions.OrderIdCheckPassedAction;
import xyz.kbws.statemachine.enums.Events;
import xyz.kbws.statemachine.enums.States;
import xyz.kbws.statemachine.guards.OrderIdCheckGuard;

import java.util.EnumSet;

/**
 * @author kbws
 * @date 2024/10/3
 * @description: 状态机工厂配置类
 */
@Configuration
@EnableStateMachineFactory
public class StateMachineFactoryConfig extends StateMachineConfigurerAdapter<States, Events> {
    /**
     * 定义状态机ID
     */
    public static final String ORDER_STATEMACHINE_ID = "orderStateMachineId";

    @Override
    public void configure(StateMachineStateConfigurer<States, Events> states) throws Exception {
        states.withStates()
                .initial(States.UNPAID)
                .choice(States.WAITING_FOR_CHECK)
                .states(EnumSet.allOf(States.class));
    }

    @Override
    public void configure(StateMachineTransitionConfigurer<States, Events> transitions) throws Exception {
        transitions
                .withExternal()
                .source(States.UNPAID)
                .target(States.WAITING_FOR_CHECK)
                .event(Events.PAY)
                .and()
                .withChoice()
                .source(States.WAITING_FOR_CHECK)
                .first(States.WAITING_FOR_RECEIVE, new OrderIdCheckGuard(), new OrderIdCheckPassedAction(), new ErrorHandlerAction()) // 如判断为true ->待收货状态
                .last(States.UNPAID, new OrderIdCheckFailedAction())
                .and()
                .withExternal()
                .source(States.WAITING_FOR_RECEIVE)
                .target(States.DONE)
                .event(Events.RECEIVE); // 收货事件将触发：待收货状态->结束状态
    }
}

```

### 持久化
如果系统在处理订单的时候突然宕机或者因为某些原因中断了，就会造成状态丢失，为了能实现状态机恢复，可以使用持久化机制

持久化调用流程如下：

![20241003225703](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20241003225703.png)

Spring StateMachine持久化时，采用了三层结构设计，persister —>persist —>repository

+ 其中 persister 中封装了 write 和 restore 两个方法，分别用于持久化写及反序列化读出。
+ persist 只是一层皮，主要还是调用repository中的实际实现；但是在这里，由于 Redis 存储不保证百分百数据安全，后面可以考虑添加数据库存储的功能
+ repository 中读、写 Redis

#### Repository
```java
package xyz.kbws.statemachine.persister;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.statemachine.data.redis.RedisStateMachineContextRepository;
import xyz.kbws.statemachine.enums.Events;
import xyz.kbws.statemachine.enums.States;

/**
 * @author kbws
 * @date 2024/10/3
 * @description:
 */
@Configuration
public class OrderRedisStateMachineRepository {

    @Autowired
    private RedisConnectionFactory redisConnectionFactory;

    @Bean
    public RedisStateMachineContextRepository<States, Events> redisStateMachineContextRepository() {
        return new RedisStateMachineContextRepository<>(redisConnectionFactory);
    }
}

```

#### Persist

```java
package xyz.kbws.statemachine.persister;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.statemachine.StateMachineContext;
import org.springframework.statemachine.StateMachinePersist;
import org.springframework.statemachine.data.redis.RedisStateMachineContextRepository;
import org.springframework.stereotype.Component;
import xyz.kbws.statemachine.enums.Events;
import xyz.kbws.statemachine.enums.States;

/**
 * @author kbws
 * @date 2024/10/3
 * @description:
 */
@Component("stateMachinePersist")
public class OrderStateMachinePersist implements StateMachinePersist<States, Events, String> {

    @Autowired
    private RedisStateMachineContextRepository<States, Events> redisStateMachineContextRepository;

    @Override
    public void write(StateMachineContext<States, Events> stateMachineContext, String s) throws Exception {
        redisStateMachineContextRepository.save(stateMachineContext, s);
    }

    @Override
    public StateMachineContext<States, Events> read(String s) throws Exception {
        StateMachineContext<States, Events> context = redisStateMachineContextRepository.getContext(s);
        return context;
    }
}

```

#### Persister

```java
package xyz.kbws.statemachine.persister;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.statemachine.StateMachinePersist;
import org.springframework.statemachine.data.redis.RedisStateMachinePersister;
import org.springframework.statemachine.persist.StateMachinePersister;
import xyz.kbws.statemachine.enums.Events;
import xyz.kbws.statemachine.enums.States;

/**
 * @author kbws
 * @date 2024/10/3
 * @description:
 */
@Configuration
public class RedisStateMachinePersisterConfig {

    @Autowired
    private StateMachinePersist stateMachinePersist;

    @Bean(name = "redisStateMachinePersister")
    public StateMachinePersister<States, Events, String> stateMachinePersist() {
        return new RedisStateMachinePersister<>(stateMachinePersist);
    }
}

```



使用方式如下：

```java
/**
 * 状态机持久化器
 */
@Autowired
public StateMachinePersister stateMachinePersister;

public Order createModel() throws Exception {
    Order order = new Order();
    order.setStates(States.UNPAID);
    order.setId(id++);
    orders.put(order.getId(), order);
    StateMachine<States, Events> stateMachine = stateMachineFactory.getStateMachine(stateMachineId);
    stateMachine.start();
    stateMachines.put(order.getId(), stateMachine);
    // 持久化
    stateMachinePersister.persist(stateMachine, String.valueOf(order.getId()));
    return order;
}

private synchronized boolean sendMessages(Order order, Events event) {
    LOGGER.info("--- 发送" + event + "事件 ---");
    StateMachine<States, Events> stateMachine = stateMachines.get(order.getId());
    try {
        stateMachinePersister.restore(stateMachine, String.valueOf(order.getId()));
        // 构建消息
        Message message = MessageBuilder.withPayload(event).setHeader("order", order).build();
        Thread.sleep(1000);
        boolean result = stateMachine.sendEvent(message);
        LOGGER.info("事件是否发送成功：" + result + "，当前状态：" + stateMachine.getState().getId());
        return result;
    } catch (Exception e) {
        e.printStackTrace();
    }
    return false;
}
```

