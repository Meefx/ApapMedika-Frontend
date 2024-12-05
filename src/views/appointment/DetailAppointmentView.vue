<script setup lang="ts">
import Header from '@/components/elements/Header/Header.vue'
import Breadcrumb from '@/components/ui/breadcrumb/Breadcrumb.vue'
import BreadcrumbList from '@/components/ui/breadcrumb/BreadcrumbList.vue'
import BreadcrumbItem from '@/components/ui/breadcrumb/BreadcrumbItem.vue'
import BreadcrumbLink from '@/components/ui/breadcrumb/BreadcrumbLink.vue'
import { useRoute, useRouter } from 'vue-router'
import type { AppointmentInterface } from '@/interfaces/appointment.interface'
import type { Reservation } from '../../interfaces/reservation.interface'
import type { PrescriptionInterface } from '../../interfaces/prescription.interface'
import { useAppointmentStore } from '@/stores/appointment'
import { useReservationStore } from '../../stores/reservation'
// import { usePrescriptionStore } from '@/stores/prescription'
import { onMounted, ref, computed } from 'vue'
import { format, parse, differenceInDays } from 'date-fns'
import Button from '@/components/ui/button/Button.vue'
import { Status as AppointmentStatus } from '@/interfaces/appointment.interface'
import { useUserStore } from '@/stores/user'
import { Role } from '@/interfaces/user.interface'
import AppointmentDeleteButton from '@/components/modules/AppointmentListModule/AppointmentDeleteButton.vue'
import { Status } from '@/interfaces/appointment.interface'

const router = useRouter()
const route = useRoute()

const { id } = route.params

const appointmentId = id as string

const appointmentStore = useAppointmentStore()
const userStore = useUserStore()
const reservationStore = useReservationStore()
// const prescriptionStore = usePrescriptionStore()

const accessToken = userStore.accessToken

const appointment = ref<undefined | AppointmentInterface>()
const reservations = ref<Reservation[]>([])
const prescriptions = ref<PrescriptionInterface[]>([])

const formatDate = (dateStr: string) => {
  try {
    if (dateStr.includes('T')) {
      return format(new Date(dateStr), 'EEEE, dd MMMM yyyy HH:mm:ss')
    }
    // Parse DD-MM-YYYY format
    return format(parse(dateStr, 'dd-MM-yyyy', new Date()), 'EEEE, dd MMMM yyyy')
  } catch (e) {
    console.error('Date parsing error:', e)
    return '-'
  }
}

const getAppointment = async () => {
  appointment.value = await appointmentStore.getAppointmentDetail(
    appointmentId as string,
    userStore.accessToken as string,
  )
}

const getReservations = async () => {
  reservations.value = (await reservationStore.getReservations()).data
}

// const getPrescriptions = async () => {
//   prescriptions.value = await prescriptionStore.getPrescriptions()
// }

const canMarkAsDone = computed(() => {
  console.log('canMarkAsDone check:', {
    appointmentValue: appointment.value,
    status: appointment.value?.status,
    diagnosis: appointment.value?.diagnosis,
    treatments: appointment.value?.treatments,
    expectedStatus: AppointmentStatus.CREATED,
  })

  if (!appointment.value) return false
  return (
    appointment.value.status === AppointmentStatus.CREATED &&
    appointment.value.diagnosis &&
    appointment.value.treatments &&
    appointment.value.treatments.length > 0
  )
})

const canCancel = computed(() => {
  console.log('canCancel check:', {
    appointmentValue: appointment.value,
    status: appointment.value?.status,
    date: appointment.value?.date,
  })

  if (!appointment.value) return false
  const appointmentDate = parse(appointment.value.date, 'dd-MM-yyyy', new Date())
  const daysUntilAppointment = differenceInDays(appointmentDate, new Date())
  console.log('Days until appointment:', daysUntilAppointment)
  return appointment.value.status === AppointmentStatus.CREATED && daysUntilAppointment > 1
})

