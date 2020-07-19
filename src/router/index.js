import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: () => import('../views/SignUp.vue')
  },
  {
    path: '/user-dashboard/:id',
    name: 'UserDashboard',
    component: () => import('../views/UserDashboard.vue')
  },
  {
    path: '/admin-dashboard-e4ufh3',
    name: 'AdminDashboard',
    component: () => import('../views/admin/AdminDashboard.vue')
  },
  {
    path: '/admin-withdrawals',
    name: 'AdminWithdrawals',
    component: () => import('../views/admin/AdminWithdrawals.vue')
  },
  {
    path: '/admin-payments',
    name: 'AdminPayments',
    component: () => import('../views/admin/AdminPayments.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
