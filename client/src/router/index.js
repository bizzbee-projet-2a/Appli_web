import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Composant from '@/components/Composant'
import Login from '@/components/Login'
import Index from '@/components/Index'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/home',
      name: 'Home',
      component: Home,
      meta: {
        title: 'Bizzbee'
      }
    },
    {
      path: '/composant',
      name: 'Composant',
      component: Composant
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      name: 'Index',
      component: Index
    }
  ]
})
