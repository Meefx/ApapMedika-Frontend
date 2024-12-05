<script setup lang="ts">
import Header from '@/components/elements/Header/Header.vue'
import Breadcrumb from '@/components/ui/breadcrumb/Breadcrumb.vue'
import BreadcrumbList from '@/components/ui/breadcrumb/BreadcrumbList.vue'
import BreadcrumbItem from '@/components/ui/breadcrumb/BreadcrumbItem.vue'
import BreadcrumbLink from '@/components/ui/breadcrumb/BreadcrumbLink.vue'
import { RouterLink } from 'vue-router'
import BreadcrumbSeparator from '@/components/ui/breadcrumb/BreadcrumbSeparator.vue'
import { Label } from '@/components/ui/label'
import { onMounted, reactive, ref } from 'vue'
import { toast } from 'vue-sonner'
import { useBillStore } from '@/stores/bill'

const billStore = useBillStore()
const policyStore = usePolicyStore()

import { useRoute } from 'vue-router'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatPrice } from '@/utils/formatPrice'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { usePolicyStore } from '@/stores/policy'
import { Button } from '@/components/ui/button'
import type { FetchBaseResponse } from '@/utils/customFetch/interface'

const route = useRoute()

const states = reactive<{
  tableContents: {
    name: string
    price: number
    isPlus: boolean
  }[]
}>({
  tableContents: [],
})

const totalPrice = ref<number>(0)
const selectedPolicyId = ref<string>('')

onMounted(() => {
  toast.promise(billStore.getDetailBill(route.params.idBill as string), {
    loading: 'Loading Bill...',
    success: () => {
      if (billStore.bill) {
        if (billStore.bill.appointment) {
          states.tableContents.push({
            name: `Appointment ${billStore.bill.appointment.id}`,
            price: billStore.bill.appointment.totalFee,
            isPlus: true,
          })

          totalPrice.value += billStore.bill.appointment.totalFee
        }

        if (billStore.bill.reservation) {
          states.tableContents.push({
            name: `Reservation ${billStore.bill.reservation.id}`,
            price: billStore.bill.reservation.totalFee,
            isPlus: true,
          })

          totalPrice.value += billStore.bill.reservation.totalFee
        }

        if (billStore.bill.policy) {
          states.tableContents.push({
            name: `Policy ${billStore.bill.policy.id}`,
            price: billStore.bill.policy.totalCoverage,
            isPlus: false,
          })

          totalPrice.value -= billStore.bill.policy.totalCoverage
          if (totalPrice.value < 0) {
            totalPrice.value = 0
          }
        }
      }

      toast.promise(policyStore.getAllPolicies({}), {
        loading: 'Loading Policy...',
        success: () => {
          return 'Policy Loaded'
        },
        error: 'Error loading Policy',
      })

      return 'Bill Loaded'
    },
    error: 'Error loading Bill',
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
              <BreadcrumbLink href="/bills"> Bills </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>
                <RouterLink :to="`/policies/${$route.params.idBill}`">{{
                  $route.params.idBill
                }}</RouterLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </template>
    </Header>

    <main class="m-4 p-4 bg-iron rounded-2xl min-h-screen">
      <h1>Detail Bill</h1>

      <div
        v-if="billStore.bill"
        class="grid grid-cols-[auto,auto] w-fit justify-start items-center gap-x-2"
      >
        <Label>ID Bill</Label>
        <p>: {{ billStore.bill.id }}</p>

        <Label>Status</Label>
        <p>
          :
          <Badge>{{ billStore.bill.status }}</Badge>
        </p>

        <template v-if="billStore.bill.status === 'UNPAID'">
          <Label>Policy</Label>
          <p>
            :
            <Select v-model="selectedPolicyId">
              <SelectTrigger>
                <SelectValue placeholder="Select Policy" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem
                    v-for="(policy, index) in policyStore.policies"
                    :key="index"
                    :value="policy.id"
                    >{{ policy.id }}</SelectItem
                  >
                </SelectGroup>
              </SelectContent>
            </Select>
          </p>
        </template>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No.</TableHead>
            <TableHead>Keterangan</TableHead>
            <TableHead>Harga</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableRow v-for="(content, index) in states.tableContents" :key="index">
            <TableCell>{{ index + 1 }}</TableCell>
            <TableCell>{{ content.name }}</TableCell>
            <TableCell>{{ content.isPlus ? '+' : '-' }}{{ formatPrice(content.price) }}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell :colspan="2">Total</TableCell>
            <TableCell>{{ formatPrice(totalPrice) }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Button
        @click="
          () => {
            toast.promise(billStore.payBill($route.params.idBill as string), {
              loading: 'Paying Bill...',
              success: () => {
                return 'Bill Paid'
              },
              error: (data: FetchBaseResponse) => data.message,
            })
          }
        "
        >Pay Bill</Button
      >
    </main>
  </div>
</template>
