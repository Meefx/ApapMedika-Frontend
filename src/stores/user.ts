import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ValidateResponse,
} from '@/interfaces/auth.interface'
import type { CommonResponseInterface } from '@/interfaces/common.interface'
import { Gender, Role, type UserState, type User } from '@/interfaces/user.interface'
import { cleanStores } from '@/utils/cleanStores'
import { customFetch, customFetchBody } from '@/utils/customFetch'
import { defineStore } from 'pinia'
import { type Router } from 'vue-router'

const { VITE_PROFILE_API } = import.meta.env

export const useUserStore = defineStore('user', {
  state: () =>
    ({
      user: null,
      isLogged: false,
      accessToken: null,
    }) as UserState,
  actions: {
    async login(router: Router, { email, password }: LoginRequest): Promise<LoginResponse> {
      const response = await customFetch<LoginResponse>(`${VITE_PROFILE_API}/api/auth/login`, {
        uploadFile: false,
        isAuthorized: false,
        method: 'POST',
        body: customFetchBody({ email, password }),
      })

      if (response.status < 200 || response.status >= 300) {
        throw new Error(response.message)
      }

      localStorage.setItem('token', response.data!.token)

      this.isLogged = true
      this.user = {
        id: response.data!.user.id,
        name: response.data!.user.name,
        email: response.data!.user.email,
        username: response.data!.user.username,
        role: Object.values(Role).find((role) => role === response.data!.user.role) as Role,
        gender: response.data!.user.gender == 'FEMALE' ? Gender.FEMALE : Gender.MALE,
      }
      this.accessToken = response.data!.token
      // console.log(this.user.id)
      console.log(this.accessToken)
      console.log(this.user)

      router.push('/dashboard')

      return response
    },

    async register(
      router: Router,
      { email, gender, name, password, role, username, ...others }: RegisterRequest,
    ): Promise<RegisterResponse> {
      const response: RegisterResponse = await customFetch(
        `${VITE_PROFILE_API}/api/auth/register`,
        {
          uploadFile: false,
          isAuthorized: false,
          method: 'POST',
          body: customFetchBody({ email, gender, name, password, role, username, ...others }),
        },
      )

      console.log(response)

      if (response.status < 200 || response.status >= 300) {
        throw new Error(response.message)
      }

      localStorage.setItem('token', response.data!.token)

      this.isLogged = true
      this.user = {
        id: response.data!.user.id,
        name: response.data!.user.name,
        email: response.data!.user.email,
        username: response.data!.user.username,
        role: Object.values(Role).find((role) => role === response.data!.user.role) as Role,
        gender: response.data!.user.gender == 'FEMALE' ? Gender.FEMALE : Gender.MALE,
      }

      router.push('/dashboard')

      return response
    },

    async logout(router: Router): Promise<void> {
      localStorage.removeItem('token')

      this.isLogged = false
      this.user = null

      cleanStores()

      router.push('/login')
    },

    async validate(router: Router): Promise<ValidateResponse | null> {
      if (localStorage.getItem('token') == null) {
        this.isLogged = false
        this.user = null
        return null
      }

      // localStorage.setItem('page', router.currentRoute.value.path)

      const response = await customFetch<ValidateResponse>(
        `${VITE_PROFILE_API}/api/auth/validate`,
        {
          uploadFile: false,
          isAuthorized: true,
        },
      )

      if (response.status < 200 || response.status >= 300) {
        localStorage.removeItem('token')
        router.push('/login')
        throw new Error(response.message)
      }

      this.isLogged = true
      this.user = {
        id: response.data!.id,
        name: response.data!.name,
        email: response.data!.email,
        username: response.data!.username,
        role: Object.values(Role).find((role) => role === response.data!.role) as Role,
        gender: response.data!.gender == 'FEMALE' ? Gender.FEMALE : Gender.MALE,
      }

      this.accessToken = localStorage.getItem('token')

      const previousPage = localStorage.getItem('page')
      console.log('previous page', previousPage)
      localStorage.removeItem('page')
      if (previousPage == null) {
        router.push('/dashboard')
      } else {
        router.push(previousPage)
      }
      router.push('/dashboard')

      return response
    },

    async getUsers(bearerToken: string): Promise<User[] | undefined> {
      try {
        const url = `${import.meta.env.VITE_PROFILE_API}/api/users`

        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${bearerToken}`,
          },
        })

        const data: CommonResponseInterface<User[]> = await response.json()
        this.users = data.data
        return data.data
      } catch (err) {
        this.error = `Gagal mengambil user ${err}`
      } finally {
        this.loading = false
      }
    },
  },
})
