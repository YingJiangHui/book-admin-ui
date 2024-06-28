// 运行时配置

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
import { Constants } from '@/constants';
import { logoutUser } from '@/services/auth';
import { getUserInfo } from '@/services/user';
import { toLogin } from '@/utils/helpers';
import { storage } from '@/utils/store';
import { useAccess, useModel } from '@@/exports';
import { DownOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { ProLayoutProps } from '@ant-design/pro-components';
import { RequestConfig } from '@umijs/max';
import { Dropdown, MenuProps, Space, Tag, message } from 'antd';
import { AxiosError } from 'axios';
import React, { useMemo } from 'react';

const defaultInitialState: System.InitialState = { name: '图书管理系统' };

export async function getInitialState(): Promise<System.InitialState> {
  const token = storage.get('token');
  if (!token) {
    toLogin();
    return defaultInitialState;
  }
  const res = await getUserInfo(
    window.location.pathname === '/login'
      ? { skipErrorHandler: true }
      : undefined,
  )
    .then((res) => {
      if (
        !res.data.roles.find(
          (role) => role === Constants.Role.RoleEnum.LIBRARY_ADMIN,
        )
      )
        return res;
      if (res.data.managedLibraries?.[0])
        storage.set(
          'current-library',
          JSON.stringify(res.data.managedLibraries?.[0]),
        );
      return { ...res };
    })
    .catch((res) => {
      // toLogin();
      return null;
    });

  return { ...defaultInitialState, user: res?.data, token };
}

export const layout = (props: {
  initialState: System.InitialState;
}): ProLayoutProps => {
  const access = useAccess();
  const { refresh } = useModel('@@initialState');
  const { selectedLibrary, setSelectedLibrary } = useModel('currentLibrary');
  const items: MenuProps['items'] =
    props.initialState.user?.managedLibraries?.map((item) => ({
      key: item.id.toString(),
      label: item.name,
      onClick: () => setSelectedLibrary(item),
      // disabled: item.closed,
    }));
  const title = useMemo(() => {
    if (access.canSystemAdmin) {
      return props.initialState.name;
    }

    if (access.canLibraryAdmin) {
      return selectedLibrary?.name;
    }

    return props.initialState.name;
  }, [access, props.initialState.name, selectedLibrary]);
  return {
    avatarProps: {
      size: 'small',
      icon: <UserOutlined />,
      title: (
        <Space direction={'vertical'}>
          {props.initialState.user?.email}
          {access.canLibraryAdminOnly ? (
            <Space size={'small'} wrap>
              <Tag>图书馆管理员</Tag>
            </Space>
          ) : access.canSystemAdmin ? (
            <Space size={'small'} wrap>
              <Tag>系统管理员</Tag>
            </Space>
          ) : undefined}
        </Space>
      ),

      render: (props, dom) => {
        return (
          <Dropdown
            menu={{
              items: [
                {
                  key: 'logout',
                  icon: <LogoutOutlined />,
                  label: '退出登录',
                  // src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
                  onClick: () => {
                    logoutUser().then(refresh).then(toLogin);
                  },
                },
              ],
            }}
          >
            {dom}
          </Dropdown>
        );
      },
    },
    // menuFooterRender: (props) => {
    //   if (props?.collapsed) return undefined;
    //   return (
    //     <div
    //       style={{
    //         textAlign: 'center',
    //         paddingBlockStart: 12,
    //       }}
    //     >
    //       <div>© 2021 Made with love</div>
    //       <div>by Ant Design</div>
    //     </div>
    //   );
    // },
    breadcrumbRender: (routes) => {
      // `routes` 是一个包含所有路由信息的数组
      // 你可以在这里自定义面包屑的渲染方式
      return routes;
    },
    rightContentRender: false,
    title: title as any,
    logo: <img src={'/book.svg'} width={20} />,
    menuHeaderRender: (logo, title) => {
      console.log(title, 'title');
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
              {/*{selectedLibrary?.name || '无可用图书馆'}*/}
              {logo}
              <h1 style={{ fontSize: 16, fontWeight: 'bold' }}>
                {title?.props?.children}
              </h1>{' '}
              <DownOutlined />
            </Space>
          </Dropdown>
        </div>
      );
    },
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
      // if (
      //   error.response.status === 401 &&
      //   window.location.pathname === '/login'
      // ) {
      //   throw error.response.data;
      // }

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
