import Vue from 'vue'

import Cookies from 'js-cookie'
import Element from 'element-ui'
import App from './App'
import Layout from '@/views/layout/Layout'
import Router from 'vue-router'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css
import '@/assets/common/style/iconfont.css' // global css
import '@/icons' // icon
import '@/permission' // permission control
import './errorLog' // error log
//import '@/assets/business/style/iconfont.css'//业务iconfont

import router from './router'
import store from './store'
import i18n from './lang' // Internationalization
import * as filters from './filters' // global filters
import {
  getToken, removeToken
}
from '@/utils/auth';
import {
  menuUserTree
}
from '@/api/common/menu'
import getImport from '@/utils/common/menuUtil'
Vue.use(Router)
Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

if (getToken()) {
  menuUserTree().then(response => {
    let accessedRouters = []
    let allEnum = []
    let result = response.result
    if (result) {
      result.forEach(function(val) {
        if (val) {
          let firstEnum = {}
          firstEnum.path = '/' + val.path
          firstEnum.component = Layout
          let children = val.children
          if (children) {
            firstEnum.name = val.id
            firstEnum.meta = {
              title: val.name,
              icon: val.icon,
              noCache: true
            }
            let secondList = []
            children.forEach(function(cval, index) {
              if (cval) {
                let secondEnum = {}
                secondEnum.name = cval.id
                let url = cval.url
                url = url.replace('list.html', 'index')
                url = url.replace('index.html', 'index')
                if (url.indexOf('admin') == 0) {
                  url = 'common/' + url
                }
                let urlList = url.split('/')
                secondEnum.path = cval.path
                if (index == 0) {
                  firstEnum.redirect = firstEnum.path + '/' +
                    secondEnum.path
                }
                secondEnum.component = () =>
                  getImport(urlList)
                secondEnum.meta = {
                  title: cval.name,
                  icon: cval.icon
                }
                secondList.push(secondEnum)
              }
            });
            firstEnum.children = secondList
          } else {
            let secondList = []
            let secondEnum = {}
            secondEnum.path = val.path
            secondEnum.name = val.id
            let url = val.url
            url = url.replace('list.html', 'index')
            url = url.replace('index.html', 'index')
            if (url.indexOf('admin') == 0) {
              url = 'common/' + url
            }
            firstEnum.redirect = '/' + firstEnum.path + '/' +
              secondEnum.path
            let urlList = url.split('/')
            secondEnum.component = () =>
              getImport(urlList)
            secondEnum.meta = {
              title: val.name,
              icon: val.icon,
              noCache: true
            }
            secondList.push(secondEnum)
            firstEnum.children = secondList
          }
          accessedRouters.push(firstEnum)
        }
      });
    }
    let cacheStore = store
      //.concat(routers)
    let routerList = [{
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
      path: '',
      component: Layout,
      redirect: 'dashboard',
      hidden: true,
      children: [{
        path: 'dashboard',
        component: () =>
          import ('@/views/common/admin/dashboard/index'),
        name: 'Dashboard',
        meta: {
          title: 'dashboard',
          icon: 'dashboard',
          noCache: true
        }
      }]
    }]
    let routers = routerList.concat(accessedRouters)
    cacheStore._modules.root._children.permission.state.routers = routers
    cacheStore._modules.root._children.permission.state.menuUserTree =
      result
    let cacheRouter = new Router({
      scrollBehavior: () => ({
        y: 0
      }),
      routes: routers
    })
    new Vue({
      el: '#app',
      router: cacheRouter,
      store: cacheStore,
      i18n,
      render: h => h(App)
    })
  }).catch((response) => {
    if (response.response.status == 401) {
      removeToken()
      new Vue({
        el: '#app',
        router,
        store,
        i18n,
        render: h => h(App)
      })
      window.location.href = '#/login'
    }
  })
} else {
  new Vue({
    el: '#app',
    router,
    store,
    i18n,
    render: h => h(App)
  })
}
