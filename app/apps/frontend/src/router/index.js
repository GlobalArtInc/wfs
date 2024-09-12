import Vue from 'vue'
import Router from 'vue-router'
/* Layout */
import Layout from '@/layouts/layout'
import L from '@/layouts/l'
import AdminLayout from '@/layouts/admin'
import Player from '@/layouts/Player'

Vue.use(Router)

/* Router Modules */
// import componentsRouter from './modules/components'

// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

export const constantRoutes = [
    {
        path: '/',
        component: Layout,
        children: [
            {
                meta: {
                    hideTitle: true,
                    title: "WarFace Discord Bot"
                },
                path: '',
                component: () => import('@/views/home/index'), hidden: true
            }
        ]
    },
    {
        path: '/dashboard',
        component: Layout,
        children: [
            {
                path: '',
                component: () => import('@/views/dashboard'),
                meta: {protected: true, title: "Мои сервера"}
            },
            {
                path: ':guild_id',
                component: () => import('@/views/dashboard/edit'),
                meta: {protected: true, title: "Управление сервером"}
            }
        ]
    },
    {
        path: '/stats',
        component: Layout,
        children: [
            {
                path: ':name',
                component: Player,
                props: true,
                children: [
                    {
                        name: 'statsView',
                        props: true,
                        path: 'view',
                        component: () => import('@/views/stats/View')
                    },
                    {
                        name: 'statsPVP',
                        props: true,
                        path: 'pvp',
                        component: () => import('@/views/stats/PVP')
                    },
                    {
                        name: 'statsHistory',
                        props: true,
                        path: 'history',
                        component: () => import('@/views/stats/History')
                    }
                ]
            },
            {
                path: '',
                component: () => import('@/views/stats/Search')
            }
        ]
    },
    {
        path: '/match_page',
        component: Layout,
        children: [
            {
                props: true,
                path: ':id',
                component: () => import('@/views/matchPage/View'),
                meta: {protected: false, title: "Статистика матча"}
            }
        ]
    },
    {
        path: '/admin',
        component: AdminLayout,
        children: [
            {
                path: 'servers',
                component: L,
                children: [
                    {
                        path: '',
                        component: () => import('@/views/admin/servers')
                    }
                ]
            },
            {
                path: 'admins',
                component: L,
                children: [
                    {
                        path: '',
                        component: () => import('@/views/admin/admins')
                    }
                ]
            },
            {
                path: '',
                component: () => import('@/views/admin')
            }
        ]
    },
    {
        path: '/linked',
        component: Layout,
        children: [
            {
                path: '',
                component: () => import('@/views/dashboard/linked'),
                meta: {protected: true, meta: "Привязанные аккаунты"}
            }
        ]
    },
    {path: '*', hidden: true}
]

const createRouter = () =>
    new Router({
        mode: "history",
        scrollBehavior: () => ({y: 0}),
        routes: constantRoutes
    })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router
