// 运行时配置

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
import { storage } from '@/utils/store';
import { BookTwoTone } from '@ant-design/icons';
import { RequestConfig } from '@umijs/max';
import { message } from 'antd';

export async function getInitialState(): Promise<{ name: string }> {
  return { name: '@umijs/max' };
}

export const layout = () => {
  return {
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
    errorHandler(error: any, opts) {
      console.log(error, 'error');
      const data = error?.response?.data as
        | API.Common.Result<unknown>
        | undefined;
      if (opts?.skipErrorHandler) throw error;
      if (data?.message) message.error(data?.message);
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
