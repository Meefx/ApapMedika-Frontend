import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'
import { Button } from '@/components/ui/button'
import { ArrowUpDown } from 'lucide-vue-next'
import { Checkbox } from '@/components/ui/checkbox'
import {
  getAppointmentStatusLabel,
  type AppointmentColumn,
} from '@/interfaces/appointment.interface'
import { useRouter } from 'vue-router'

export const columns: ColumnDef<AppointmentColumn>[] = [
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
    accessorKey: 'idAppointment',
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => ['ID Appointment', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })],
      )
    },
    cell: ({ row }) => h('div', { class: '' }, row.getValue('idAppointment')),
  },
  {
    accessorKey: 'doctorName',
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => ['Nama Dokter', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })],
      )
    },
    cell: ({ row }) => h('div', { class: '' }, row.getValue('doctorName')),
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
    cell: ({ row }) => h('div', { class: 'text-left' }, row.getValue('patientName')),
  },
  {
    accessorKey: 'date',
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => ['Appointment Date', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })],
      )
    },
    cell: ({ row }) => h('div', { class: 'text-left' }, row.getValue('date')),
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
    cell: ({ row }) => h('div', { class: '' }, getAppointmentStatusLabel(row.getValue('status'))),
  },
  {
    id: 'actions',
    header: ({}) => {
      return h(
        Button,
        {
          variant: 'ghost',
        },
        () => ['Actions'],
      )
    },
    cell: ({ row }) => {
      const { idAppointment } = row.original
      const router = useRouter()

      return h(
        Button,
        {
          variant: 'default',
          onClick: () => router.push(`/appointment/${idAppointment}`),
        },
        'View Details',
      )
    },
  },
]
