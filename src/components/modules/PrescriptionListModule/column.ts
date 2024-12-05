import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'
import { Button } from '@/components/ui/button'
import { ArrowUpDown } from 'lucide-vue-next'
import { Checkbox } from '@/components/ui/checkbox'
import { getPrescriptionStatusLabel, type PrescriptionColumn } from '@/interfaces/prescription.interface'
import { RouterLink } from 'vue-router'

export const columns: ColumnDef<PrescriptionColumn>[] = [
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
    accessorKey: 'idPrescription',
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => ['ID', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })],
      )
    },
    cell: ({ row }) => h('div', { class: '' }, row.getValue('idPrescription')),
  },
  {
    accessorKey: 'createdDate',
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'desc'),
        },
        () => ['Created Date', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })],
      )
    },
    cell: ({ row }) => h('div', { class: 'text-left' }, row.getValue('createdDate')),
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
        () => ['Patient Name', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })],
      )
    },
    cell: ({ row }) => h('div', { class: '' }, row.getValue('patientName')),
  },
  {
    accessorKey: 'totalPrice',
    header: () => h('div', { class: 'text-left' }, 'Total Price'),
    cell: ({ row }) => {
      const totalPrice = Number.parseFloat(row.getValue('totalPrice'))
      const formatted = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
      }).format(totalPrice)

      return h('div', { class: 'text-left font-medium' }, formatted)
    },
  },
  {
    accessorKey: 'prescriptionStatus',
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
    cell: ({ row }) => h('div', { class: '' }, getPrescriptionStatusLabel(row.getValue('prescriptionStatus'))),
  },
  {
    id: 'actions',
    enableHiding: false,
    header: () => h('div', { class: 'text-left' }, 'Action'),
    cell: ({ row }) => {
      const { idPrescription } = row.original
  
      return h(
        'div',
        { class: 'relative' },
        h(
          RouterLink,
          {
            to: `/prescriptions/${idPrescription}`,
          },
          () => h(Button, { class: 'detail-button' }, 'Detail')
        )
      )
    },
  }
]
