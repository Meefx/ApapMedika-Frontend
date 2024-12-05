<script setup lang="ts">
import Header from '@/components/elements/Header/Header.vue'
import Breadcrumb from '@/components/ui/breadcrumb/Breadcrumb.vue'
import BreadcrumbList from '@/components/ui/breadcrumb/BreadcrumbList.vue'
import BreadcrumbItem from '@/components/ui/breadcrumb/BreadcrumbItem.vue'
import BreadcrumbLink from '@/components/ui/breadcrumb/BreadcrumbLink.vue'
import { BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useMedicineStore } from '@/stores/medicine'
import { onMounted, reactive, ref } from 'vue'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { Role } from '@/interfaces/user.interface'
import { useUserStore } from '@/stores/user'
import type { FetchBaseResponse } from '@/utils/customFetch/interface'
import {
  DateFormatter,
  type DateValue,
} from '@internationalized/date'

const route = useRoute()
const router = useRouter()
const medicineStore = useMedicineStore()
const userStore = useUserStore()

const df = new DateFormatter('id-ID', {
  dateStyle: 'long',
})

const state = reactive<{
  isLoading: boolean,
  isOpenDeleteModal: boolean
}>({
  isLoading: true,
  isOpenDeleteModal: false,
})

const expiryDate = ref<DateValue>()

onMounted(async () => {
  toast.promise(medicineStore.getDetailMedicine(route.params.idMedicine as string), {
    loading: 'Fetching Medicine...',
    success: () => {
      state.isLoading = false
      return 'Medicine fetched successfully.'
    },
    error: () => {
      state.isLoading = false
      return 'Failed to fetch medicine. Please try again.'
    },
  })
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
                <RouterLink to="/medicines">Medicine</RouterLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>
                <RouterLink :to="`/medicines/${$route.params.idMedicine}`">{{
                  $route.params.idMedicine
                }}</RouterLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </template>
    </Header>

    <main class="m-4 p-4 rounded-2xl min-h-screen">
      <template v-if="medicineStore.medicine">
        <div class="flex flex-col gap-4">
          <h1 class="font-bold text-3xl">Detail Medicine</h1>

          <div class="grid grid-cols-[1fr,1fr] w-full gap-y-2">
            <div class="grid grid-cols-[1fr,1fr] w-fit gap-y-2">
              <p class="font-bold">ID</p>
              <p>: {{ medicineStore.medicine.id }}</p>

              <p class="font-bold">Medicine</p>
              <p>: {{ medicineStore.medicine.name }}</p>

              <p class="font-bold">Price</p>
              <p>
                :
                {{
                  new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                  }).format(medicineStore.medicine.price)
                }}
              </p>

              <p class="font-bold">Stock</p>
              <p>: {{ medicineStore.medicine.stock }}</p>

              <p class="font-bold">Description</p>
              <p>: {{ medicineStore.medicine.description }}</p>

              <p class="font-bold">Last Updated At</p>
              <p>
                :
                {{
                  new Date(medicineStore.medicine.updatedDate).toLocaleString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false,
                  })
                }}
              </p>

              <p class="font-bold">Last Updated By</p>
              <p>: {{ medicineStore.medicine.updatedBy }}</p>
            </div>

            <div class="flex gap-2" v-if="userStore.user.role == Role.PHARMACIST">
              <Button variant="secondary">
                <RouterLink to="/medicines/update-stock">Add Stock</RouterLink>
              </Button>

              <Button variant="secondary">
                <RouterLink to="/medicines/update-stock">Edit Data</RouterLink> <!-- TODO: change router link-->
              </Button>

              <Button
                variant="destructive"
                @click="
                  () => {
                    state.isOpenDeleteModal = true
                  }
                "
                >Delete Medicine</Button
              >
            </div>
          </div>
        </div>
      </template>
    </main>

    <AlertDialog :open="state.isOpenDeleteModal">
      <AlertDialogContent class="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this medicine?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel as-child @click="() => (state.isOpenDeleteModal = false)">
            <Button variant="secondary">Cancel</Button>
          </AlertDialogCancel>

          <AlertDialogAction as-child @click="() => (state.isOpenDeleteModal = false)">
            <Button
                variant="destructive"
                @click="
                  () => {
                    if (medicineStore.medicine) {
                      toast.promise(medicineStore.deleteMedicine(medicineStore.medicine.id), {
                        loading: 'Deleting medicine...',
                        success: () => {
                          return 'Medicine deleted successfully.'
                        },
                        error: (data: FetchBaseResponse) => {
                          return data.hasOwnProperty('message')
                            ? data.message
                            : 'Failed to delete medicine. Please try again.'
                        },
                      })

                      router.push('/medicines')
                    } else {
                      toast.error('Failed to delete medicine. No ID provided.')
                    }
                  }
                "
                >Delete</Button
              >
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>

<style scoped></style>
