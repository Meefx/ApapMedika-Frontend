<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue'
import { useAppointmentStore } from '@/stores/appointment'
import { useUserStore } from '@/stores/user'
import { toast } from 'vue-sonner'

const appointmentStore = useAppointmentStore()
const userStore = useUserStore()

const props = defineProps({
  idAppointment: {
    type: String,
    required: true,
  },
})

const deleteAppointment = async () => {
  if (!userStore.accessToken) {
    toast.error('Access token is missing')
    return
  }
  const confirmed = window.confirm('Are you sure you want to delete this appointment?')
  if (!confirmed) {
    return
  }
  await appointmentStore.deleteAppointment(props.idAppointment, userStore.accessToken)
}
</script>

<template>
  <Button @click="deleteAppointment" class="delete-button">Hapus</Button>
</template>

<style scoped>
.delete-button {
  @apply bg-rose-600 hover:bg-rose-800 text-white;
}
</style>
