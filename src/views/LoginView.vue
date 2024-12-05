<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { LoginRequest } from '@/interfaces/auth.interface'
import { useUserStore } from '@/stores/user'
import { RouterLink, useRouter } from 'vue-router'
import { reactive } from 'vue'
import { toast } from 'vue-sonner'

const userStore = useUserStore()
const router = useRouter()

const state = reactive({
  email: '',
  password: '',
})

const login = async () => {
  const body: LoginRequest = {
    email: state.email,
    password: state.password,
  }
  toast.promise(userStore.login(router, body), {
    loading: 'Logging in...',
    success: 'Logged in successfully.',
    error: 'Failed to login. Please try again.',
  })
}
</script>

<template>
  <div class="grid place-items-center min-h-screen">
    <Card class="w-[350px]">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Log in to your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div class="grid items-center w-full gap-4">
            <div class="flex flex-col space-y-1.5">
              <Label for="email">Email</Label>
              <Input
                id="email"
                placeholder="john.doe@mail.com"
                type="email"
                v-model="state.email"
              />
            </div>
            <div class="flex flex-col space-y-1.5">
              <Label for="password">Password</Label>
              <Input id="password" type="password" v-model="state.password" />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter class="flex justify-between px-6 pb-6">
        <RouterLink to="/register">
          <Button variant="outline">Go to register page</Button>
        </RouterLink>
        <Button @click="login">Login</Button>
      </CardFooter>
    </Card>
  </div>
</template>
