/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  skill: [
    'Skill/introduction',
    // Project
    {
      label: '项目',
      type: 'category',
      link: { type: 'generated-index' },
      items: [
        // RPC
        {
          label: 'RPC',
          type: 'category',
          link: {
            type: 'doc',
            id: 'Skill/Project/RPC/rpc',
          },
          items: [
            'Skill/Project/RPC/rpc-init',
          ],
        },
        // Online Judge
        {
          label: 'OnlineJudge',
          type: 'category',
          link: { 
            type: 'doc',
            id: 'Skill/Project/OnlineJudge/oj-index'
          },
          items: [
            'Skill/Project/OnlineJudge/oj-init'
          ]
        },
        
      ]
    },
    // Development
    {
      label: '开发笔记',
      type: 'category',
      link: {type: 'generated-index'},
      items: [
        // 飞书机器人推送线上Bug
        'Skill/Development/feishu-bot',
        // 代码沙箱
        'Skill/Development/codesandbox'
      ]
    },
    // Java
    {
      label: 'Java',
      type: 'category',
      link: { 
        type: 'doc',
        id: 'Skill/Java/java-index'
      },
      items: [
        // Java SE
        {
          label: 'Java SE',
          type: 'category',
          link: { type: 'generated-index' },
          items: [
            "Skill/Java/Java SE/variables and operators",
            "Skill/Java/Java SE/flow-sontrol-statement",
            "Skill/Java/Java SE/array",
            "Skill/Java/Java SE/object-oriented",
            "Skill/Java/Java SE/exception",
            "Skill/Java/Java SE/thread",
            "Skill/Java/Java SE/common-classes-and-apis",
            "Skill/Java/Java SE/aggregate",
            "Skill/Java/Java SE/generic-paradigm",
            "Skill/Java/Java SE/file-class-and-io-stream",
            "Skill/Java/Java SE/network-programming",
            "Skill/Java/Java SE/reflection",
            "Skill/Java/Java SE/new-features",
          ]
        },
        // MySQL
        {
          label: 'MySQL',
          type: 'category',
          link: { type: 'generated-index' },
          items: [
            "Skill/Java/MySQL/mysql-basic",
            "Skill/Java/MySQL/mysql-advanced",
            "Skill/Java/MySQL/mysql-operation",
          ]
        },
        // MySQL-Plus
        {
          label: 'MySQL-Plus',
          type: 'category',
          link: { type: 'generated-index' },
          items: [
            "Skill/Java/MySQL-Plus/mysql-plus-basic",
          ]
        },
        // Java Web
        "Skill/Java/java-web",
        // Spring
        "Skill/Java/spring",
        // Mybatis Plus
        "Skill/Java/mybatis-plus",
        // Spring MVC
        "Skill/Java/spring-mvc",
        // Redis
        {
          label: 'Redis',
          type: 'category',
          link: { type: 'generated-index' },
          items: [
            "Skill/Java/Redis/redis-basic",
            "Skill/Java/Redis/redis-actual-combat",
            "Skill/Java/Redis/redis-senior",
          ]
        },
        // 消息队列
        {
          label: '消息队列',
          type: 'category',
          link: { type: 'generated-index' },
          items: [
            "Skill/Java/消息队列/rabbitmq",
          ]
        },
        // 设计模式
        "Skill/Java/design-patterns",
        // Nginx
        "Skill/Java/nginx",
        // 微服务
        {
          label: '微服务',
          type: 'category',
          link: { 
            type: 'doc',
            id: 'Skill/Java/微服务/microservice-index'
          },
          items: [
            "Skill/Java/微服务/eureka",
            "Skill/Java/微服务/nacos",
            "Skill/Java/微服务/zookeeper",
            "Skill/Java/微服务/feign",
            "Skill/Java/微服务/gateway",
          ]
        },
      ]
    },
    // 前端
    {
      label: '前端',
      type: 'category',
      link: { type: 'generated-index' },
      items: [
        "Skill/FrontEnd/ant-design-pro",
      ]
    },
    // Python
    {
      label: 'Python',
      type: 'category',
      link: { type: 'generated-index' },
      items: [
        "Skill/Python/virtuaenv"
      ]
    }
  ],
}

module.exports = sidebars
