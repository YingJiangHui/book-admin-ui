import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {
    // dataField: 'data',
  },
  layout: {
    title: '图书馆管理系统',
  },
  headScripts: [
    {
      content: `
    window._AMapSecurityConfig = {
          securityJsCode:'1a7f253a897308b74dc0f3d859b7f78f',
    }`,
      charset: 'utf-8',
    },
  ],
  scripts: [
    'https://webapi.amap.com/maps?v=2.0&key=afbb14d219ab8177546eae44a24daa91',
  ],
  externals: {
    AMap: 'window.AMap',
  },
  routes: [
    {},
    // {
    //   path: '/library',
    //   name: '图书馆',
    //   access: 'canSystemAdmin',
    //
    //   routes: [
    //
    //     // {
    //     //   path: '/library',
    //     //   component: './Library/List',
    //     //   name: '图书馆',
    //     // },
    //   ],
    // },
    {
      path: '/library',
      component: './Library/List',
      name: '图书馆',
    },
    {
      path: '/library/detail/:id',
      component: './Library/Detail',
      name: '图书馆详情',
      //   在侧边栏隐藏
      hideInMenu: true,
    },
    {
      path: '/library/create',
      component: './Library/Create',
      hideInMenu: true,
      name: '创建图书馆',
    },
    { path: '/register', component: './Auth/Register', layout: false },
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
