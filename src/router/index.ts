import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 路由懒加载
const Home = () => import('../views/Home.vue')
const ArticleDetail = () => import('../views/ArticleDetail.vue')
const Category = () => import('../views/Category.vue')
const Tag = () => import('../views/Tag.vue')
const Search = () => import('../views/Search.vue')
const Login = () => import('../views/Login.vue')
const Register = () => import('../views/Register.vue')
const UserCenter = () => import('../views/UserCenter.vue')

const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'Home', component: Home },
  { path: '/article/:id', name: 'ArticleDetail', component: ArticleDetail },
  { path: '/category', name: 'Category', component: Category },
  { path: '/category/:id', name: 'CategoryArticles', component: Category, props: true },
  { path: '/tag', name: 'Tag', component: Tag },
  { path: '/tag/:id', name: 'TagArticles', component: Tag, props: true },
  { path: '/search', name: 'Search', component: Search, props: route => ({ keyword: route.query.keyword }) },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { 
    path: '/user', 
    name: 'UserCenter', 
    component: UserCenter,
    meta: { requiresAuth: true } // 需要登录
  },
  { path: '/:pathMatch(.*)*', redirect: '/' } // 404路由
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  // 检查路由是否需要登录
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 从userStore中获取登录状态
    import('../stores/user').then(({ useUserStore }) => {
      const userStore = useUserStore()
      if (userStore.isLoggedIn) {
        next()
      } else {
        next({ name: 'Login', query: { redirect: to.fullPath } })
      }
    })
  } else {
    next()
  }
})

export default router
