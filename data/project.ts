export const projects: Project[] = [
  {
    title: 'K-OJ',
    description: '基于 Vue3+Spring Boot+Spring Cloud 微服务+Docker 的编程题目在线测评系统',
    preview: 'https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240125212221.png',
    website: 'http://oj.kbws.xyz',
    source: 'https://github.com/kbws13/OnlineJudge-Backend-MicroService',
    tags: ['opensource', 'favorite'],
    type: 'K系列'
  },
  {
    title: 'K-API',
    description: '提供 API 供开发者调用的平台，基于 Spring Boot 后端+ React 前端的全栈微服务项目',
    preview: 'https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240902220714.png',
    website: 'http://api.kbws.xyz',
    source: 'https://github.com/kbws13/K-API-Backend',
    tags: ['opensource', 'favorite'],
    type: 'K系列'
  },
  {
    title: 'K-RPC',
    description: '基于 Netty+Kyro+Zookeeper 实现的自定义 RPC 框架',
    preview: 'https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240125211728.png',
    website: 'https://github.com/kbws13/K-RPC',
    source: 'https://github.com/kbws13/K-RPC',
    tags: ['opensource', 'favorite'],
    type: '手写系列'
  },
  {
    title: 'K-Link',
    description: '短链接生成项目',
    preview: 'https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240526162238.png',
    website: 'http://link.kbws.xyz',
    source: 'https://github.com/kbws13/K-Link-Backend',
    tags: ['opensource', 'favorite'],
    type: 'K系列'
  },
  {
    title: 'mini-Spring',
    description: '以Spring框架为原型，编写一个迷你版的Spring框架',
    preview: '/img/project/spring.png',
    website: 'https://github.com/kbws13/mini-Spring',
    source: 'https://github.com/kbws13/mini-Spring',
    tags: ['opensource', 'favorite', 'product'],
    type: '手写系列',
  },
  {
    title: '个人网盘',
    description: '一个仿百度云盘面向C端用户的网盘项目',
    preview: '/img/project/netdisk.png',
    website: 'http://netdisk.kbws.xyz',
    source: 'https://github.com/kbws13/Netdisk',
    tags: ['opensource', 'design', 'large'],
    type: 'K系列',
  },
  
]

export type Tag = {
  label: string
  description: string
  color: string
}

export type TagType =
  | 'favorite'
  | 'opensource'
  | 'product'
  | 'design'
  | 'large'
  | 'personal'

export type ProjectType = 'personal' | 'K系列' | '手写系列' | 'toy' | 'other'

export type Project = {
  title: string
  description: string
  preview?: any
  website: string
  source?: string | null
  tags: TagType[]
  type: ProjectType
}

export const Tags: Record<TagType, Tag> = {
  favorite: {
    label: '喜爱',
    description: '我最喜欢的网站，一定要去看看!',
    color: '#e9669e',
  },
  opensource: {
    label: '开源',
    description: '开源项目可以提供灵感!',
    color: '#39ca30',
  },
  product: {
    label: '产品',
    description: '与产品相关的项目!',
    color: '#dfd545',
  },
  design: {
    label: '设计',
    description: '设计漂亮的网站!',
    color: '#a44fb7',
  },
  large: {
    label: '大型',
    description: '大型项目，原多于平均数的页面',
    color: '#8c2f00',
  },
  personal: {
    label: '个人',
    description: '个人项目',
    color: '#12affa',
  },
}

export const TagList = Object.keys(Tags) as TagType[]

export const groupByProjects = projects.reduce((group, project) => {
  const { type } = project
  group[type] = group[type] ?? []
  group[type].push(project)
  return group
}, {} as Record<ProjectType, Project[]>)
