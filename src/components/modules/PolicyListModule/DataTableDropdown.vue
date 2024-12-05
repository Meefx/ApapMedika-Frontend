<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useUserStore } from '@/stores/user'
import { MoreHorizontal } from 'lucide-vue-next'
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
import { reactive } from 'vue'

const state = reactive<{
  isOpenCancelModal: boolean
  isOpenDeleteModal: boolean
}>({
  isOpenCancelModal: false,
  isOpenDeleteModal: false,
})

defineProps<{
  idPolicy: string
}>()

defineEmits<{
  (e: 'expand'): void
}>()

function copy(id: string) {
  navigator.clipboard.writeText(id)
}

const userStore = useUserStore()
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="w-8 h-8 p-0">
        <span class="sr-only">Open menu</span>
        <MoreHorizontal class="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuItem @click="copy(idPolicy)"> Lihat Detail Policy </DropdownMenuItem>
      <DropdownMenuItem @click="$emit('expand')"> Expand </DropdownMenuItem>
      <template v-if="userStore.user?.role == 'ADMIN'">
        <DropdownMenuSeparator />
        <DropdownMenuItem @click="() => (state.isOpenCancelModal = true)">
          Cancel Policy
        </DropdownMenuItem>

        <DropdownMenuItem>Hapus Policy</DropdownMenuItem>
      </template>
    </DropdownMenuContent>

    <AlertDialog :open="state.isOpenCancelModal">
      <AlertDialogContent class="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah anda yakin ingin membatalkan policy ini?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel as-child @click="() => (state.isOpenCancelModal = false)">
            <Button variant="secondary">Tidak</Button>
          </AlertDialogCancel>

          <AlertDialogAction as-child @click="() => (state.isOpenCancelModal = false)">
            <Button>Iya</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </DropdownMenu>
</template>
