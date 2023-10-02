export const projects: Project[] = [
  {
    title: 'mini-Spring',
    description: '以Spring框架为原型，编写一个迷你版的Spring框架',
    preview: '/img/project/spring.png',
    website: 'https://github.com/kbws13/mini-Spring',
    source: 'https://github.com/kbws13/mini-Spring',
    tags: ['opensource', 'favorite', 'product'],
    type: 'web',
  },
  {
    title: '个人网盘',
    description: '一个仿百度云盘面向C端用户的网盘项目',
    preview: '/img/project/netdisk.png',
    website: 'http://netdisk.kbws.xyz',
    source: 'https://github.com/kbws13/Netdisk',
    tags: ['opensource', 'design', 'large'],
    type: 'web',
  },
  {
    title: 'Java代码生成器',
    description: '读取数据库中的表自动生成对应CRUD代码',
    preview: '/img/project/java-code-general.png',
    website: 'https://github.com/kbws13/Java-Code-Generator',
    source: 'https://github.com/kbws13/Java-Code-Generator',
    tags: ['opensource', 'favorite', 'product', 'large'],
    type: 'web',
  },
  // {
  //   title: '@kuizuo/http',
  //   description: '基于 Axios 封装的 HTTP 类库',
  //   website: 'https://www.npmjs.com/package/@kuizuo/http',
  //   tags: ['opensource', 'personal'],
  //   type: 'personal',
  // },
  // {
  //   title: '@kuizuo/utils',
  //   description: '整理 JavaScript / TypeScript 的相关工具函数',
  //   website: 'https://www.npmjs.com/package/@kuizuo/utils',
  //   tags: ['opensource', 'personal'],
  //   type: 'personal',
  // },
  // {
  //   title: '@kuizuo/eslint-config',
  //   description: '来自 antfu 的 ESLint 配置文件',
  //   website: 'https://github.com/kuizuo/eslint-config',
  //   tags: ['opensource', 'personal'],
  //   type: 'personal',
  // },
  // {
  //   title: 'browser-rpc',
  //   description: 'WebSocket 远程调用浏览器函数',
  //   website: 'https://github.com/kuizuo/rpc-browser',
  //   tags: ['opensource'],
  //   type: 'personal',
  // },
  // {
  //   title: 'rust-wasm-md5',
  //   description: '🦀 Rust + WebAssembly 实现的 MD5 加密',
  //   website: 'https://github.com/kuizuo/rust-wasm-md5',
  //   tags: ['opensource'],
  //   type: 'personal',
  // },
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

export type ProjectType = 'personal' | 'web' | 'app' | 'toy' | 'other'

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
