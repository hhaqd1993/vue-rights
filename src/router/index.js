import Vue from 'vue'
import Router from 'vue-router'

// 导入Login组件
import Login from '@/components/Login.vue'

// 导入Home组件
import Home from '@/components/Home.vue'

// 导入Users组件
import Users from '@/components/users/Users.vue'

// 导入Rights组件
import Rights from '@/components/rights/rights.vue'

// 导入Roles组件
import Roles from '@/components/rights/Roles.vue'

// 导入商品分类组件
import Categories from '@/components/products/Categories.vue'

// 导入goods组件
import Goods from '@/components/products/Goods.vue'

// 导入商品添加组件
import Add from '@/components/products/Add.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      // 嵌套路由1：通过children给某个路由配置子路由
      // 嵌套路由2：给子路由配置一个出口
      children: [
        {
          // 可以匹配 /users/xxx
          path: '/users',
          component: Users
        },
        {
          path: '/rights',
          component: Rights
        },
        {
          path: '/roles',
          component: Roles
        },
        {
          path: '/categories',
          component: Categories
        },
        {
          path: '/goods',
          component: Goods
        },
        {
          path: '/goods-add',
          component: Add
        }
      ]
    }
  ]
})

// 给路由对象设置导航守卫
// to: 去哪儿
// from: 从哪儿来
// next() : 指定跳转到哪个组件  next():表示放行  next(false)  next('/login')
router.beforeEach((to, from, next) => {
  // console.log(to, from, next)
  // 判断是否有token
  const token = localStorage.getItem('token')
  // console.log(to.path)
  if (to.path === '/login' || token) {
    // 有token 放行
    next()
  } else {
    // 没有token, 去登录
    next('/login')
  }
})

// 导出路由对象
export default router
