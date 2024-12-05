<script setup lang="ts">
import Header from '@/components/elements/Header/Header.vue'
import Breadcrumb from '@/components/ui/breadcrumb/Breadcrumb.vue'
import BreadcrumbList from '@/components/ui/breadcrumb/BreadcrumbList.vue'
import BreadcrumbItem from '@/components/ui/breadcrumb/BreadcrumbItem.vue'
import BreadcrumbLink from '@/components/ui/breadcrumb/BreadcrumbLink.vue'
import { BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { usePolicyStore } from '@/stores/policy'
import { onMounted, reactive, ref } from 'vue'
import { toast } from 'vue-sonner'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { columns } from '@/components/modules/DetailPolicyModule/column'
import { CoverageDataTable } from '@/components/modules/DetailPolicyModule'
import { Button } from '@/components/ui/button'
import { Role } from '@/interfaces/user.interface'
import { useUserStore } from '@/stores/user'
import type { FetchBaseResponse } from '@/utils/customFetch/interface'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import {
  DateFormatter,
  CalendarDate,
  getLocalTimeZone,
  type DateValue,
} from '@internationalized/date'
import { Calendar } from '@/components/ui/calendar'

const route = useRoute()
const router = useRouter()
const policyStore = usePolicyStore()
const userStore = useUserStore()

const df = new DateFormatter('id-ID', {
  dateStyle: 'long',
})

const state = reactive<{
  isLoading: boolean
}>({
  isLoading: true,
})

const expiryDate = ref<DateValue>()

onMounted(async () => {
  toast.promise(policyStore.getDetailPolicy(route.params.idPolicy as string), {
    loading: 'Loading Policy...',
    success: () => {
      state.isLoading = false
      if (policyStore.policy) {
        const expDate = new Date(policyStore.policy.expiryDate)
        expiryDate.value = new CalendarDate(
          expDate.getFullYear(),
          expDate.getMonth() + 1,
          expDate.getDate(),
        )
      }
      return 'Policy loaded successfully.'
    },
    error: () => {
      state.isLoading = false
      return 'Failed to load policy. Please try again.'
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
                <RouterLink to="/policies">Policy</RouterLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>
                <RouterLink :to="`/policies/${$route.params.idPolicy}`">{{
                  $route.params.idPolicy
                }}</RouterLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </template>
    </Header>

    <main class="m-4 p-4 bg-glacier rounded-2xl min-h-screen">
      <template v-if="policyStore.policy">
        <div class="flex flex-col gap-4">
          <h1 class="font-bold text-3xl">Detail Policy</h1>

          <div class="grid grid-cols-[1fr,1fr] w-full gap-y-2">
            <div class="grid grid-cols-[1fr,1fr] w-fit gap-y-2">
              <p class="font-bold">Policy ID</p>
              <p>: {{ policyStore.policy.id }}</p>

              <p class="font-bold">Patient</p>
              <p>: {{ policyStore.policy.patient.name }}</p>

              <p class="font-bold">Company</p>
              <p>: {{ policyStore.policy.company.name }}</p>

              <p class="font-bold">Expiry Date</p>
              <div class="flex" v-if="expiryDate">
                <p>:</p>
                <Popover>
                  <PopoverTrigger as-child>
                    <Button
                      variant="outline"
                      :class="
                        cn(
                          'w-[280px] justify-start text-left font-normal',
                          !expiryDate && 'text-muted-foreground',
                        )
                      "
                    >
                      <CalendarIcon class="mr-2 h-4 w-4" />
                      {{
                        expiryDate
                          ? df.format(expiryDate.toDate(getLocalTimeZone()))
                          : 'Pick a date'
                      }}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent class="w-auto p-0">
                    <Calendar v-model="expiryDate" initial-focus />
                  </PopoverContent>
                </Popover>
              </div>

              <p class="font-bold">Total Coverage</p>
              <p>
                :
                {{
                  new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                  }).format(policyStore.policy.totalCoverage)
                }}
              </p>

              <p class="font-bold">Total Covered</p>
              <p>
                :
                {{
                  new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                  }).format(policyStore.policy.totalCovered)
                }}
              </p>
            </div>

            <div class="grid grid-cols-[1fr,1fr] w-fit gap-y-2">
              <p class="font-bold">Created By</p>
              <p>: {{ policyStore.policy.createdBy }}</p>

              <p class="font-bold">Created At</p>
              <p>
                :
                {{
                  new Date(policyStore.policy.createdAt).toLocaleString('en-US', {
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
              <p>: {{ policyStore.policy.updatedBy }}</p>

              <p class="font-bold">Last Updated At</p>
              <p>
                :
                {{
                  new Date(policyStore.policy.updatedAt).toLocaleString('en-US', {
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

              <p class="font-bold">Status</p>
              <p>
                :
                <Badge>{{ policyStore.policy.status }}</Badge>
              </p>
            </div>

            <div class="flex gap-2" v-if="userStore.user.role == Role.ADMIN">
              <Button
                variant="secondary"
                @click="
                  () => {
                    if (policyStore.policy) {
                      toast.promise(policyStore.cancelPolicy(policyStore.policy.id), {
                        loading: 'Canceling policy...',
                        success: () => {
                          return 'Policy canceled successfully.'
                        },
                        error: (data: FetchBaseResponse) => {
                          return data.hasOwnProperty('message')
                            ? data.message
                            : 'Failed to cancel policy. Please try again.'
                        },
                      })
                    } else {
                      toast.error('Failed to cancel policy. No ID provided.')
                    }
                  }
                "
                >Cancel Policy</Button
              >
              <Button
                variant="destructive"
                @click="
                  () => {
                    if (policyStore.policy) {
                      toast.promise(policyStore.deletePolicy(policyStore.policy.id), {
                        loading: 'Deleting policy...',
                        success: () => {
                          return 'Policy deleted successfully.'
                        },
                        error: (data: FetchBaseResponse) => {
                          return data.hasOwnProperty('message')
                            ? data.message
                            : 'Failed to delete policy. Please try again.'
                        },
                      })

                      router.push('/policies')
                    } else {
                      toast.error('Failed to delete policy. No ID provided.')
                    }
                  }
                "
                >Delete Policy</Button
              >

              <Button
                variant="secondary"
                @click="
                  () => {
                    if (policyStore.policy && expiryDate) {
                      toast.promise(policyStore.updatePolicy(policyStore.policy.id, expiryDate), {
                        loading: 'Updating policy...',
                        success: () => {
                          return 'Policy updated successfully.'
                        },
                        error: (data: FetchBaseResponse) => {
                          return data.hasOwnProperty('message')
                            ? data.message
                            : 'Failed to update policy. Please try again.'
                        },
                      })
                    } else {
                      toast.error('Failed to update expiry date. No ID provided.')
                    }
                  }
                "
                >Update Policy</Button
              >
            </div>
          </div>

          <Separator />

          <div>
            <h1 class="font-bold text-2xl">Coverages</h1>

            <CoverageDataTable
              :is-loading="state.isLoading"
              :columns="columns"
              :data="
                policyStore.policy.coverages.map((item, index) => ({
                  number: index + 1,
                  name: item.name,
                  coverageAmount: item.coverageAmount,
                  status: item.status,
                }))
              "
            />

            <!-- <Table>
              <TableCaption>Daftar Coverage</TableCaption>

              <TableHeader>
                <TableRow>
                  <TableHead class="w-[100px]">No</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Coverage Amount</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                <TableRow v-for="(coverage, index) in policyStore.policy.coverages" :key="index">
                  <TableCell>{{ index + 1 }}</TableCell>
                  <TableCell>{{ coverage.name }}</TableCell>
                  <TableCell>{{ coverage.coverageAmount }}</TableCell>
                </TableRow>
              </TableBody>
            </Table> -->
          </div>
        </div>
      </template>
    </main>
  </div>
</template>

<style scoped></style>