const canUpdateNote = computed(() => {
  console.log('canUpdateNote check:', {
    appointmentValue: appointment.value,
    status: appointment.value?.status,
    date: appointment.value?.date,
  })

  if (!appointment.value) return false
  const appointmentDate = parse(appointment.value.date, 'dd-MM-yyyy', new Date())
  const daysUntilAppointment = differenceInDays(appointmentDate, new Date())
  console.log('Days from appointment:', daysUntilAppointment)
  return appointment.value.status === AppointmentStatus.CREATED && daysUntilAppointment <= 0
})

const reservationExists = computed<boolean>(() => {
  if (!appointment.value) return false

  if (!reservations.value) return false

  return reservations.value.some((reservation) => {
    if (appointment.value) {
      return reservation.appointmentId === appointment.value.id
    } else {
      return false
    }
  })
})

const canMakeReservation = computed(() => {
  if (!appointment.value) return false
  return appointment.value.status === AppointmentStatus.CREATED && !reservationExists.value
})

const prescriptionExists = computed(() => {
  if (!prescriptions.value || !appointment.value) return false
  return prescriptions.value.some((prescription) => {
    if (appointment.value) {
      return prescription.appointment.id === appointment.value.id
    } else {
      return false
    }
  })
})

// const canAddPrescription = computed(() => {
//   if (!appointment.value) return false
//   return appointment.value.status === AppointmentStatus.CREATED && !prescriptionExists.value
// })

const handleMarkAsDone = async () => {
  try {
    console.log('Marking as done:', {
      appointmentId,
      status: AppointmentStatus.DONE,
    })
    await appointmentStore.updateAppointmentStatus(
      appointmentId as string,
      1,
      accessToken as string,
    )
  } catch (error) {
    console.error('Failed to mark as done:', error)
  }
}

const handleCancel = async () => {
  try {
    console.log('Cancelling appointment:', {
      appointmentId,
      status: AppointmentStatus.CANCELLED,
    })

    await appointmentStore.updateAppointmentStatus(
      appointmentId as string,
      2,
      accessToken as string,
    )
  } catch (error) {
    console.error('Failed to cancel appointment:', error)
  }
}

onMounted(async () => {
  await getAppointment()
  if (userStore.user && userStore.user.role === Role.NURSE) {
    await getReservations()
  }
})
</script>

