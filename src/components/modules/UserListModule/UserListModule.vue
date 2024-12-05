<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { columns } from './column'
import DataTable from '@/components/modules/UserListModule/DataTable.vue'
import type { User, UserColumn } from '@/interfaces/user.interface'
import { useUserStore } from '@/stores/user'
import { toast } from 'vue-sonner'

const data = ref<UserColumn[]>([])
const userStore = useUserStore()

async function getData(): Promise<User[]> {
  // Fetch data from your API here.
  try {
    if (!userStore.accessToken) {
      throw new Error('Access token is missing')
    }

    let users: User[] = []
    const response: User[] | undefined = await userStore.getUsers(userStore.accessToken)
    if (response) {
      users = response
    }

    if (!users) {
      throw new Error('Failed to fetch users')
    }

    return users
  } catch (error) {
    throw new Error((error as Error).message)
  }
}
const fetchUsers = async () => {
  toast.promise(
    async () => {
      const users = await getData()

      data.value = users.map((item) => ({
        id: item.id,
        username: item.username,
        name: item.name,
        email: item.email,
        gender: item.gender,
        role: item.role,
      }))

      return users
    },
    {
      loading: 'Loading Users...',
      success: 'Users loaded successfully.',
      error: 'Failed to load users. Please try again.',
    },
  )
}

onMounted(fetchUsers)
</script>

<template>
  <div class="container py-10 mx-auto">
    <DataTable :columns="columns" :data="data" />
  </div>
</template>
