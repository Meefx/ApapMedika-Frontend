<script setup lang="ts">
import { reactive } from 'vue'
import { useAppointmentStore } from '@/stores/appointment'
import { useUserStore } from '@/stores/user'
import AppointmentForm from '@/components/modules/AppointmentListModule/Form/AppointmentForm.vue'
import type { AppointmentRequestInterface } from '@/interfaces/appointment.interface'
import Header from '@/components/elements/Header/Header.vue'
import Breadcrumb from '@/components/ui/breadcrumb/Breadcrumb.vue'
import BreadcrumbList from '@/components/ui/breadcrumb/BreadcrumbList.vue'
import BreadcrumbItem from '@/components/ui/breadcrumb/BreadcrumbItem.vue'
import BreadcrumbLink from '@/components/ui/breadcrumb/BreadcrumbLink.vue'
import { toast } from 'vue-sonner'
import { useRouter } from 'vue-router'
import type { FetchBaseResponse } from '@/utils/customFetch/interface'

const appointmentStore = useAppointmentStore()
const userStore = useUserStore()
const router = useRouter()

const appointmentModel = reactive({
  patientId: '',
  doctorId: '',
  date: '',
})

const createAppointment = async (bodyRequest: AppointmentRequestInterface) => {
  if (userStore.accessToken) {
    toast.promise(appointmentStore.createAppointment(bodyRequest), {
      loading: 'Creating appointment...',
      success: () => {
        router.push('/appointment')
        return 'Appointment created successfully'
      },
      error: (data: FetchBaseResponse) => {
        return data.message
      },
    })
  } else {
    console.error('Access token is missing')
  }
}
</script>

<template>
  <div>
    <Header>
      <template #breadcumb>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/account"> Account </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </template>
    </Header>

    <main class="w-full h-screen flex justify-center items-center bg-gray400/30">
      <div class="w-[60%] flex flex-col gap-2 divide-y-2 bg-white drops-shadow-xl p-6 rounded-xl">
        <div class="w-full flex justify-between">
          <h1 class="text-green-600 font-bold text-xl">Create Appointment</h1>
        </div>
        <AppointmentForm :appointmentModel="appointmentModel" :action="createAppointment" />
      </div>
    </main>
  </div>
</template>
