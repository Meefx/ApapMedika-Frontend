<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useReservationStore } from '@/stores/reservation'
import type { Reservation } from '@/interfaces/reservation.interface'
import { useToast } from 'vue-toastification'

import Header from '@/components/elements/Header/Header.vue';
import Breadcrumb from '@/components/ui/breadcrumb/Breadcrumb.vue';

const route = useRoute()
const reservationStore = useReservationStore()
const reservation = ref<Reservation | null>(null)
const isLoading = ref(true)
const showModal = ref(false)

onMounted(async () => {
  try {
    const reservationId = route.params.id as string
    await reservationStore.getReservationById(reservationId)
    reservation.value = reservationStore.reservationDetail ?? null
  } catch (error) {
    console.error('Error fetching reservation:', error)
  } finally {
    isLoading.value = false
  }
})

const router = useRouter()
const toast = useToast()

const handleEdit = () => {
  if (reservation.value) {
    router.push({ name: 'update-reservation', params: { id: reservation.value.id } })
  }
}

const confirmDelete = () => {
  showModal.value = true
}

const handleDelete = async () => {
  if (reservation.value) {
    try {
      const reservationId = reservation.value.id
      await reservationStore.deleteReservation(reservationId)
      toast.success('Reservasi berhasil dihapus!')
      router.push('/reservation')
    } catch (error) {
      console.error('Error deleting reservation:', error)
      toast.error('Terjadi kesalahan saat menghapus reservasi.')
    } finally {
      showModal.value = false
    }
  }
}

const cancelDelete = () => {
  showModal.value = false
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
          </BreadcrumbList>
        </Breadcrumb>
      </template>
    </Header>

    <!-- Loading Spinner -->
    <div v-if="isLoading" class="loading">
      Memuat data reservasi...
    </div>

    <!-- Reservation Detail Card -->
    <div v-else-if="reservation" class="card">
      <h1 class="text-title">Detail Reservasi</h1>

      <!-- Detail Section -->
      <div class="detail-section">
        <p><strong>ID Reservasi:</strong> {{ reservation.id }}</p>
        <p><strong>Nama Pasien:</strong> {{ reservation.patient?.name || 'Tidak tersedia' }}</p>
        <p><strong>Tanggal Masuk:</strong> {{ reservation.dateIn }}</p>
        <p><strong>Tanggal Keluar:</strong> {{ reservation.dateOut }}</p>
        <p><strong>Total Biaya:</strong> Rp {{ reservation.totalFee.toLocaleString() }}</p>
      </div>

      <!-- Facilities Section -->
      <div class="facilities-section">
        <p><strong>Fasilitas:</strong></p>
        <ul v-if="reservation.facilities?.length">
          <li v-for="facility in reservation.facilities" :key="facility.id" class="facility-item">
            {{ facility.name }} - Rp{{ facility.fee.toLocaleString() }}
          </li>
        </ul>
        <p v-else>Tidak ada fasilitas yang dipilih</p>
      </div>

      <!-- Buttons Section -->
      <div class="buttons-section">
        <button class="btn edit-btn" @click="handleEdit">Edit</button>
        <button class="btn delete-btn" @click="confirmDelete">Delete</button>
      </div>
    </div>

    <!-- Error Message -->
    <div v-else class="error">
      Data reservasi tidak ditemukan
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <p>Apakah Anda yakin ingin menghapus reservasi ini?</p>
        <div class="modal-actions">
          <button class="btn confirm-btn" @click="handleDelete">Ya, Hapus</button>
          <button class="btn cancel-btn" @click="cancelDelete">Batal</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Card Style */
.card {
  max-width: 800px;
  margin: 30px auto;
  padding: 30px;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

/* Title Style */
.text-title {
  font-size: 32px;
  text-align: center;
  font-weight: bold;
  margin-bottom: 20px;
}

/* Loading & Error */
.loading, .error {
  text-align: center;
  padding: 20px;
  color: #666;
}

/* Detail Section Style */
.detail-section, .facilities-section {
  margin-bottom: 30px;
}

.detail-section p, .facilities-section p {
  margin-bottom: 15px;
  line-height: 1.6;
}

/* Facilities List */
.facility-item {
  margin-bottom: 10px;
  line-height: 1.6;
}

/* Breadcrumb Style */
.breadcrumb ol {
  display: flex;
  list-style: none;
  padding: 0;
}

.breadcrumb li {
  margin-right: 10px;
}

.breadcrumb li:not(:last-child)::after {
  content: '›';
  margin-left: 10px;
}

/* Button Styles */
.buttons-section {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
}

.btn {
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.edit-btn {
  background-color: #d3d3d3;
  color: #333;
}

.delete-btn {
  background-color: #e74c3c;
  color: white;
}

.edit-btn:hover {
  background-color: #b0b0b0;
}

.delete-btn:hover {
  background-color: #c0392b;
}
</style>
