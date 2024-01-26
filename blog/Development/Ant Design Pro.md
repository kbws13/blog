---
slug: ant-design-pro
title: Ant Design Pro 教程
date: 2023-12-23
tags: [前端, Ant Design Pro]
keywords: [前端, Ant Design Pro]
---
介绍：作为一个后端，从头学习前端花费的精力有点过大，使用一个开源的模板框架是一个不错的选择
## 初始化
> 要求 node.js 版本：v16.20

使用 pro-cli 脚手架来初始化项目
```shell
## 使用npm
npm i @ant-design/pro-cli -g
pro create myapp
```
选择使用 umi@3，然后选择 simple 创建一个简单的脚手架
![20240125205339](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240125205339.png)
> 推荐使用 yarn 包管理器

安装 yarn
```shell
npm install --global yarn
```
### 安装依赖
进入刚才创建的项目文件夹，安装项目所需依赖
```shell
cd myapp
yarn
```

### 运行项目
安装依赖完成后，先尝试运行一下，看看有没有报错（因为 antd-pro 项目有自带的模拟数据，可以通过 start 命令运行起来）
```shell
yarn start
```

运行成功
![20240125205437](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240125205437.png)

访问：[http://localhost:8000](http://localhost:8000)
账号密码为：admin/ant.design
> 注意：如果登录页出现了样式丢失，如下图
> ![20240125205453](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240125205453.png)
> 解决方法：
> src/pages/user/login/index.less页面代码第一行
> ![20240125205503](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240125205503.png)
> 去掉`(reference)`
> 页面恢复正常
> ![20240125205513](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240125205513.png)
> 其他页面同理


## 修改项目
### 去除国际化
运行
```shell
yarn run i18n-remove
```
![20240125205527](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240125205527.png)
去除国际化成功
### 安装重型组件
```shell
yarn add @ant-design/pro-components
```

如果安装组件后报错：
![20240125205538](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240125205538.png)
解决方法：
打开 config/config.ts 文件
![20240125205546](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240125205546.png)
将`loading: '@ant-design/pro-layout/es/PageLoading',`注释掉
![20240125205618](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240125205618.png)
![20240125205627](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240125205627.png)
将 src 目录下的 .umi 文件夹删掉
![20240125205635](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240125205635.png)
重新启动项目就可以了
### 删掉多余文件夹
删掉项目文件夹下的 e2e 文件夹、locales 文件夹、tests文件夹
![20240125205643](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240125205643.png)

## 开始开发
### proxy.ts
设置代理，`target`为后端服务地址，`changeOrigin: true,`表示允许携带`cookie`
```typescript
export default {
  dev: {
    '/api/': {
      // 要代理的地址
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
  },
  test: {
    '/api/': {
      target: 'https://proapi.azurewebsites.net',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
```
### defaultSetting.ts
`title`为网站的标题
```typescript
import { Settings as LayoutSettings } from '@ant-design/pro-components';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  // 拂晓蓝
  primaryColor: '#1890ff',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: '学生获奖管理系统',
  pwa: false,
  logo: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
  iconfontUrl: '',
};

export default Settings;
```
### globalRequest.ts
自己封装请求工具，在 src/pugin 目录下创建 globalRequest.ts 文件
代码如下：
```typescript
/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import {extend} from 'umi-request';
import {message} from "antd";
import {history} from "@@/core/history";
import {stringify} from "querystring";

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  credentials: 'include', // 默认请求是否带上cookie
  prefix: process.env.NODE_ENV === 'production' ? 'http://user.kbws.xyz' : undefined
  // requestType: 'form',
});

/**
 * 所有请求拦截器
 */
request.interceptors.request.use((url, options): any => {
  return {
    url,
    options: {
      ...options,
      headers: {},
    },
  };
});

/**
 * 所有响应拦截器
 */
request.interceptors.response.use(async (response, options): Promise<any> => {
  const res = await response.clone().json();
  if (res.code === 0) {
    return res.data;
  }
  if (res.code === 40100) {
    message.error('请先登录');
    history.replace({
      pathname: '/user/login',
      search: stringify({
        redirect: location.pathname,
      }),
    });
  } else {
    message.error(res.description)
  }
  return res.data;
});

export default request;

```
### access.ts
修改 src 目录下的 access.ts 文件，实现权限验证
```typescript
import {API} from "@/services/ant-design-pro/typings";

/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  const { currentUser } = initialState ?? {};
  return {
    canAdmin: currentUser && currentUser.userRole === 'admin',
  };
}

```
### app.tsx
修改 src 目录下的 app.tsx 文件
添加白名单和定制化操作
```typescript
import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { PageLoading, SettingDrawer } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from 'umi';
import { history, Link } from 'umi';
import defaultSettings from '../config/defaultSettings';
import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';
import {RequestConfig} from "@@/plugin-request/request";
import {API} from "@/services/ant-design-pro/typings";

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';
/**
 * 白名单，不需要登录态的界面
 */
const NO_NEED_LOGIN_WHITE_LIST = ['/user/register', loginPath];

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

// 项目请求的前缀
export const request: RequestConfig = {
  timeout: 1000000,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      return await queryCurrentUser();
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果是无需登录的页面，不执行
  if (NO_NEED_LOGIN_WHITE_LIST.includes(history.location.pathname)) {
    return {
      // @ts-ignore
      fetchUserInfo,
      settings: defaultSettings,
    };
  }
  const currentUser = await fetchUserInfo();
  return {
    // @ts-ignore
    fetchUserInfo,
    // @ts-ignore
    currentUser,
    settings: defaultSettings,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.username,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      if (NO_NEED_LOGIN_WHITE_LIST.includes(location.pathname)) {
        return;
      }
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser) {
        history.push(loginPath);
      }
    },
    links: isDev
      ? [
          <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
          <Link to="/~docs" key="docs">
            <BookOutlined />
            <span>业务组件文档</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children, props) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {!props.location?.pathname?.includes('/login') && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};

```
### 调用后端API
#### 封装请求参数
在 src/services/ant-design-pro 文件夹下的 typing.d.ts 中，书写参数类型和返回结果类型
```typescript
declare namespace API {
  // 获取用户信息
  type CurrentUser = {
    id: number;
    username: string;
    userAccount: string;
    avatarUrl?: string;
    gender: string;
    phone: string;
    email: string;
    userStatus: number;
    createTime: Date;
    userRole: string;
    userCode: string;
  };

  type option = {
    value?: number,
    label?: string
  }

  /**
   * 统一返回类型
   */
  type BaseResponse<T> = {
    code: number;
    data: T;
    message: string;
    description: string;
  };

  // 登录结果
  type LoginResult = {
    status?: string;
    type?: string;
    currentAuthority?: string;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };
}
```
#### 封装请求方法
在 src/services/ant-design-pro 文件夹下的api.ts 中，封装调用后端接口的方法和传递的参数以及要求返回的数据类型
```typescript
// @ts-ignore
/* eslint-disable */
import request from '@/plugin/globalRequest';
import {API} from "@/services/ant-design-pro/typings";

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<API.CurrentUser>('/api/user/current', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 注销登录 POST /api/user/logout */
export async function outLogin(options?: { [key: string]: any }) {
  return request<API.BaseResponse<number>>('/api/user/logout', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.BaseResponse<API.LoginResult>>('/api/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
```

### 添加页面
复制项目自带的 Login 文件夹到创建的文件夹，然后将名字修改
![20240125205712](https://blog-1312417182.cos.ap-chengdu.myqcloud.com/blog/20240125205712.png)
#### 使用组件
想要使用组件的话可以去：[https://procomponents.ant.design/](https://procomponents.ant.design/)
去查询 ProComponents 的文档
这里那 ProTable 来举例
```typescript
import type {ActionType, ProColumns} from '@ant-design/pro-components';
import {ModalForm, ProForm, ProFormText, ProTable} from '@ant-design/pro-components';
import {Button, Image, message, Popconfirm, Tag} from 'antd';
import {useRef} from 'react';
import {currentUser, deleteUser, searchUsers, updateUserInfoByAdmin} from '@/services/ant-design-pro/api';
import {ProFormSelect} from '@ant-design/pro-form';
import {selectAvatarUrl, selectGender, selectUserRole, selectUserStatus} from '@/constants';
import {PlusOutlined} from "@ant-design/icons";
import {API} from "@/services/ant-design-pro/typings";

export const waitTimePromise = async (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, time);
  });
}

export const waitTime = async (time: number = 100) => {
  await waitTimePromise(time);
};

const user = await currentUser();
const isAdmin  = user && 'admin' === user.userRole

// 定义对应后端字段
const columns: ProColumns<API.CurrentUser>[] = [
  {
    title: '序号',
    dataIndex: 'id',
    valueType: 'indexBorder',
    width: 48,
    align: 'center',
  },
  {
    title: '用户名',
    dataIndex: 'username',
    copyable: true,
    ellipsis: true,
    tip: '用户名称',
    align: 'center',
  },
  {
    title: '用户账户',
    dataIndex: 'userAccount',
    copyable: true,
    align: 'center',
  },
  {
    title: '头像',
    dataIndex: 'avatarUrl',
    render: (_, record) => (
      <div>
        <Image src={record.avatarUrl} width="80px" height="80px"/>
      </div>
    ),
    copyable: true,
    align: 'center',
  },
  {
    title: '用户状态',
    dataIndex: 'userStatus',
    // 枚举
    valueType: 'select',
    valueEnum: {
      0: {text: <Tag color="success">正常</Tag>, status: 'Success'},
      1: {text: <Tag color="warning">注销</Tag>, status: 'Default'},
      2: {text: <Tag color="error">封号</Tag>, status: 'Error'},
    },
    align: 'center',
  },
  {
    title: '用户角色',
    dataIndex: 'userRole',
    // 枚举
    valueType: 'select',
    valueEnum: {
      user: {text: <Tag color="default">普通用户</Tag>},
      admin: {text: <Tag color="success">管理员</Tag>},
      ban: {text: <Tag color="error">封号</Tag>, status: 'Error'},
    },
    align: 'center',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    valueType: 'dateTime',
    align: 'center',
  },
  {
    title: '操作',
    align: 'center',
    valueType: 'option',
    key: 'option',
    hideInTable: !isAdmin,
    render: (text, record, _, action) => [
      <ModalForm<API.CurrentUser>
        title="修改用户信息"
        trigger={<Button type="link">修改</Button>}
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
          onCancel: () => console.log('run'),
        }}
        submitTimeout={2000}
        onFinish={async (values) => {
          await waitTime(1000);
          //点击了提交
          // console.log('values 的值为-------');
          //发起请求
          values.id = record.id;
          const isModify = await updateUserInfoByAdmin(values);
          if (isModify) {
            message.success('提交成功');
            // 刷新用户信息表单
            location.reload();
            return true;
          }
          return false;
        }}
      >
        <ProForm.Group>
          <ProFormText
            width="md"
            name="username"
            label="用户名"
            placeholder="请输入用户名"
            initialValue={record.username}
          />
          <ProFormText
            width="md"
            name="userAccount"
            label="用户账户"
            placeholder="请输入账户"
            initialValue={record.userAccount}
          />
          <ProFormText
            width="md"
            name="userCode"
            label="用户编号"
            placeholder="请输入编号"
            initialValue={record.userCode}
          />
          <ProFormSelect
            name="userStatus"
            fieldProps={{
              size: 'large',
            }}
            label="用户状态"
            options={selectUserStatus}
            initialValue={record.userStatus}
            placeholder={'选择用户状态'}
            rules={[
              {
                required: true,
                message: '请选择用户状态',
              },
            ]}
          />
          <ProFormSelect
            name="avatarUrl"
            fieldProps={{
              size: 'large',
            }}
            label="用户头像"
            options={selectAvatarUrl}
            placeholder={'请选择用户头像 '}
            initialValue={record.avatarUrl}
            rules={[
              {
                required: true,
                message: '请输入选择用户头像!',
              },
            ]}
          />
          <ProFormSelect
            name="gender"
            fieldProps={{
              size: 'large',
            }}
            label="性别"
            options={selectGender}
            placeholder="请选择性别"
            initialValue={record.gender}
            rules={[
              {
                required: true,
                message: '请选择性别',
              },
            ]}
          />
          <ProFormSelect
            name="userRole"
            fieldProps={{
              size: 'large',
            }}
            label="用户角色"
            options={selectUserRole}
            initialValue={record.userRole}
            placeholder={'选择用户角色'}
            rules={[
              {
                required: true,
                message: '请选择用户角色',
              },
            ]}
          />
        </ProForm.Group>
      </ModalForm>,
      <a key="view">
        <Popconfirm
          title="删除用户"
          // description="你确定要删除他吗？"
          onConfirm={async (e) => {
            const id = record.id;
            const isDelete = await deleteUser({id: id});
            if (isDelete) {
              message.success('删除成功');
              // 刷新用户信息表单
              location.reload();
            } else {
              message.error('删除失败');
            }
          }}
          onCancel={(e) => {
          }}
          okText="Yes"
          cancelText="No"
        >
          <Button type="link" danger>
            删除
          </Button>
        </Popconfirm>
      </a>,
    ],
  },
]

export default () => {
  const actionRef = useRef<ActionType>();
  return (
    <ProTable<API.CurrentUser>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      rowSelection={{
        alwaysShowAlert: true
      }}
      toolBarRender={(action, {selectedRows}) => [
        <ModalForm
          title="新建表单"
          trigger={<Button type="primary"><PlusOutlined/>添加</Button>}
          submitter={{
            searchConfig: {
              submitText: '确认',
              resetText: '取消',
            },
          }}
          onFinish={async (values) => {
            await waitTime(2000);
            console.log(values);
            message.success('提交成功');
            return true;
          }}
        >
          <ProFormText
            width="md"
            name="name"
            label="签约客户名称"
            tooltip="最长为 24 位"
            placeholder="请输入名称"
          />

          <ProFormText
            width="md"
            name="company"
            label="我方公司名称"
            placeholder="请输入名称"
          />
        </ModalForm>
      ]}
      // 获取后端的数据，返回到表格
      request={async (params = {}, sort, filter) => {
        await waitTime(2000);
        const userList = await searchUsers();
        return {data: userList};
      }}

      editable={{
        type: 'multiple',
      }}
      columnsState={{
        persistenceKey: 'pro-table-singe-demos',
        persistenceType: 'localStorage',
        onChange(value) {
          console.log('value: ', value);
        },
      }}
      rowKey="id"
      search={{
        labelWidth: 'auto',
      }}
      options={{
        setting: {
          // @ts-ignore
          listsHeight: 400,
        },
      }}
      form={{
        // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
        syncToUrl: (values, type) => {
          if (type === 'get') {
            return {
              ...values,
              created_at: [values.startTime, values.endTime],
            };
          }
          return values;
        },
      }}
      pagination={{
        pageSize: 5,
        onChange: (page) => console.log(page),
      }}
      dateFormatter="string"
      headerTitle="用户列表"
    >
    </ProTable>
  );
}

```



