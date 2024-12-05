<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { columns } from './column'
import { toast } from 'vue-sonner'
import type { PrescriptionInterface } from '@/interfaces/prescription.interface'
import { usePrescriptionStore } from '@/stores/prescription'
import PrescriptionDataTable from './PrescriptionDataTable.vue'

const prescriptionStore = usePrescriptionStore()

const state = reactive<{
  isLoading: boolean
}>({
  isLoading: true,
})

async function getData(): Promise<PrescriptionInterface[]> {
  const prescriptionStore = usePrescriptionStore()

  // Fetch data from your API here.
  try {
    return (await prescriptionStore.getPrescriptions({})).data
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
      loading: 'Fetching Prescriptions...',
      success: () => {
        state.isLoading = false
        return 'Prescriptions fetched successfully.'
      },
      error: () => {
        state.isLoading = false
        return 'Failed to fetch prescriptions. Please try again.'
      },
    },
  )
})
</script>

<template>
  <div class="container py-10 mx-auto flex flex-col gap-2">

    <PrescriptionDataTable
      :columns="columns"
      :data="
        prescriptionStore.prescriptions.map((prescription) => ({
          idPrescription: prescription.id,
          createdDate: prescription.createdDate,
          patientName: prescription.appointment.patient.name,
          totalPrice: prescription.totalPrice,
          status: prescription.status,
        }))
      "
      :is-loading="state.isLoading"
    />
  </div>
</template>
