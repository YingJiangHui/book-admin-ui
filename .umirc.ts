import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '图书馆管理系统',
  },
  routes: [
    { path: '/register', component: './Access', layout: false },
    {
      path: '/forget-password',
      component: './Auth/ForgetPassword',
      layout: false,
    },
    {
      path: '/login',
      component: './Auth/Login',
      layout: false,
    },
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
    },
    {
      name: '权限演示',
      path: '/access',
      component: './Access',
    },
    {
      name: ' CRUD 示例',
      path: '/table',
      component: './Table',
    },
  ],
  npmClient: 'pnpm',
  proxy: {
    '/api': {
      target: 'http://localhost:8099',
      changeOrigin: true,
      // 'pathRewrite': { '^/api' : '' },
    },
  },
});
