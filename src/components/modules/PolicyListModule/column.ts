import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'
import DataTableDropdown from '@/components/modules/PolicyListModule/PolicyDataTableDropdown.vue'
import { Button } from '@/components/ui/button'
import { ArrowUpDown } from 'lucide-vue-next'
import { Checkbox } from '@/components/ui/checkbox'
import { getPolicyStatusLabel, type PolicyColumn } from '@/interfaces/policy.interface'

export const columns: ColumnDef<PolicyColumn>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(Checkbox, {
        checked: table.getIsAllPageRowsSelected(),
        'onUpdate:checked': (value: boolean) => table.toggleAllPageRowsSelected(!!value),
        ariaLabel: 'Select all',
      }),
    cell: ({ row }) =>
      h(Checkbox, {
        checked: row.getIsSelected(),
        'onUpdate:checked': (value: boolean) => row.toggleSelected(!!value),
        ariaLabel: 'Select row',
      }),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'idPolicy',
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => ['ID Policy', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })],
      )
    },
    cell: ({ row }) => h('div', { class: '' }, row.getValue('idPolicy')),
  },
  {
    accessorKey: 'patientName',
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => ['Nama Pasien', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })],
      )
    },
    cell: ({ row }) => h('div', { class: '' }, row.getValue('patientName')),
  },
  {
    accessorKey: 'companyName',
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => ['Perusahaan', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })],
      )
    },
    cell: ({ row }) => h('div', { class: 'text-left' }, row.getValue('companyName')),
  },
  {
    accessorKey: 'totalCoverage',
    header: () => h('div', { class: 'text-left' }, 'Total Coverage'),
    cell: ({ row }) => {
      const totalCoverage = Number.parseFloat(row.getValue('totalCoverage'))
      const formatted = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
      }).format(totalCoverage)

      return h('div', { class: 'text-left font-medium' }, formatted)
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => ['Status', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })],
      )
    },
    cell: ({ row }) => h('div', { class: '' }, getPolicyStatusLabel(row.getValue('status'))),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const { idPolicy } = row.original

      return h(
        'div',
        { class: 'relative' },
        h(DataTableDropdown, {
          idPolicy,
          onExpand: row.toggleExpanded,
        }),
      )
    },
  },
]
