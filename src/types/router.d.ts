import 'vue-router'
import { Role } from '@/interfaces/user.interface'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth: boolean // Indicates if route requires authentication
    role: Role[] // Define other meta properties here, like a user role
    useSidebar?: boolean
  }
}
