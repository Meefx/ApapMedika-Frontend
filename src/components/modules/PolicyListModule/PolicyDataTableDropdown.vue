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
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import { reactive } from 'vue'
import { toast } from 'vue-sonner'
import { usePolicyStore } from '@/stores/policy'
import { useRouter } from 'vue-router'

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

const router = useRouter()

const userStore = useUserStore()
const policyStore = usePolicyStore()
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
      <DropdownMenuItem @click="() => router.push(`/policies/${idPolicy}`)">
        Lihat Detail Policy
      </DropdownMenuItem>
      <DropdownMenuItem @click="$emit('expand')"> Expand </DropdownMenuItem>
      <template v-if="userStore.user?.role == 'ADMIN'">
        <DropdownMenuSeparator />
        <DropdownMenuItem @click="() => (state.isOpenCancelModal = true)">
          Cancel Policy
        </DropdownMenuItem>

        <DropdownMenuItem @click="() => (state.isOpenDeleteModal = true)"
          >Hapus Policy</DropdownMenuItem
        >
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

          <AlertDialogAction
            as-child
            @click="
              () => {
                state.isOpenCancelModal = false
                toast.promise(policyStore.cancelPolicy(idPolicy), {
                  loading: 'Membatalkan policy...',
                  success: 'Policy berhasil dibatalkan',
                  error: 'Gagal membatalkan policy',
                })
              }
            "
          >
            <Button>Iya</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <AlertDialog :open="state.isOpenDeleteModal">
      <AlertDialogContent class="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah anda yakin ingin menghapus policy ini?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel as-child @click="() => (state.isOpenDeleteModal = false)">
            <Button variant="secondary">Tidak</Button>
          </AlertDialogCancel>

          <AlertDialogAction
            as-child
            @click="
              () => {
                state.isOpenDeleteModal = false
                toast.promise(policyStore.deletePolicy(idPolicy), {
                  loading: 'Menghapus policy...',
                  success: 'Policy berhasil dihapus!',
                  error: 'Gagal menghapus policy',
                })
              }
            "
          >
            <Button>Iya</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </DropdownMenu>
</template>
