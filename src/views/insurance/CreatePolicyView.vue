<script setup lang="ts">
import Header from '@/components/elements/Header/Header.vue'
import Breadcrumb from '@/components/ui/breadcrumb/Breadcrumb.vue'
import BreadcrumbList from '@/components/ui/breadcrumb/BreadcrumbList.vue'
import BreadcrumbItem from '@/components/ui/breadcrumb/BreadcrumbItem.vue'
import BreadcrumbLink from '@/components/ui/breadcrumb/BreadcrumbLink.vue'
import BreadcrumbSeparator from '@/components/ui/breadcrumb/BreadcrumbSeparator.vue'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { onMounted, reactive, ref, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { ChevronsUpDown, Check } from 'lucide-vue-next'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { cn } from '@/lib/utils'
import { usePatientStore } from '@/stores/patient'
import { toast } from 'vue-sonner'
import type { GetAllPatientsResponse } from '@/interfaces/patient.interface'
import { DateFormatter, type DateValue, getLocalTimeZone } from '@internationalized/date'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon } from 'lucide-vue-next'
import type { CoverageCompany, GetAllCompaniesResponse } from '@/interfaces/company.interface'
import { useCompanyStore } from '@/stores/company'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { usePolicyStore } from '@/stores/policy'
import { useRouter } from 'vue-router'
import type { CreatePolicyResponse } from '@/interfaces/policy.interface'

const df = new DateFormatter('en-US', {
  dateStyle: 'long',
})

const router = useRouter()

const patientStore = usePatientStore()

// copas
const openPatientDropDown = ref<boolean>(false)
const selectedPatientId = ref<string | null>(null)

const openCompanyDropDown = ref<boolean>(false)
const selectedCompanyId = ref<string | null>(null)

const expiryDate = ref<DateValue>()
const coverages = ref<CoverageCompany[] | null>(null)

// copas
const state = reactive<{
  patients: {
    value: string
    label: string
  }[]
  companies?: {
    value: string
    label: string
  }[]
}>({
  patients: [],
})

const createPolicy = () => {
  if (!selectedPatientId.value || !selectedCompanyId.value || !expiryDate.value) {
    return
  }

  toast.promise(
    usePolicyStore().createPolicy({
      companyId: selectedCompanyId.value,
      expiryDate: expiryDate.value,
      patientId: selectedPatientId.value,
    }),
    {
      loading: 'Creating policy...',
      success: (data: CreatePolicyResponse) => {
        router.push('/policies')
        return data.message
      },
      error: (data: CreatePolicyResponse) => data.message,
    },
  )
}

onMounted(async () => {
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
})

watch(selectedPatientId, async (newId) => {
  if (newId != null) {
    patientStore.patient = patientStore.patients.find((patient) => patient.id === newId)
    console.log(patientStore.patient)

    toast.promise(useCompanyStore().getAllCompanies(), {
      loading: 'Loading companies...',
      success: (response: GetAllCompaniesResponse) => {
        state.companies = response.data.map((company) => ({
          value: company.id,
          label: company.name,
        }))
        return 'Companies loaded successfully.'
      },
      error: 'Failed to load companies. Please try again.',
    })
  }
})

watch(selectedCompanyId, async (newId) => {
  if (newId != null) {
    const companies = useCompanyStore().companies
    const findCompanies = companies.find((company) => company.id === newId)
    coverages.value = findCompanies ? findCompanies.coverages : null
  }

  console.log(coverages.value)
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
                <RouterLink to="/policies/new">New</RouterLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </template>
    </Header>

    <main class="m-4 p-4 bg-glacier rounded-2xl min-h-screen">
      <h1>Create Policy</h1>

      <div>
        <div class="flex flex-col gap-2 w-fit">
          <!-- copas -->
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

        <div v-if="selectedPatientId != null">
          <!-- Display patient details -->
          <div class="mt-4 p-4 border rounded-lg bg-white" v-if="patientStore.patient">
            <p><strong>NIK:</strong> {{ patientStore.patient.nik }}</p>
            <p><strong>Name:</strong> {{ patientStore.patient.name }}</p>
            <p><strong>Gender:</strong> {{ patientStore.patient.gender }}</p>
            <p>
              <strong>Date of Birth:</strong> {{ patientStore.patient.birthPlace }},
              {{ patientStore.patient.birthDate }}
            </p>
            <p><strong>Class:</strong> {{ patientStore.patient.pClass }}</p>
            <p>
              <strong>Insurance Limit:</strong>
              {{
                new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                }).format(patientStore.patient.insuranceLimit)
              }}
            </p>
          </div>

          <div class="mt-4 p-4 border rounded-lg bg-white">
            <div>
              <Label>Expiry Date</Label>
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
                      expiryDate ? df.format(expiryDate.toDate(getLocalTimeZone())) : 'Pick a date'
                    }}
                  </Button>
                </PopoverTrigger>
                <PopoverContent class="w-auto p-0">
                  <Calendar v-model="expiryDate" initial-focus />
                </PopoverContent>
              </Popover>
            </div>

            <div v-if="state.companies">
              <Label>Companies</Label>
              <Popover v-model="openCompanyDropDown">
                <PopoverTrigger as-child>
                  <Button
                    variant="outline"
                    role="combobox"
                    :aria-expanded="openCompanyDropDown"
                    :class="
                      cn(
                        'w-[280px] justify-start text-left font-normal',
                        !selectedCompanyId && 'text-muted-foreground',
                      )
                    "
                  >
                    <CalendarIcon class="mr-2 h-4 w-4" />
                    {{
                      selectedCompanyId
                        ? state.companies.find((company) => company.value === selectedCompanyId)
                            ?.label
                        : 'Select a company'
                    }}
                  </Button>
                </PopoverTrigger>
                <PopoverContent class="w-auto p-0">
                  <Command>
                    <!-- TODO: minor. company input name nya gabisa -->
                    <!-- <CommandInput placeholder="Search company..." class="h-9" /> -->
                    <CommandEmpty v-if="state.companies?.length === 0"
                      >No company found.</CommandEmpty
                    >
                    <CommandGroup>
                      <CommandItem
                        v-for="company in state.companies"
                        :key="company.value"
                        :value="company.value"
                        @select="
                          (ev) => {
                            if (typeof ev.detail.value === 'string') {
                              selectedCompanyId = ev.detail.value
                            }
                            openCompanyDropDown = false
                          }
                        "
                      >
                        {{ company.label }}
                        <Check
                          :class="
                            cn(
                              'ml-auto h-4 w-4',
                              selectedCompanyId === company.value ? 'opacity-100' : 'opacity-0',
                            )
                          "
                        />
                      </CommandItem>
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div v-if="coverages">
              <div>
                <p>
                  Total Coverage:
                  {{
                    new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                    }).format(
                      coverages.reduce((total, coverage) => total + coverage.coverageAmount, 0),
                    )
                  }}
                </p>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No.</TableHead>
                    <TableHead>Coverage</TableHead>
                    <TableHead>Coverage Amount</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  <TableRow v-for="(coverage, index) in coverages" :key="index">
                    <TableCell>{{ index + 1 }}</TableCell>
                    <TableCell>{{ coverage.name }}</TableCell>
                    <TableCell>{{
                      new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(
                        coverage.coverageAmount,
                      )
                    }}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <div>
                <Button @click="createPolicy()">Create</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
