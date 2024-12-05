import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'
import { Button } from '@/components/ui/button'
import { ArrowUpDown } from 'lucide-vue-next'
import { Checkbox } from '@/components/ui/checkbox'
import type { MedicineColumn } from '@/interfaces/medicine.interface'
import { RouterLink } from 'vue-router'

export const columns: ColumnDef<MedicineColumn>[] = [
  {
    accessorKey: 'idMedicine',
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => ['ID Medicine', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })],
      )
    },
    cell: ({ row }) => h('div', { class: 'font-medium' }, row.getValue('idMedicine')),
  },
  {
    accessorKey: 'medicineName',
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => ['Nama Obat', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })],
      )
    },
    cell: ({ row }) => h('div', { class: '' }, row.getValue('medicineName')),
  },
  {
    accessorKey: 'medicineStock',
    header: () => h('div', { class: 'text-left' }, 'Stok'),
    cell: ({ row }) => {
      const medicineStock = Number.parseFloat(row.getValue('medicineStock'))

      return h('div', { class: 'text-left' }, medicineStock
      )
    },
  },
  {
    accessorKey: 'medicinePrice',
    header: () => h('div', { class: 'text-left' }, 'Harga'),
    cell: ({ row }) => {
      const medicinePrice = Number.parseFloat(row.getValue('medicinePrice'))
      const formatted = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
      }).format(medicinePrice)

      return h('div', { class: 'text-left' }, formatted)
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    header: () => h('div', { class: 'text-left' }, 'Action'),
    cell: ({ row }) => {
      const { idMedicine } = row.original
  
      return h(
        'div',
        { class: 'relative' },
        h(
          RouterLink,
          {
            to: `/medicines/${idMedicine}`,
          },
          () => h(Button, { class: 'detail-button' }, 'Detail')
        )
      )
    },
  }
]
