import Vue from 'vue'
import VueRouter from 'vue-router'
import * as cookies from '@/util/cookies'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/user'
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   component: () => import('@/views/About.vue')
  // },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue')
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layout'),
    children: [
      {
        path: '/project',
        name: 'Project',
        component: () => import('@/views/Project.vue'),
        //配置需要有cookies才可以访问
        meta: {
          needAuth: true
        }
      },
      {
        path: '/user',
        name: 'User',
        component: () => import('@/views/User.vue'),
        //配置需要有cookies才可以访问
        meta: {
          needAuth: true
        }
      }
    ]
  },
  // {
  //   path: '/project',
  //   name: 'Project',
  //   component: () => import('@/views/Project.vue')
  // },
  // {
  //   path: '/register',
  //   name: 'Register',
  //   component: () => import('@/views/Register.vue')
  // },
  // {
  //   path: '/user',
  //   name: 'User',
  //   component: () => import('@/views/User.vue')
  // }
]

const router = new VueRouter({
  // mode: 'history',
  // base: process.env.BASE_URL,
  routes
})
//路由前拦截
router.beforeEach((to, from, next) => {
  if (to.matched.some(item => item.meta.needAuth == true)) {
    //表示需要进行路由鉴权
    let currentUser = cookies.getCurrentUser()
    if (currentUser) {
      //有登录，路由到下一个页面
      next()
    } else {
      //未登录，跳转到登录
      next({
        path: '/login',
        redirect: to.fullPath
      })
    }
  } else {
    next()
  }
})

export default router
