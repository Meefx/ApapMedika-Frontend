<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useReservationStore } from '@/stores/reservation'
import { useRoomStore } from '@/stores/room'
import { toast } from 'vue-sonner'
import Header from '@/components/elements/Header/Header.vue'
import Breadcrumb from '@/components/ui/breadcrumb/Breadcrumb.vue'
import type { Reservation } from '@/interfaces/reservation.interface'
import { type Room } from '@/interfaces/room.interface'

const route = useRoute()
const router = useRouter()
const reservationStore = useReservationStore()
const roomStore = useRoomStore()

const reservation = ref<Reservation | null>(null)
const isLoading = ref(true)
const availableRooms = ref<Room[]>([])

const form = ref<{
  dateIn: string
  dateOut: string
  roomId: string
}>({
  dateIn: '',
  dateOut: '',
  roomId: '',
})

const isUpdateAllowed = computed(() => {
  if (!reservation.value) return false
  const currentDate = new Date()
  const dateIn = new Date(reservation.value.dateIn)
  return currentDate < dateIn
})

onMounted(async () => {
  console.log(reservation.value)
  try {
    const reservationId = route.params.id as string
    const response = await reservationStore.getReservationById(reservationId)
    reservation.value = response.data

    // Pre-fill form with existing reservation data
    form.value.dateIn = reservation.value ? reservation.value.dateIn : ''
    form.value.dateOut = reservation.value ? reservation.value.dateOut : ''
    form.value.roomId = reservation.value ? reservation.value.roomId : ''
  } catch (error) {
    console.error('Error fetching reservation:', error)
    toast.error('Gagal memuat detail reservasi')
  } finally {
    isLoading.value = false
  }
})

const searchAvailableRooms = async () => {
  if (!form.value.dateIn || !form.value.dateOut) {
    toast.error('Pilih tanggal masuk dan keluar')
    return
  }

  try {
    const response = await roomStore.getAvailableRooms(form.value.dateIn, form.value.dateOut)
    availableRooms.value = response.data
  } catch (error) {
    console.error('Error fetching available rooms:', error)
    toast.error('Gagal mencari ruangan tersedia')
  }
}

const updateReservation = async () => {
  if (!isUpdateAllowed.value) {
    toast.error('Reservasi tidak dapat diubah setelah tanggal masuk')
    return
  }

  if (!form.value.roomId) {
    toast.error('Pilih ruangan')
    return
  }

  try {
    if (!reservation.value) return

    await reservationStore.updateReservation({
      id: reservation.value.id,
      dateIn: form.value.dateIn,
      dateOut: form.value.dateOut,
      roomId: form.value.roomId,
      patientId: reservation.value.patient.id,
      listFacilityIds: reservation.value.facilities.map((f) => f.id),
    })

    toast.success('Reservasi berhasil diperbarui')
    router.push('/reservation')
  } catch (error) {
    console.error('Error updating reservation:', error)
    toast.error('Gagal memperbarui reservasi')
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
              <BreadcrumbLink>
                <RouterLink to="/reservation">Reservations</RouterLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink>Update Reservation</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </template>
    </Header>

    <main class="m-4 p-4 bg-iron rounded-2xl min-h-screen">
      <div v-if="isLoading" class="text-center">Loading...</div>

      <form v-else-if="reservation" @submit.prevent="updateReservation" class="max-w-md mx-auto">
        <div v-if="!isUpdateAllowed" class="text-red-500 mb-4">
          Reservasi tidak dapat diubah setelah tanggal masuk
        </div>

        <div class="mb-4">
          <label class="block mb-2">Tanggal Masuk</label>
          <input
            v-model="form.dateIn"
            type="date"
            class="w-full p-2 border rounded"
            :disabled="!isUpdateAllowed"
          />
        </div>

        <div class="mb-4">
          <label class="block mb-2">Tanggal Keluar</label>
          <input
            v-model="form.dateOut"
            type="date"
            class="w-full p-2 border rounded"
            :disabled="!isUpdateAllowed"
          />
        </div>

        <button
          type="button"
          @click="searchAvailableRooms"
          class="bg-blue-500 text-white px-4 py-2 rounded mb-4"
          :disabled="!isUpdateAllowed"
        >
          Cari Ruangan
        </button>

        <div v-if="availableRooms.length" class="mb-4">
          <label class="block mb-2">Pilih Ruangan</label>
          <select
            v-model="form.roomId"
            class="w-full p-2 border rounded"
            :disabled="!isUpdateAllowed"
          >
            <option value="">Pilih Ruangan</option>
            <option v-for="room in availableRooms" :key="room.id" :value="room.id">
              {{ room.name }} - Rp{{ room.pricePerDay }}/hari
            </option>
          </select>
        </div>

        <button
          type="submit"
          class="bg-green-500 text-white px-4 py-2 rounded"
          :disabled="!isUpdateAllowed"
        >
          Perbarui Reservasi
        </button>
      </form>
    </main>
  </div>
</template>
