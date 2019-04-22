import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Welcome from '@/components/Welcome'

Vue.use(Router)

const router = new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'HelloWorld',
    //   component: HelloWorld
    // },
    {path:'/',redirect:'/home'},
    { path: '/login', component: Login },
    { path: '/home', component: Home,redirect:'/welcome', children:[
      {path:'/welcome',component:Welcome}
    ]
  }
  ]
})
// 路由守卫
router.beforeEach((to, from, next) => {
  var token = window.sessionStorage.getItem('token')
  if (token === null && to.path !== '/login') {
    return next('/login')
  }
  next() // 继续执行
})

export default router
