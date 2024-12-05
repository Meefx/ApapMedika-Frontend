<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { columns } from './column'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { useUserStore } from '@/stores/user'
import { Role } from '@/interfaces/user.interface'
import { useMedicineStore } from '@/stores/medicine'
import type { MedicineInterface } from '@/interfaces/medicine.interface'
import MedicineDataTable from './MedicineDataTable.vue'

const medicineStore = useMedicineStore()

const state = reactive<{
  isLoading: boolean
}>({
  isLoading: true,
})

async function getData(): Promise<MedicineInterface[]> {
  const medicineStore = useMedicineStore()

  // Fetch data from your API here.
  try {
    return (await medicineStore.getMedicines()).data
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
      loading: 'Fetching Medicines...',
      success: () => {
        state.isLoading = false
        return 'Medicines fetched successfully.'
      },
      error: () => {
        state.isLoading = false
        return 'Failed to fetch medicines. Please try again.'
      },
    },
  )
})
</script>

<template>
  <div class="container py-10 mx-auto flex flex-col gap-2">
    <div class="w-full flex justify-end" v-if="useUserStore().user?.role === Role.PHARMACIST">
      <Button variant="secondary" as-child>
        <RouterLink to="/medicines/create">Add Medicine</RouterLink>
      </Button>
    </div>

    <MedicineDataTable
      :columns="columns"
      :data="
        medicineStore.medicines.map((medicine) => ({
          idMedicine: medicine.id,
          medicineName: medicine.name,
          medicineStock: medicine.stock,
          medicinePrice: medicine.price,
        }))
      "
      :is-loading="state.isLoading"
    />
  </div>
</template>
