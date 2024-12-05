<script setup lang="ts" generic="TData, TValue">
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  ExpandedState,
} from '@tanstack/vue-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getExpandedRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import { valueUpdater } from '@/lib/utils'
import { ref, watch } from 'vue'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, Loader } from 'lucide-vue-next'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { policyStatusValues } from '@/interfaces/policy.interface'
import { usePolicyStore } from '@/stores/policy'
import { toast } from 'vue-sonner'

const props = defineProps<{
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading: boolean
}>()

const status = ref<string | undefined>()
const minCoverage = ref<number | null>(null)
const maxCoverage = ref<number | null>(null)

watch([minCoverage, maxCoverage, status], async () => {
  toast.promise(
    usePolicyStore().getAllPolicies({
      status: status.value,
      minCoverage: minCoverage.value,
      maxCoverage: maxCoverage.value,
    }),
    {
      loading: 'Loading policies...',
      success: 'Policies loaded',
      error: 'Error loading policies',
    },
  )
})

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})
const expanded = ref<ExpandedState>({})

const table = useVueTable({
  get data() {
    return props.data
  },
  get columns() {
    return props.columns
  },
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnFilters),
  getFilteredRowModel: getFilteredRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  onColumnVisibilityChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnVisibility),
  onRowSelectionChange: (updaterOrValue) => valueUpdater(updaterOrValue, rowSelection),
  onExpandedChange: (updaterOrValue) => valueUpdater(updaterOrValue, expanded),
  state: {
    get sorting() {
      return sorting.value
    },
    get columnFilters() {
      return columnFilters.value
    },
    get columnVisibility() {
      return columnVisibility.value
    },
    get rowSelection() {
      return rowSelection.value
    },
    get expanded() {
      return expanded.value
    },
  },
})
</script>

<template>
  <div>
    <div class="flex items-center py-4">
      <div class="grid grid-cols-[1.5fr,1fr] grid-rows-[auto,auto] gap-x-3 gap-y-2">
        <Input
          class="max-w-sm"
          placeholder="Search Patient..."
          :model-value="table.getColumn('patientName')?.getFilterValue() as string"
          @update:model-value="table.getColumn('patientName')?.setFilterValue($event)"
        />

        <Select v-model="status">
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem
                v-for="(status, index) in policyStatusValues"
                :key="index"
                :value="status"
                >{{ status }}</SelectItem
              >
            </SelectGroup>
          </SelectContent>
        </Select>

        <div class="flex gap-3 col-span-2">
          <Input
            placeholder="Min. total coverage"
            type="number"
            @change="
              (event: Event) => {
                const target = event.target as HTMLInputElement
                minCoverage = target ? parseInt(target.value) : 0
              }
            "
          />
          <Input
            placeholder="Max. total coverage"
            type="number"
            @change="
              (event: Event) => {
                const target = event.target as HTMLInputElement
                maxCoverage = target ? parseInt(target.value) : 0
              }
            "
          />
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="outline" class="ml-auto">
            Columns
            <ChevronDown class="w-4 h-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuCheckboxItem
            v-for="column in table.getAllColumns().filter((column) => column.getCanHide())"
            :key="column.id"
            class="capitalize"
            :checked="column.getIsVisible()"
            @update:checked="
              (value) => {
                column.toggleVisibility(!!value)
              }
            "
          >
            {{ column.id }}
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <div class="border rounded-md">
      <Table>
        <TableHeader class="bg-white">
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead v-for="header in headerGroup.headers" :key="header.id">
              <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
                class="text-black"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <template v-for="row in table.getRowModel().rows" :key="row.id">
              <TableRow :data-state="row.getIsSelected() ? 'selected' : undefined">
                <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                  <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                </TableCell>
              </TableRow>
              <TableRow v-if="row.getIsExpanded()">
                <TableCell :colspan="row.getAllCells().length">
                  {{ JSON.stringify(row.original) }}
                </TableCell>
              </TableRow>
            </template>
          </template>
          <template v-else-if="props.isLoading">
            <TableRow>
              <TableCell :colspan="columns.length" class="h-24 text-center">
                <Loader class="animate-spin text-white mx-auto" />
                <!-- TODO: harusnya "No results." dan ada indikator loading nya kal loading -->
              </TableCell>
            </TableRow>
          </template>
          <template v-else>
            <TableRow>
              <TableCell :colspan="columns.length" class="h-24 text-center">
                No Results.
                <!-- TODO: harusnya "No results." dan ada indikator loading nya kal loading -->
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>

    <div class="flex items-center justify-end py-4 space-x-2">
      <div class="flex-1 text-sm text-black">
        {{ table.getFilteredSelectedRowModel().rows.length }} of
        {{ table.getFilteredRowModel().rows.length }} row(s) selected.
      </div>

      <div class="space-x-2">
        <Button
          variant="outline"
          size="sm"
          :disabled="!table.getCanPreviousPage()"
          @click="table.previousPage()"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          :disabled="!table.getCanNextPage()"
          @click="table.nextPage()"
        >
          Next
        </Button>
      </div>
    </div>
  </div>
</template>
