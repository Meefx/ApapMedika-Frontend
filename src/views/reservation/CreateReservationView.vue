<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { useRoomStore } from '@/stores/room'
import { useFacilityStore } from '@/stores/facility'
import { usePatientStore } from '@/stores/patient'
import { useUserStore } from '@/stores/user'
import { useReservationStore } from '@/stores/reservation'
import { useRouter } from 'vue-router'
import type { GetAllPatientsResponse } from '@/interfaces/patient.interface'
import type { Facility } from '@/interfaces/facility.interface'
import type { AvailableRoomResponse, Room } from '@/interfaces/room.interface'
import { toast } from 'vue-sonner'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { cn } from '@/lib/utils'
import type { GetDetailReservationResponse } from '@/interfaces/reservation.interface'
import {
  BreadcrumbLink,
  BreadcrumbItem,
  Breadcrumb,
  BreadcrumbList,
} from '@/components/ui/breadcrumb'
import Header from '@/components/elements/Header/Header.vue'
import { ChevronsUpDown } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-vue-next'

const state = reactive<{
  patients: {
    value: string
    label: string
  }[]
}>({
  patients: [],
})

const openPatientDropDown = ref<boolean>(false)
const selectedPatientId = ref<string | null>(null)

const roomStore = useRoomStore()
const facilityStore = useFacilityStore()
const patientStore = usePatientStore()
const userStore = useUserStore()
const reservationStore = useReservationStore()
const router = useRouter()

// const nik = ref('')
// const patientFound = ref(false)
// const patientDetails = ref<Patient | null>(null)
const errorMessage = ref('')

const form = ref({
  dateIn: '',
  dateOut: '',
  roomId: '',
  facilities: [{ id: '' }],
})

const availableFacilities = ref<Facility[]>([])
const availableRooms = ref<Room[]>([])
const apiErrorMessage = ref('')
const successMessage = ref('')

// const insuranceLimit = computed(() => {
//   if (!patientDetails.value) return 0

//   const pClass = patientDetails.value.pClass
//   switch (pClass) {
//     case 1 : return 100000000
//     case 2 : return 50000000
//     case 3: return 25000000
//     default: return 0
//   }
// })

// const handleSearchPatient = async () => {
//   errorMessage.value = ''
//   patientFound.value = false
//   // patientDetails.value = null

//   if (!nik.value.trim()) {
//     return
//   }

//   try {
//     const response = await patientStore.getPatientByNIK(nik.value)

//     if (response.data) {
//       patientFound.value = true
//       // patientDetails.value = response.data
//     }
//   } catch (error) {
//     console.error('Error searching for patient:', error)
//     errorMessage.value = 'Pasien tidak ditemukan.'
//     patientFound.value = false
//     // patientDetails.value = null
//     toast.error('Gagal mencari pasien')
//   }
// }

const addFacility = () => {
  form.value.facilities.push({ id: '' })
}

const removeFacility = (index: number) => {
  form.value.facilities.splice(index, 1)
}

watch([() => form.value.dateIn, () => form.value.dateOut], async ([newDateIn, newDateOut]) => {
  form.value.roomId = ''

  if (newDateIn && newDateOut) {
    toast.promise(roomStore.getAvailableRooms(newDateIn, newDateOut), {
      loading: 'Mencari ruangan tersedia...',
      success: (data: AvailableRoomResponse) => {
        availableRooms.value = data.data

        return 'Ruangan tersedia ditemukan'
      },
      error: 'Gagal mencari ruangan tersedia',
    })

    // try {
    //   const response = await roomStore.getAvailableRooms(newDateIn, newDateOut)
    //   availableRooms.value = response.data
    // } catch (error) {
    //   console.error('Error fetching available rooms:', error)
    //   toast.error('Gagal mengambil daftar ruangan')
    // }
  }
})

const createReservation = async () => {
  // Validation checks
  if (!selectedPatientId.value) {
    toast.error('Pilih pasien terlebih dahulu')
    return
  }

  if (!form.value.dateIn || !form.value.dateOut || !form.value.roomId) {
    toast.error('Lengkapi semua field yang diperlukan')
    return
  }

  if (!userStore.user) {
    toast.error('Anda harus login terlebih dahulu')
    return
  }

  toast.promise(
    reservationStore.createReservation({
      dateIn: form.value.dateIn,
      dateOut: form.value.dateOut,
      patientId: selectedPatientId.value,
      roomId: form.value.roomId,
      listFacilityIds: form.value.facilities.map((facility) => facility.id),
    }),
    {
      loading: 'Membuat reservasi...',
      success: (data: GetDetailReservationResponse) => {
        router.push('/reservation')

        return data.message
      },
      error: (data: GetDetailReservationResponse) => {
        return `Failed to create reservation. ${data.message}`
      },
    },
  )
}

onMounted(async () => {
  try {
    toast.promise(usePatientStore().getAllPatients(), {
      loading: 'Loading patients...',
      success: (data: GetAllPatientsResponse) => {
        state.patients = data.data.map((patient) => ({
          value: patient.id,
          label: `${patient.nik} - ${patient.name}`,
        }))

        return 'Patients loaded successfully.'
      },
      error: 'Failed to load patients. Please try again.',
    })
    const facilitiesResponse = await facilityStore.getFacilities()
    availableFacilities.value = facilitiesResponse.data

    await roomStore.getAllRooms()
  } catch (error) {
    console.error('Error fetching data:', error)
    toast.error('Gagal memuat data awal')
  }
})

