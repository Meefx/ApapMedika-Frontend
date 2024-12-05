import './assets/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useUserStore } from './stores/user'
import { Role } from './interfaces/user.interface'
import { authRoutes } from './constants/router.constant'
import { toast } from 'vue-sonner'
import type { ValidateResponse } from './interfaces/auth.interface'

const app = createApp(App)

app.use(createPinia())
app.use(router)

const userStore = useUserStore()

console.log(userStore.user)

router.beforeEach((to, from, next) => {
  if (to.path != '/' && to.path != '/register' && to.path != '/login') {
    console.log(to.path != '/')
    console.log(to.path != '/register')
    console.log(to.path != '/login')
    console.log('sini', to.path)
    localStorage.setItem('page', to.path)
  }

  console.log(to.path)
  // console.log(to.meta)
  // console.log(userStore.user)
  // console.log(userStore.isLogged)
  // console.log(userStore.accessToken)

  if (userStore.user == null && localStorage.getItem('token') != null) {
    toast.promise(userStore.validate(router), {
      loading: 'Loading User Data...',
      success: (response: ValidateResponse | null) => response?.message,
      error: (error: Error) => error.message,
    })
  }

  const isMetaAvailable: boolean = !!to.meta && to.meta.requiresAuth

  // console.log(isMetaAvailable)

  if (!isMetaAvailable || authRoutes.includes(to.path)) {
    next()
    return
  }

  const isThisPageRequireAuth: boolean = to.meta.requiresAuth

  if (isThisPageRequireAuth && !userStore.isLogged) {
    console.log('HI')
    console.log('===================')

    next({
      path: '/login',
    })
    return
  } else {
    console.log('HELLO')

    if (!userStore.user) {
      console.log('TESA')
      console.log('===================')

      next({ path: '/login' })
      return
    } else if (
      to.meta &&
      (to.meta.role.includes(userStore.user.role) || to.meta.role.includes(Role.ALL))
    ) {
      console.log('TESU')
      console.log('===================')

      next()
      return
    }
  }
  // console.log('===================')

  return true
})

app.mount('#app')
