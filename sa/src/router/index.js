import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Login from '@/components/auth/Login'
import Signup from '@/components/auth/Signup'
import firebase from 'firebase'
import Wall from '@/components/wall/Wall'
import Update from '@/components/wall/Update'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta:{
        requireAuth: true
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/signup',
      name:'Signup',
      component: Signup
    },
    {
      path:'/wall/:id',
      name:'Wall',
      component:Wall,
      meta:{
        requireAuth: true
      }
    },
    {
      path:'/update',
      name:'Update',
      component:Update,
      meta:{
        requireAuth: true
      }
    }
  ]
})
/* This is an example, has worked really well for several projects */
router.beforeEach((to, from, next) => {
  //check to see if router requires auth
  if(to.matched.some(rec => rec.meta.requireAuth)){
    //check auth state of user
    let user = firebase.auth().currentUser
    if(user){
      //user signed in, proceed route
      next()
    } else{
      //no user signed in, redirect to login
      next({name: 'Login'})
    }
  } else{
    next()
  }
})

export default router