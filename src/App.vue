<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
// import NavigationBar from '@/components/elements/NavigationBar/NavigationBar.vue';
import { useUserStore } from './stores/user'
import SidebarProvider from './components/ui/sidebar/SidebarProvider.vue'
import AppSidebar from '@/components/elements/AppSidebar/AppSidebar.vue'
import { Toaster } from './components/ui/sonner'

const userStore = useUserStore()
const route = useRoute()
</script>

<template>
  <!-- <NavigationBar v-if="userStore.isLogged" /> -->

  <SidebarProvider>
    <AppSidebar v-if="route.meta.useSidebar && userStore.isLogged" />

    <div class="flex-1">
      <RouterView />
    </div>
  </SidebarProvider>
  <Toaster />
</template>
