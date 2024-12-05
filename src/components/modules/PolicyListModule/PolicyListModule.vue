<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { columns } from './column'
import PolicyDataTable from '@/components/modules/PolicyListModule/PolicyDataTable.vue'
import type { Policy } from '@/interfaces/policy.interface'
import { usePolicyStore } from '@/stores/policy'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { useUserStore } from '@/stores/user'
import { Role } from '@/interfaces/user.interface'

const policyStore = usePolicyStore()

const state = reactive<{
  isLoading: boolean
}>({
  isLoading: true,
})

async function getData(): Promise<Policy[]> {
  const policyStore = usePolicyStore()

  // Fetch data from your API here.
  try {
    return (await policyStore.getAllPolicies({})).data
  } catch (error) {
    throw new Error((error as Error).message)
  }
}

onMounted(async () => {
  toast.promise(
    async () => {
      return await getData()
    },
    {
      loading: 'Loading Policies...',
      success: () => {
        state.isLoading = false
        return 'Policies loaded successfully.'
      },
      error: () => {
        state.isLoading = false
        return 'Failed to load policies. Please try again.'
      },
    },
  )
})
</script>

<template>
  <div class="container py-10 mx-auto flex flex-col gap-2">
    <div class="w-full flex justify-end" v-if="useUserStore().user?.role === Role.ADMIN">
      <Button variant="secondary" as-child>
        <RouterLink to="/policies/new">Buat Policy</RouterLink>
      </Button>
    </div>

    <PolicyDataTable
      :columns="columns"
      :data="
        policyStore.policies.map((item) => ({
          idPolicy: item.id,
          patientName: item.patient.name,
          companyName: item.company.name,
          totalCoverage: item.totalCoverage,
          status: item.status,
        }))
      "
      :is-loading="state.isLoading"
    />
  </div>
</template>
