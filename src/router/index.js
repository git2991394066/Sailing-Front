import Vue from 'vue'
import VueRouter from 'vue-router'
import * as cookies from '@/util/cookies'
Vue.use(VueRouter)

const routes = [

  // {
  //   path: '/about',
  //   name: 'About',
  //   component: () => import('@/views/About.vue')
  // },
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
    redirect: '/allProject'
  },
  {
    path: '/allproject',
    name: 'AllProject',
    component: () => import('@/views/AllProject.vue'),
    meta: {
      title: '所有项目',
      requireAuth: true
    }
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layout'),
    children: [
      {
        path: 'project',
        name: 'Project',
        component: () => import('@/views/Project.vue'),
        //配置需要有cookies才可以访问
        meta: {
          title: '项目首页',
          needAuth: true
        }
      },

      {
        path: 'testCase',
        name: 'TestCase',
        component: () => import('@/views/TestCase.vue'),
        meta: {
          title: '用例管理',
          requireAuth: true
        }
      },
      {
        path: 'interface',
        name: 'Interface',
        component: () => import('@/views/Interface.vue'),
        meta: {
          title: '接口管理',
          requireAuth: true
        }
      },
      {
        path: 'task',
        name: 'Task',
        component: () => import('@/views/Task.vue'),
        meta: {
          title: '任务管理',
          requireAuth: true
        }
      },
      {
        path: 'testRecord',
        name: 'TestRecord',
        component: () => import('@/views/TestRecord.vue'),
        meta: {
          title: '运行记录',
          requireAuth: true
        }
      },
      {
        path: 'testReport',
        name: 'TestReport',
        component: () => import('@/views/TestReport.vue'),
        meta: {
          title: '测试报告',
          requireAuth: true
        }
      },
      {
        path: 'dataAnalysis/:id?',
        name: 'DataAnalysis',
        component: () => import('@/views/DataAnalysis.vue'),
        meta: {
          title: '数据分析',
          requireAuth: true
        }
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/User.vue'),
        //配置需要有cookies才可以访问
        meta: {
          title: '用户管理',
          needAuth: true
        }
      },
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
