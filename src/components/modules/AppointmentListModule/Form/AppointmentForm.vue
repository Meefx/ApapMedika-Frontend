<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue'
import type { AppointmentRequestInterface } from '@/interfaces/appointment.interface'
import { onMounted, type PropType, ref, toRefs, watch } from 'vue'
import type { CommonResponseInterface } from '@/interfaces/common.interface'
import { useRouter } from 'vue-router'
import type { DoctorOptionInterface, DoctorSchedule } from '@/interfaces/doctor.interface'
import { useUserStore } from '@/stores/user'
import { FormField, FormItem, FormLabel } from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { PatientOptionInterface } from '@/interfaces/patient.interface'

const router = useRouter()
const userStore = useUserStore()

const accessToken = userStore.accessToken

const props = defineProps({
  action: {
    type: Function as PropType<(data: AppointmentRequestInterface) => Promise<void>>,
    required: true,
  },
  appointmentModel: {
    type: Object as PropType<AppointmentRequestInterface>,
    required: true,
  },
})

const model = toRefs(props).appointmentModel

const emit = defineEmits(['update:modelValue'])

watch(
  () => model,
  (newValue) => {
    emit('update:modelValue', newValue)
  },
  { deep: true },
)

const handleSubmit = async () => await props.action(model.value)

const doctorOptions = ref([] as DoctorOptionInterface[])

const getDoctors = async () => {
  const response = await fetch(`${import.meta.env.VITE_PROFILE_API}/api/doctors`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  console.log('DOCTOR:', response)
  const data: CommonResponseInterface<DoctorOptionInterface[]> = await response.json()
  doctorOptions.value = data.data
}

const patientOptions = ref([] as PatientOptionInterface[])

const getPatients = async () => {
  const response = await fetch(`${import.meta.env.VITE_PROFILE_API}/api/patients`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  console.log('PATIENT:', response)
  const data: CommonResponseInterface<PatientOptionInterface[]> = await response.json()
  patientOptions.value = data.data
}

// const selectedDoctor = ref<DoctorOptionInterface | null>(null)
// Update ref type
const availableSchedules = ref<DoctorSchedule[]>([])

// Update fetch function
const getSchedulesByDoctorId = async (doctorId: string): Promise<DoctorSchedule[]> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_PROFILE_API}/api/doctors/${doctorId}/schedules`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
    const data: CommonResponseInterface<DoctorSchedule[]> = await response.json()
    return data.data
  } catch (error) {
    console.error('Failed to fetch doctor schedules:', error)
    return []
  }
}

// Update watch handler
watch(
  () => model.value.doctorId,
  async (newDoctorId) => {
    if (!newDoctorId) {
      availableSchedules.value = []
      return
    }

    availableSchedules.value = await getSchedulesByDoctorId(newDoctorId)
  },
)

// Format schedule for display
// const formatSchedule = (schedule: string) => {
//   return schedule.charAt(0).toUpperCase() + schedule.slice(1).toLowerCase()
// }

onMounted(async () => {
  console.log('Component mounted')
  await getDoctors()
  console.log('Doctors:', doctorOptions.value)
  await getPatients()
  console.log('Patients:', patientOptions.value)
})
</script>

<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-2 py-2">
    <div class="flex w-full justify-between gap-2">
      <FormField name="patient">
        <FormItem>
          <FormLabel>Patient</FormLabel>
          <Select v-model="model.patientId">
            <SelectTrigger>
              <SelectValue placeholder="Choose Patient..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="patient in patientOptions" :key="patient.id" :value="patient.id">
                {{ patient.nik }} - {{ patient.name }}
              </SelectItem>
            </SelectContent>
          </Select>
        </FormItem>
      </FormField>

      <FormField name="doctor">
        <FormItem>
          <FormLabel>Doctor</FormLabel>
          <Select v-model="model.doctorId">
            <SelectTrigger>
              <SelectValue placeholder="Choose Doctor..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="doctor in doctorOptions" :key="doctor.id" :value="doctor.id">
                {{ doctor.name }}
              </SelectItem>
            </SelectContent>
          </Select>
        </FormItem>
      </FormField>
    </div>

    <FormField name="date">
      <FormItem>
        <FormLabel>Appointment Date</FormLabel>
        <Select v-model="model.date" :disabled="!model.doctorId || availableSchedules.length === 0">
          <SelectTrigger>
            <SelectValue placeholder="Choose Schedule..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="schedule in availableSchedules"
              :key="schedule.scheduleDate"
              :value="schedule.scheduleDate"
            >
              {{ schedule.scheduleString }}
            </SelectItem>
          </SelectContent>
        </Select>
      </FormItem>
    </FormField>

    <div class="flex gap-2 py-2">
      <Button
        @click="router.back()"
        type="button"
        class="bg-slate-600 hover:bg-slate-800 text-white"
      >
        Back
      </Button>
      <Button type="submit" class="bg-green-600 hover:bg-green-800 text-white"> Save </Button>
    </div>
  </form>
</template>

<style scoped></style>
