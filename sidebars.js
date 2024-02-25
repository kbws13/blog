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
        'Skill/Project/rpc',
        // Online Judge
        'Skill/Project/oj'
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
