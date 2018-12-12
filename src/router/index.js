import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

let a = "documentation"
let b = "index"
  /** note: Submenu only appear when children.length>=1
   *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
   **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [{
  path: '/redirect',
  component: Layout,
  hidden: true,
  children: [{
    path: '/redirect/:path*',
    component: () =>
      import ('@/views/redirect/index')
  }]
}, {
  path: '/login',
  component: () =>
    import ('@/views/common/admin/login/index'),
  hidden: true
}, {
  path: '/auth-redirect',
  component: () =>
    import ('@/views/common/admin/login/authredirect'),
  hidden: true
}, {
  path: '/404',
  component: () =>
    import ('@/views/errorPage/404'),
  hidden: true
}, {
  path: '/401',
  component: () =>
    import ('@/views/errorPage/401'),
  hidden: true
}, {
  path: '/documentation',
  component: Layout,
  redirect: '/documentation/index',
  children: [{
    path: 'index',
    component: () =>
      import (
        `@/views/${a}/${b}`
      ),
    name: 'Documentation',
    meta: {
      title: 'documentation',
      icon: 'documentation',
      noCache: true
    }
  }]
}]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})

export const asyncRouterMap = [

  {
    path: '/icon',
    component: Layout,
    children: [{
      path: 'index',
      component: () =>
        import ('@/views/svg-icons/index'),
      name: 'Icons',
      meta: {
        title: 'icons',
        icon: 'icon',
        noCache: true
      }
    }]
  },


  {
    path: '/error',
    component: Layout,
    redirect: 'noredirect',
    name: 'ErrorPages',
    meta: {
      title: 'errorPages',
      icon: '404'
    },
    children: [{
      path: '401',
      component: () =>
        import ('@/views/errorPage/401'),
      name: 'Page401',
      meta: {
        title: 'page401',
        noCache: true
      }
    }, {
      path: '404',
      component: () =>
        import ('@/views/errorPage/404'),
      name: 'Page404',
      meta: {
        title: 'page404',
        noCache: true
      }
    }]
  },

  {
    path: '/error-log',
    component: Layout,
    redirect: 'noredirect',
    children: [{
      path: 'log',
      component: () =>
        import ('@/views/errorLog/index'),
      name: 'ErrorLog',
      meta: {
        title: 'errorLog',
        icon: 'bug'
      }
    }]
  },


  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]
