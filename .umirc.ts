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
  links: [{ rel: 'icon', href: '/book.svg' }],
  scripts: [
    'https://webapi.amap.com/maps?v=2.0&key=afbb14d219ab8177546eae44a24daa91&plugin=AMap.Geocoder',
    '/echarts.min.js',
    '/china.js',
  ],
  externals: {
    AMap: 'window.AMap',
    echarts: 'window.echarts',
  },
  routes: [
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
      path: '/statistics',
      component: './Statistics/SystemAdmin',
      name: '数据统计',
      access: 'canAuth',
    },
    // {
    //   name: '数据统计',
    //   path: '/library-admin/statistics',
    //   component: './Statistics/SystemAdmin',
    //   access: 'canLibraryAdminOnly',
    // },
    {
      path: '/library',
      component: './Library/List',
      name: '图书馆',
      access: 'canSystemAdmin',
    },
    {
      path: '/library/detail/:id',
      component: './Library/Detail/index',
      name: '图书馆详情',
      hideInMenu: true,
      access: 'canSystemAdmin',
    },
    {
      path: '/library/create',
      component: './Library/Create',
      hideInMenu: true,
      name: '创建图书馆',
      access: 'canSystemAdmin',
    },
    {
      path: '/register',
      component: './Auth/Register',
      name: '注册',
      layout: false,
    },
    {
      path: '/forget-password',
      component: './Auth/ForgetPassword',
      name: '忘记密码',
      layout: false,
    },
    {
      path: '/login',
      component: './Auth/Login',
      name: '登录',
      layout: false,
    },

    {
      name: '图书馆设置',
      path: '/location',
      component: './Library/Detail/detail',
      access: 'canLibraryAdminOnly',
    },
    {
      name: '图书馆藏书',
      path: '/books',
      component: './Book/index',
      access: 'canLibraryAdminOnly',
    },
    // {
    //   name: '图书分类',
    //   path: '/library/category',
    //   component: './Category/List',
    //   access: 'canSystemAdmin',
    //   key: 'system-admin-category',
    // },
    {
      name: '图书分类',
      path: '/category',
      component: './Category/List',
      access: 'canAuth',
      key: 'system-admin-category',
    },
    {
      path: '/library/borrowings',
      component: './Borrowings/index',
      breadcrumbName: '借阅管理',
      name: '借阅管理',
      access: 'canLibraryAdminOnly',
      key: 'library-admin-borrowings',
    },
    {
      path: '/library/reservations',
      component: './Reservations/index',
      name: '预订管理',
      access: 'canLibraryAdminOnly',
      key: 'library-admin-reservations',
    },
    {
      path: '/library/reservation-application',
      component: './ReservationApplication/index',
      name: '预约管理',
      access: 'canLibraryAdminOnly',
      key: 'library-admin-reservation-applicaiton',
    },
    {
      path: '/users',
      component: './User/List',
      name: '用户管理',
      access: 'canSystemAdmin',
    },
    {
      name: '系统设置',
      path: '/system-settings',
      component: './SystemSettings/SystemSettings',
      access: 'canSystemAdmin',
    },
    {
      path: '/reader',
      component: './Reader/index',
      name: '读者管理',
      access: 'canLibraryAdminOnly',
    },
    {
      path: '/',
      redirect: '/statistics',
      access: 'canAuth',
      // key: 'system-admin-statistics',
    },
    // {
    //   path: '/',
    //   redirect: '/library-admin/statistics',
    //   access: 'canLibraryAdminOnly',
    //   key: 'system-library-statistics',
    // },
    // {
    //   path: '/',
    //   redirect: '/system-admin/statistics',
    //   access: 'canSystemAdmin',
    // },
    // {
    //   name: '首页',
    //   path: '/home',
    //   component: './Home',
    // },
    // {
    //   name: '权限演示',
    //   path: '/access',
    //   component: './Access',
    // },
    // {
    //   name: ' CRUD 示例',
    //   path: '/table',
    //   component: './Table',
    // },
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
