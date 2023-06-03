import Vue from 'vue'
import VueRouter from 'vue-router'

import home from '@/views/home-page.vue'
import user from '@/views/user-page.vue'
import Search from '@/views/search-nav.vue'
import Searching from '@/views/search-ing.vue'
import Channel from '@/views/channel-nav.vue'
import Detail from '@/views/detail-list.vue'
import login from '@/views/login-zhu.vue'
import editor from '@/views/editor-page.vue'
import chatAi from '@/views/chat-ai.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', component: home },
  { path: '/login', component: login },
  { path: '/search', component: Search },
  { path: '/search/searching', name: 'searching', component: Searching },
  {
    path: '/user',
    component: user
  },
  { path: '/channel', component: Channel, name: 'channel' },
  { path: '/detail/:id', component: Detail },
  { path: '/user/editor', component: editor },
  { path: '/user/chatAi', component: chatAi }
]

const router = new VueRouter({
  routes
})

// router.beforeEach((to, from, next) => {
//   if (from.path === '/search/searching') {
//     next('/search')
//   } else {
//     next()
//   }
// })
// 通过路由前置守卫来判断用户的登陆状态，有token就允许去主页，
// 没有token就不允许去主页
router.beforeEach((to, from, next) => {
  if (to.path === '/') {
    const token = sessionStorage.getItem('token')
    if (token) {
      next()
      if (to.path === '/login') {
        sessionStorage.removeItem('token')
      }
    } else {
      next('/login')
    }
  } else {
    next()
  }
})
export default router