<template>
  <div>
    <Header>
      <template #breadcumb>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/appointment"> Appointment </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </template>
    </Header>

    <main class="w-full h-fit flex justify-center items-center bg-gray-400/30">
      <div class="w-[60%] flex flex-col gap-2 divide-y-2 bg-white drop-shadow-xl p-6 rounded-xl">
        <div class="w-full flex justify-between">
          <h1 class="text-green-600 font-bold text-xl">Detail Appointment</h1>
          <div v-if="userStore.user?.role === Role.ADMIN" class="flex gap-2">
            <Button
              @click="handleMarkAsDone"
              :disabled="!canMarkAsDone"
              class="bg-green-600 hover:bg-green-800 text-white disabled:bg-gray-400"
            >
              Mark as Done
            </Button>
            <Button
              @click="handleCancel"
              :disabled="!canCancel"
              class="bg-red-600 hover:bg-red-800 text-white disabled:bg-gray-400"
            >
              Cancel Appointment
            </Button>
            <AppointmentDeleteButton :idAppointment="appointmentId" />
          </div>
        </div>

        <div class="flex flex-col gap-2 py-4">
          <div class="flex flex-col gap-1 w-full">
            <span>ID Appointment</span>
            <span class="text-xl font-bold">{{ appointment?.id }}</span>
          </div>
          <div class="flex flex-col gap-1 w-full">
            <span>Patient</span>
            <span class="text-xl font-bold">{{ appointment?.patient?.name }}</span>
          </div>
          <div class="flex flex-col gap-1 w-full">
            <span>Doctor</span>
            <span class="text-xl font-bold">{{ appointment?.doctor?.name }}</span>
          </div>
          <div class="flex flex-col gap-1 w-full">
            <span>Appointment Date</span>
            <span class="text-xl font-bold">{{
              appointment?.date ? formatDate(appointment.date) : '-'
            }}</span>
          </div>
          <div class="flex flex-col gap-1 w-full">
            <span>Status</span>
            <span class="text-xl font-bold">{{ appointment?.status }}</span>
          </div>
          <div class="flex gap-12 w-full">
            <div class="flex flex-col gap-1 w-1/3">
              <span>Updated At</span>
              <span class="text-xl font-bold">
                {{ appointment?.updatedAt ? formatDate(appointment.updatedAt) : '-' }}
              </span>
            </div>
            <div class="flex flex-col gap-1 w-1/3">
              <span>Created At</span>
              <span class="text-xl font-bold">
                {{ appointment?.createdAt ? formatDate(appointment.createdAt) : '-' }}
              </span>
            </div>
          </div>
          <div class="flex gap-12 w-full">
            <div class="flex flex-col gap-1 w-1/3">
              <span>Updated By</span>
              <span class="text-xl font-bold">
                {{ appointment?.updatedBy }}
              </span>
            </div>
            <div class="flex flex-col gap-1 w-1/3">
              <span>Created By</span>
              <span class="text-xl font-bold">
                {{ appointment?.createdBy }}
              </span>
            </div>
          </div>
        </div>

        <!-- Diagnosis Section -->
        <div class="flex flex-col gap-1 w-full mt-3">
          <h5 class="font-medium">Diagnosis</h5>
          <textarea
            class="w-full p-2 border rounded-md"
            rows="3"
            readonly
            :value="appointment?.diagnosis || 'No records yet.'"
          ></textarea>
        </div>

        <!-- Treatments Section -->
        <div class="flex flex-col gap-1 w-full mt-3">
          <h5 class="font-medium">Treatments</h5>
          <p v-if="!appointment?.treatments?.length">No treatments yet.</p>
          <ul v-else class="list-group divide-y border rounded-md">
            <li v-for="treatment in appointment.treatments" :key="treatment.id" class="p-2">
              {{ treatment.name }}
            </li>
          </ul>
        </div>

        <!-- Action Buttons Based on Role -->
        <div class="flex gap-2 mt-4">
          <Button @click="router.back()" class="bg-slate-600 hover:bg-slate-800 text-white">
            Back
          </Button>

          <!-- Admin Actions -->
          <template v-if="userStore.user?.role === Role.DOCTOR">
            <RouterLink
              v-if="canUpdateNote"
              :to="`/appointment/${appointmentId}/note`"
              class="w-full"
            >
              <Button class="bg-amber-600 hover:bg-amber-800 text-white">
                Update Diagnosis & Treatments
              </Button>
            </RouterLink>
            <div v-if="!prescriptionExists" class="w-full">
              <RouterLink
                v-if="appointment?.status == Status.CREATED"
                :to="`/prescription/create`"
                class="w-full"
              >
                <Button class="bg-blue-600 hover:bg-blue-800 text-white">
                  Make Prescription
                </Button>
              </RouterLink>
              <Button v-else :disabled="true" class="bg-blue-600 text-white disabled:bg-gray-400">
                Make Prescription
              </Button>
            </div>
            <RouterLink
              v-else
              :to="`/prescription/${prescriptions.find((prescription) => prescription.appointment.id === appointment?.id)?.id}`"
              class="w-full"
            >
              <Button class="bg-amber-600 hover:bg-amber-800 text-white">
                View Prescription
              </Button>
            </RouterLink>
          </template>

          <!-- Nurse Actions -->
          <template v-else-if="userStore.user?.role === Role.NURSE">
            <div v-if="!reservationExists" class="w-full">
              <RouterLink v-if="canMakeReservation" :to="`/reservation/create`" class="w-full">
                <Button class="bg-blue-600 hover:bg-blue-800 text-white"> Make Reservation </Button>
              </RouterLink>
              <Button v-else :disabled="true" class="bg-blue-600 text-white disabled:bg-gray-400">
                Make Reservation
              </Button>
            </div>
            <RouterLink
              v-else
              :to="`/reservation/${reservations.find((reservation) => reservation.appointmentId === appointment?.id)?.id}`"
              class="w-full"
            >
              <Button class="bg-amber-600 hover:bg-amber-800 text-white"> View Reservation </Button>
            </RouterLink>
          </template>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped></style>
