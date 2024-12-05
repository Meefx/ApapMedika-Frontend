<script setup lang="ts">
import Header from '@/components/elements/Header/Header.vue'
import Breadcrumb from '@/components/ui/breadcrumb/Breadcrumb.vue'
import BreadcrumbList from '@/components/ui/breadcrumb/BreadcrumbList.vue'
import BreadcrumbItem from '@/components/ui/breadcrumb/BreadcrumbItem.vue'
import BreadcrumbLink from '@/components/ui/breadcrumb/BreadcrumbLink.vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PaidDataTable from '@/components/modules/ListBillModule/datatables/paid/PaidDataTable.vue'
import { useBillStore } from '@/stores/bill'
import type { Bill } from '@/interfaces/bill.interface'
import { onMounted, reactive } from 'vue'
import { toast } from 'vue-sonner'
import { paidColumns } from '@/components/modules/ListBillModule/datatables/paid/column'

const billStore = useBillStore()

const state = reactive<{
  isLoading: boolean
}>({
  isLoading: true,
})

async function getData(): Promise<Bill[]> {
  // Fetch data from your API here.
  try {
    return (await billStore.getAllBills()).data
  } catch (error) {
    throw new Error((error as Error).message)
  }
}

onMounted(async () => {
  toast.promise(getData(), {
    loading: 'Loading Bills...',
    success: () => {
      state.isLoading = false
      return 'Bills loaded successfully'
    },
    error: () => {
      state.isLoading = false
      return `Error loading Bills`
    },
  })
})
</script>

<template>
  <div>
    <Header>
      <template #breadcumb>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/bills"> Daftar Bill </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </template>
    </Header>

    <main class="m-4 p-4 bg-iron rounded-2xl min-h-screen">
      <h1>Daftar Bill</h1>

      <Tabs class="flex flex-col items-center" defaultValue="paid">
        <TabsList class="w-full max-w-[1000px] grid grid-cols-3">
          <TabsTrigger value="treatment_in_progress">Treatment in progress</TabsTrigger>
          <TabsTrigger value="unpaid">Unpaid</TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
        </TabsList>

        <TabsContent value="treatment_in_progress" class="w-full">
          <PaidDataTable
            :columns="paidColumns"
            :data="
              billStore.bills
                .filter((bill) => bill.status === 'TREATMENT_IN_PROGRESS')
                .map((bill, index) => ({
                  number: index + 1,
                  id: bill.id,
                  status: bill.status,
                }))
            "
            :isLoading="state.isLoading"
          />
        </TabsContent>

        <TabsContent value="paid" class="w-full">
          <PaidDataTable
            :columns="paidColumns"
            :data="
              billStore.bills
                .filter((bill) => bill.status === 'PAID')
                .map((bill, index) => ({
                  number: index + 1,
                  id: bill.id,
                  status: bill.status,
                }))
            "
            :isLoading="state.isLoading"
          />
        </TabsContent>

        <TabsContent value="unpaid" class="w-full">
          <PaidDataTable
            :columns="paidColumns"
            :data="
              billStore.bills
                .filter((bill) => bill.status === 'UNPAID')
                .map((bill, index) => ({
                  number: index + 1,
                  id: bill.id,
                  status: bill.status,
                }))
            "
            :isLoading="state.isLoading"
          />
        </TabsContent>
      </Tabs>
    </main>
  </div>
</template>