watch(selectedPatientId, async (newId) => {
  if (newId != null) {
    patientStore.patient = patientStore.patients.find((patient) => patient.id === newId)
    console.log(patientStore.patient)
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
      <!-- Input to search for Patient by NIK -->
      <!-- Input to search for Patient by NIK -->
      <div class="mb-4">
        <Label>Patient</Label>
        <Popover v-model="openPatientDropDown">
          <PopoverTrigger>
            <Button
              variant="outline"
              role="combobox"
              :aria-expanded="openPatientDropDown"
              class="min-w-[200px] justify-between"
            >
              {{
                selectedPatientId
                  ? state.patients.find((patient) => patient.value === selectedPatientId)?.label
                  : 'Select patient...'
              }}
              <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Command>
              <CommandInput class="h-9" placeholder="Search patient..." />
              <CommandEmpty>No patient found.</CommandEmpty>
              <CommandList>
                <CommandGroup>
                  <CommandItem
                    v-for="patient in state.patients"
                    :key="patient.value"
                    :value="patient.value"
                    @select="
                      (ev) => {
                        if (typeof ev.detail.value === 'string') {
                          selectedPatientId = ev.detail.value
                        }
                        openPatientDropDown = false
                      }
                    "
                  >
                    {{ patient.label }}
                    <Check
                      :class="
                        cn(
                          'ml-auto h-4 w-4',
                          selectedPatientId === patient.value ? 'opacity-100' : 'opacity-0',
                        )
                      "
                    />
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <!-- If patient is found, show their details -->
      <div
        v-if="selectedPatientId != null && patientStore.patient"
        class="mb-4 p-4 bg-gray-100 rounded-md"
      >
        <h2 class="text-lg font-bold mb-3">Detail Pasien</h2>
        <div class="grid grid-cols-2 gap-2">
          <p><strong>NIK:</strong> {{ patientStore.patient.nik }}</p>
          <p><strong>Nama:</strong> {{ patientStore.patient.name }}</p>
          <p><strong>Gender:</strong> {{ patientStore.patient.gender }}</p>
          <p><strong>Tanggal Lahir:</strong> {{ patientStore.patient.birthDate }}</p>
          <p><strong>Kelas:</strong> {{ patientStore.patient.pClass }}</p>
          <p>
            <strong>Batas Asuransi:</strong>
            {{ patientStore.patient.insuranceLimit || 'Tidak tersedia' }}
          </p>
        </div>
      </div>

      <!-- If patient not found, show error message -->
      <div v-else-if="errorMessage" class="text-red-500 mb-4">
        {{ errorMessage }}
      </div>

      <!-- Reservation Form -->
      <form @submit.prevent="createReservation">
        <!-- Date In and Date Out -->
        <div class="mb-4">
          <label for="dateIn">Tanggal Masuk</label>
          <input
            id="dateIn"
            v-model="form.dateIn"
            type="date"
            required
            class="p-2 border rounded-md w-full"
          />
        </div>

        <div class="mb-4">
          <label for="dateOut">Tanggal Keluar</label>
          <input
            id="dateOut"
            v-model="form.dateOut"
            type="date"
            required
            class="p-2 border rounded-md w-full"
          />
        </div>

        <!-- Room (disabled until dateIn and dateOut are selected) -->
        <div class="mb-4">
          <label for="room">Room</label>
          <select
            v-model="form.roomId"
            :disabled="!form.dateIn || !form.dateOut"
            required
            class="p-2 border rounded-md w-full"
          >
            <option value="">Pilih Room</option>
            <option v-for="room in availableRooms" :key="room.id" :value="room.id">
              {{ room.name }}
            </option>
          </select>
        </div>

        <!-- Facilities -->
        <div class="mb-4">
          <h3>Fasilitas</h3>
          <div v-for="(facility, index) in form.facilities" :key="index" class="flex items-center">
            <select v-model="facility.id" required class="p-2 border rounded-md mr-2">
              <option value="">Pilih Fasilitas</option>
              <option
                v-for="facilityOption in availableFacilities"
                :key="facilityOption.id"
                :value="facilityOption.id"
              >
                {{ facilityOption.name }}
              </option>
            </select>
            <button type="button" @click="removeFacility(index)" class="text-red-500">Hapus</button>
          </div>
          <button
            type="button"
            @click="addFacility"
            class="bg-blue-600 text-white px-4 py-2 rounded-md mt-2"
          >
            Tambah Fasilitas
          </button>
        </div>

        <!-- Submit Button -->
        <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded-md mt-4">
          Buat Reservasi
        </button>
      </form>

      <!-- Validation error message -->
      <div v-if="apiErrorMessage" class="text-red-500 mt-4">
        {{ apiErrorMessage }}
      </div>

      <!-- Success message -->
      <div v-if="successMessage" class="text-green-500 mt-4">
        {{ successMessage }}
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Optional styling for the page */
</style>
