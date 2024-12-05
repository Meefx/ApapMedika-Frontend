<script setup lang="ts">
import Header from '@/components/elements/Header/Header.vue'
import Breadcrumb from '@/components/ui/breadcrumb/Breadcrumb.vue'
import BreadcrumbList from '@/components/ui/breadcrumb/BreadcrumbList.vue'
import BreadcrumbItem from '@/components/ui/breadcrumb/BreadcrumbItem.vue'
import BreadcrumbLink from '@/components/ui/breadcrumb/BreadcrumbLink.vue'
import { onMounted } from 'vue'
import { DataTable } from 'simple-datatables'
import { useReservationStore } from '@/stores/reservation'
import Button from '@/components/ui/button/Button.vue'
import { Role } from '@/interfaces/user.interface'
import { useUserStore } from '@/stores/user'

const reservationStore = useReservationStore()
const userStore = useUserStore()

onMounted(async () => {
  try {
    await reservationStore.getReservations()
    if (document.getElementById('reservation-table') && typeof DataTable !== 'undefined') {
      new DataTable('#reservation-table', {
        searchable: true,
      })
    }
  } catch (error) {
    console.error('Error fetching reservations:', error)
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
              <BreadcrumbLink>
                <RouterLink to="/dashboard">Dashboard</RouterLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </template>
    </Header>

    <main class="m-4 p-4 bg-iron rounded-2xl min-h-screen">
      <div class="flex justify-between items-center mb-4">
        <!-- Search bar will be here if needed for DataTable -->
        <div class="flex-1">
          <!-- DataTable search bar will be placed here automatically if supported -->
        </div>
        <RouterLink
          :to="`/reservation/create`"
          class="w-auto"
          v-if="userStore.user && userStore.user.role === Role.NURSE"
        >
          <Button class="bg-blue-600 text-white px-4 py-2 rounded-md">Buat Reservasi</Button>
        </RouterLink>
      </div>
      <table id="reservation-table" class="table-auto w-full border-collapse">
        <thead>
          <tr>
            <th class="px-4 py-2 text-left">ID Reservasi</th>
            <th class="px-4 py-2 text-left">Tanggal Masuk</th>
            <th class="px-4 py-2 text-left">Tanggal Keluar</th>
            <th class="px-4 py-2 text-left">Total Biaya</th>
            <th class="px-4 py-2 text-left">Pasien</th>
            <th class="px-4 py-2 text-left">Nurse</th>
            <th class="px-4 py-2 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="reservation in reservationStore.reservations" :key="reservation.id">
            <td class="px-4 py-2">{{ reservation.id }}</td>
            <td class="px-4 py-2">{{ reservation.dateIn }}</td>
            <td class="px-4 py-2">{{ reservation.dateOut }}</td>
            <td class="px-4 py-2">Rp{{ reservation.totalFee.toLocaleString() }}</td>
            <td class="px-4 py-2">{{ reservation.patient.name }}</td>
            <td class="px-4 py-2">{{ reservation.nurse.name }}</td>
            <td class="px-4 py-2 flex gap-2">
              <RouterLink :to="`/reservation/${reservation.id}`" class="w-full">
                <Button class="bg-blue-600 text-white px-4 py-2 rounded-md">Lihat</Button>
              </RouterLink>
            </td>
          </tr>
        </tbody>
      </table>
    </main>
  </div>
</template>

<style scoped>
/* Styling the table */
.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

#reservation-table {
  width: 100%;
  border-radius: 8px;
  border-collapse: collapse;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

#reservation-table th,
#reservation-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

#reservation-table th {
  background-color: #f4f4f4;
  color: #333;
}

#reservation-table td {
  color: #666;
}

#reservation-table td:last-child {
  display: flex;
  gap: 10px;
}

/* Styling the buttons */
button {
  padding: 8px 16px;
  border-radius: 5px;
  font-weight: 600;
}

/* Adding some spacing between message and content */
.message-layer {
  margin-top: 20px;
}
</style>
