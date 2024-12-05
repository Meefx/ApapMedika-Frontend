<script lang="ts" setup>
import Sidebar from '@/components/ui/sidebar/Sidebar.vue'
import SidebarHeader from '@/components/ui/sidebar/SidebarHeader.vue'
import SidebarContent from '@/components/ui/sidebar/SidebarContent.vue'
import SidebarGroup from '@/components/ui/sidebar/SidebarGroup.vue'
import SidebarFooter from '@/components/ui/sidebar/SidebarFooter.vue'
import {
  BriefcaseMedical,
  CalendarCheck2,
  Hospital,
  Pill,
  Receipt,
  Siren,
  Users,
} from 'lucide-vue-next'
import SidebarGroupContent from '@/components/ui/sidebar/SidebarGroupContent.vue'
import SidebarMenu from '@/components/ui/sidebar/SidebarMenu.vue'
import SidebarMenuItem from '@/components/ui/sidebar/SidebarMenuItem.vue'
import SidebarMenuButton from '@/components/ui/sidebar/SidebarMenuButton.vue'
import { User2, ChevronsUpDown } from 'lucide-vue-next'
import DropdownMenu from '@/components/ui/dropdown-menu/DropdownMenu.vue'
import DropdownMenuTrigger from '@/components/ui/dropdown-menu/DropdownMenuTrigger.vue'
import DropdownMenuItem from '@/components/ui/dropdown-menu/DropdownMenuItem.vue'
import DropdownMenuContent from '@/components/ui/dropdown-menu/DropdownMenuContent.vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import type { SidebarItemProps } from './interface'
import { Role } from '@/interfaces/user.interface'
import { RouterLink } from 'vue-router'
import Button from '@/components/ui/button/Button.vue'

const userStore = useUserStore()
const router = useRouter()

const logout = async () => await userStore.logout(router)

const items: SidebarItemProps[] = [
  {
    title: 'Users',
    url: '/users',
    icon: Users,
    showWhen: userStore.user?.role == Role.ADMIN,
  },
  {
    title: 'Medicines',
    url: '/medicines',
    icon: BriefcaseMedical,
    showWhen: userStore.user?.role == Role.ADMIN || userStore.user?.role == Role.PHARMACIST,
  },
  {
    title: 'Appointments',
    url: '/appointment',
    icon: CalendarCheck2,
    showWhen:
      userStore.user?.role == Role.ADMIN ||
      userStore.user?.role == Role.DOCTOR ||
      userStore.user?.role == Role.NURSE ||
      userStore.user?.role == Role.PATIENT,
  },
  {
    title: 'Policies',
    url: '/policies',
    icon: Siren,
    showWhen: userStore.user?.role == Role.ADMIN || userStore.user?.role == Role.PATIENT,
  },
  {
    title: 'Reservations',
    url: '/reservation',
    icon: Hospital,
    showWhen:
      userStore.user?.role == Role.ADMIN ||
      userStore.user?.role == Role.NURSE ||
      userStore.user?.role == Role.PATIENT,
  },
  {
    title: 'Prescriptions',
    url: '/prescriptions',
    icon: Pill,
    showWhen: userStore.user?.role == Role.PATIENT || userStore.user?.role == Role.PHARMACIST,
  },
  {
    title: 'Bills',
    url: '/bills',
    icon: Receipt,
    showWhen: userStore.user?.role == Role.PATIENT,
  },
]
</script>

<template>
  <Sidebar>
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem class="font-bold bg-amaranth p-3 rounded-xl text-linen"
          >APAP Medika</SidebarMenuItem
        >
      </SidebarMenu>
    </SidebarHeader>

    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <template v-for="item in items">
              <SidebarMenuItem
                :key="item.title"
                v-if="item.showWhen"
                class="transition-all duration-300 hover:bg-iron p-3 rounded-xl"
              >
                <SidebarMenuButton as-child>
                  <RouterLink :to="item.url">
                    <component :is="item.icon" class="!w-6 !h-6" />
                    <span>{{ item.title }}</span>
                  </RouterLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </template>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>

    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <SidebarMenuButton class="bg-glacier text-white p-3 h-fit rounded-xl">
                <User2 class="!w-6 !h-6" />
                <span>{{ userStore.user?.name }}</span>
                <ChevronsUpDown class="ml-auto !w-6 !h-6" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" class="w-[--radix-popper-anchor-width]">
              <DropdownMenuItem>
                <RouterLink to="/account">
                  <span>Account</span>
                </RouterLink>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Billing</span>
              </DropdownMenuItem>
              <Button class="w-full bg-amaranth" @click="logout()" variant="destructive" as-child>
                <DropdownMenuItem>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  </Sidebar>
</template>

<style scoped></style>
