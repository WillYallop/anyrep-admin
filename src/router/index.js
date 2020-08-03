import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase/app';
import 'firebase/auth';

Vue.use(Router)

function lazyLoad(view){
  return() => import(`../views/${view}.vue`)
}

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior () {
    // very bad, maybe better use a Navigation Guard?
    document.getElementById('app').scrollIntoView();
    return null;
  },
  routes: [
    {
      path: '/',
      name: 'Home',
      component: lazyLoad('Home'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: lazyLoad('Login'),
      meta: {
          requiresGuest: true
      }
    },
    {
      path: '/addproduct',
      name: 'AddProduct',
      component: lazyLoad('AddProduct'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/liveproducts',
      name: 'LiveProducts', 
      component: lazyLoad('LiveProducts'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/editproduct/:product_id',
      name: 'EditProduct',
      component: lazyLoad('EditProduct'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/reservations',
      name: 'Reservations',
      component: lazyLoad('Reservations'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/userreservation/:reservation_id',
      name: 'UserReservation',
      component: lazyLoad('UserReservation'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/outofstock',
      name: 'OutOfStock',
      component: lazyLoad('OutOfStock'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '*',
      redirect: '/login'
    }

    
  ]
})


// Nav guards
router.beforeEach((to, from, next) => {
  //Check for required auth guard
  if(to.matched.some(record => record.meta.requiresAuth)) {
      //Check if not logged in
      if(!firebase.auth().currentUser) {
          //Go to login page
          next({
              path: '/login',
              query: {
                  redirect: to.fullPath
              }
          })
      } else {
          // Proceed to route
          next();
      }
  } else if(to.matched.some(record => record.meta.requiresGuest)) {
      //Check if is logged in
      if(firebase.auth().currentUser) {
          //Go to login page
          next({
              path: '/',
              query: {
                  redirect: to.fullPath
              }
          })
      } else {
          // Proceed to route
          next();
      }
  } else {
      // Proceed to route
      next();
  }
})

export default router