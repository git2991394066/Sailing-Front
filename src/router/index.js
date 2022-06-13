import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/layout';

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'),
    meta: {
      title: '注册'
    }
  },
  {
    path: '/',
    name: 'Home',
    redirect: '/project'
  },
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: 'Project',
        name: 'Project',
        component: () => import('@/views/Project.vue'),
        meta: {
          title: '项目首页',
          requireAuth: true
        }
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/User.vue'),
        meta: {
          title: '用户管理',
          requireAuth: true
        }
      }
    ]
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requireAuth)) {
    //【JWT】2、路由时，使用LocalStorage中的用户信息进行鉴权
    let currentUser = window.localStorage.getItem('current-user')
    console.log(currentUser)
    if (currentUser) {
      next()
    } else {
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
