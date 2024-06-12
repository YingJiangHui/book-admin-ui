// 运行时配置

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
import { getUserInfo } from '@/services/user';
import { toLogin } from '@/utils/helpers';
import { storage } from '@/utils/store';
import { useAccess, useModel } from '@@/exports';
import { BookTwoTone, DownOutlined } from '@ant-design/icons';
import { ProLayoutProps } from '@ant-design/pro-components';
import { RequestConfig } from '@umijs/max';
import { Dropdown, MenuProps, Space, message } from 'antd';
import { AxiosError } from 'axios';
import React, { useMemo } from 'react';

const defaultInitialState: System.InitialState = { name: '图书管理系统' };
export async function getInitialState(): Promise<System.InitialState> {
  const token = storage.get('token');
  if (!token) {
    toLogin();
    return defaultInitialState;
  }
  const res = await getUserInfo().catch(() => {
    // toLogin();
    return null;
  });
  return { ...defaultInitialState, user: res?.data, token };
}

export const layout = (props: {
  initialState: System.InitialState;
}): ProLayoutProps => {
  const access = useAccess();
  const { selectedLibrary, setSelectedLibrary } = useModel('currentLibrary');
  const items: MenuProps['items'] =
    props.initialState.user?.managedLibraries?.map((item) => ({
      key: item.id.toString(),
      label: item.name,
      onClick: () => setSelectedLibrary(item),
      disabled: item.closed,
    }));
  console.log(props, 'props');
  const title = useMemo(() => {
    if (access.canSystemAdmin) {
      return props.initialState.name;
    }

    if (access.canLibraryAdmin) {
      return (
        <div style={{ padding: -16 }} onClick={(e) => e.stopPropagation()}>
          <Dropdown
            trigger={['click']}
            menu={{
              items,
              selectable: true,
              activeKey: selectedLibrary?.id.toString(),
            }}
          >
            <Space align={'baseline'}>
              {selectedLibrary?.name}
              <DownOutlined />
            </Space>
          </Dropdown>
        </div>
      );
    }
  }, [access, props.initialState.name]);
  return {
    breadcrumbRender: (routes) => {
      // `routes` 是一个包含所有路由信息的数组
      // 你可以在这里自定义面包屑的渲染方式
      return routes;
    },
    title: title as any,
    logo: <BookTwoTone />,
    menu: {
      locale: false,
    },
  };
};

export const request: RequestConfig = {
  timeout: 2000,
  // other axios options you want
  errorConfig: {
    errorHandler(error: AxiosError, opts) {
      console.log(error, 'error');

      const data = error?.response?.data as
        | API.Common.Result<unknown>
        | undefined;
      if (opts?.skipErrorHandler) throw error;
      const statusMap: Record<number, () => any> = {
        401: () => (
          <Space size={'small'} align={'center'}>
            {data?.message}
            <a onClick={toLogin}>立即登录</a>
          </Space>
        ),
        403: () => (
          <Space size={'small'} align={'center'}>
            {data?.message}
            <a onClick={toLogin}>切换账号</a>
          </Space>
        ),
      };
      const result = statusMap[error.response.status as number]?.();
      if (
        error.response.status === 401 &&
        window.location.pathname === '/login'
      ) {
        throw error.response.data;
      }

      if (React.isValidElement(result)) {
        message.error(result);
      } else {
        message.error(data?.message);
      }

      throw error.response.data;
    },
    errorThrower(e) {},
  },
  requestInterceptors: [
    (url, config) => {
      const token = storage.get('token');
      return {
        url: url,
        options: {
          ...config,
          headers: {
            ...config.headers,
            Authorization: token ? `Bearer ${token}` : '',
          },
        },
      };
    },
  ],
};
