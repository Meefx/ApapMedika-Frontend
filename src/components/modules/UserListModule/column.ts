import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'
import { Button } from '@/components/ui/button'
import { ArrowUpDown } from 'lucide-vue-next'
import { Checkbox } from '@/components/ui/checkbox'
import { Role, type UserColumn } from '@/interfaces/user.interface'
import { useUserStore } from '@/stores/user'

export const columns: ColumnDef<UserColumn>[] = [
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
    accessorKey: 'id',
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => ['ID User', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })],
      )
    },
    cell: ({ row }) => h('div', { class: '' }, row.getValue('id')),
  },
  {
    accessorKey: 'username',
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => ['Username', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })],
      )
    },
    cell: ({ row }) => h('div', { class: '' }, row.getValue('username')),
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => ['Nama User', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })],
      )
    },
    cell: ({ row }) => h('div', { class: 'text-left' }, row.getValue('name')),
  },
  {
    accessorKey: 'gender',
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => ['Gender', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })],
      )
    },
    cell: ({ row }) => h('div', { class: 'text-left' }, row.getValue('gender')),
  },
  {
    accessorKey: 'role',
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => ['Role', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })],
      )
    },
    cell: ({ row }) => h('div', { class: 'text-left' }, row.getValue('role')),
  },
  // {
  //   accessorKey: 'status',
  //   header: ({ column }) => {
  //     return h(
  //       Button,
  //       {
  //         variant: 'ghost',
  //         onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
  //       },
  //       () => ['Status', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })],
  //     )
  //   },
  //   cell: ({ row }) => h('div', { class: '' }, getAppointmentStatusLabel(row.getValue('status'))),
  // },
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
      const { id, role } = row.original
      const userStore = useUserStore()

      const handleUpgradeClass = async () => {
        const confirmed = window.confirm('Are you sure you want to upgrade this patient class?')
        if (!confirmed) {
          return
        }
        try {
          const response = await fetch(
            `${import.meta.env.VITE_PROFILE_API}/api/patients/upgrade-class`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userStore.accessToken}`,
              },
              body: JSON.stringify({ patientId: id }),
            },
          )
          if (!response.ok) {
            throw new Error('Failed to upgrade class')
          }
          alert('Class upgraded successfully')
        } catch (error) {
          console.error('Error upgrading class:', error)
          alert('Failed to upgrade class')
        }
      }

      return h(
        Button,
        {
          variant: 'default',
          onClick: handleUpgradeClass,
          disabled: role !== Role.PATIENT,
        },
        'Upgrade Class',
      )
    },
  },
]
