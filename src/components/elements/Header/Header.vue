<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { useRoute } from 'vue-router';
import SidebarTrigger from '@/components/ui/sidebar/SidebarTrigger.vue';

const route = useRoute()
const userStore = useUserStore()

</script>

<template>
	<div class="flex items-center gap-5 p-2">
		<SidebarTrigger v-if="route.meta.useSidebar && userStore.isLogged" />

		<slot name="breadcumb"></slot>
	</div>
</template>

<style scoped></style>