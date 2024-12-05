<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { columns } from './column'
import DataTable from '@/components/modules/AppointmentListModule/DataTable.vue'
import type { AppointmentInterface, AppointmentColumn } from '@/interfaces/appointment.interface'
import { useAppointmentStore } from '@/stores/appointment'
import { useUserStore } from '@/stores/user'
import { toast } from 'vue-sonner'
import { Role } from '@/interfaces/user.interface'
import { Button } from '@/components/ui/button'

const data = ref<AppointmentColumn[]>([])
const fromDate = ref<string | null>(null)
const toDate = ref<string | null>(null)
const userStore = useUserStore()
const appointmentStore = useAppointmentStore()

async function getData(): Promise<AppointmentInterface[]> {
  // Fetch data from your API here.
  try {
    if (!userStore.accessToken) {
      throw new Error('Access token is missing')
    }

    if (!userStore.user) {
      throw new Error('User is missing')
    }

    let appointments: AppointmentInterface[] = []
    console.log('ID', userStore.user.id)
    if (userStore.user.role === Role.DOCTOR) {
      console.log('ROLE', userStore.user.role)
      appointments = await appointmentStore.getAppointments(
        userStore.accessToken,
        undefined,
        userStore.user.id,
        fromDate.value || undefined,
        toDate.value || undefined,
      )
    } else if (userStore.user.role === Role.PATIENT) {
      appointments = await appointmentStore.getAppointments(
        userStore.accessToken,
        userStore.user.id,
        undefined,
        fromDate.value || undefined,
        toDate.value || undefined,
      )
    } else {
      appointments = await appointmentStore.getAppointments(
        userStore.accessToken,
        undefined,
        undefined,
        fromDate.value || undefined,
        toDate.value || undefined,
      )
    }

    if (!appointments) {
      throw new Error('Failed to fetch appointments')
    }
    return appointments
  } catch (error) {
    throw new Error((error as Error).message)
  }
}
const fetchAppointments = async () => {
  toast.promise(
    async () => {
      const appointments = await getData()

      data.value = appointments.map((item) => ({
        idAppointment: item.id,
        doctorName: item.doctor.name,
        patientName: item.patient.name,
        date: item.date,
        status: item.status,
      }))

      return appointments
    },
    {
      loading: 'Loading Appointments...',
      success: 'Appointments loaded successfully.',
      error: 'Failed to load appointments. Please try again.',
    },
  )
}

onMounted(fetchAppointments)

watch([fromDate, toDate], fetchAppointments)
</script>

<template>
  <div class="container py-10 mx-auto">
    <div class="flex items-center gap-4 py-4">
      <div v-if="userStore.user?.role === Role.ADMIN">
        <RouterLink to="/appointment/create">
          <Button class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >Buat Appointment Baru</Button
          >
        </RouterLink>
      </div>
      <input
        type="date"
        v-model="fromDate"
        class="max-w-sm p-2 border rounded-md"
        placeholder="From Date"
      />
      <input
        type="date"
        v-model="toDate"
        class="max-w-sm p-2 border rounded-md"
        placeholder="To Date"
      />
    </div>
    <DataTable
      :columns="columns"
      :data="
        appointmentStore.appointments.map((appointment) => {
          return {
            idAppointment: appointment.id,
            doctorName: appointment.doctor.name,
            patientName: appointment.patient.name,
            date: appointment.date,
            status: appointment.status,
          }
        })
      "
    />
  </div>
</template>
