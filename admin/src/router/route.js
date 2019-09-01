
import Layout from 'src/pages/layout/layout';

// 不作为main组件子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: resolve => require(['src/pages/login/login'], resolve)
};

// 错误页面
export const errorRouter = {
    path: '/error/:code',
    name: 'error',
    meta: {
        title: 'error'
    },
    component: resolve => require(['src/pages/error/index'], resolve)
};

// 作为main组件子页面展示  但不在左侧菜单显示的路由卸载otherRoter里
export const otherRouter = {
    path: '',
    name: 'otherRouter',
    path: '/',
    title: '动态管理',
    meta: {
        requireAuth: true
    },
    component: Layout,
    children: [
        {
            path: '/home/:id',
            name: 'index',
            title: '活动资讯',
            component: resolve => require(['src/pages/home/index'], resolve)
        },
        {
            path: '/edit',
            name: 'edit',
            title: '资讯管理',
            component: resolve => require(['src/pages/home/edit'], resolve)
        }
    ]
};



export const routers = [
    loginRouter,
    errorRouter,
    otherRouter,
];
