<script setup lang="ts">
import { onMounted } from 'vue'
import { DataTable } from 'simple-datatables'
import Button from '@/components/ui/button/Button.vue'
import { useAppointmentStore } from '@/stores/appointment'
import { useUserStore } from '@/stores/user'
import { AppointmentListModule } from '@/components/modules/AppointmentListModule'
import Header from '@/components/elements/Header/Header.vue';
import Breadcrumb from '@/components/ui/breadcrumb/Breadcrumb.vue';
import BreadcrumbList from '@/components/ui/breadcrumb/BreadcrumbList.vue';
import BreadcrumbItem from '@/components/ui/breadcrumb/BreadcrumbItem.vue';
import BreadcrumbLink from '@/components/ui/breadcrumb/BreadcrumbLink.vue';

const appointmentStore = useAppointmentStore()
const userStore = useUserStore()

console.log("TOKEN: ",userStore.accessToken)

</script>

<style scoped>
.message-layer {
    @apply w-full h-screen flex items-center justify-center;
}

.add-button {
    @apply bg-green-600 hover:bg-green-800 text-white;
}

.detail-button {
    @apply bg-cyan-600 hover:bg-cyan-800 text-white;
}

.edit-button {
    @apply bg-amber-600 hover:bg-amber-800 text-white;
}
#default-table {
    width: 100%;
    table-layout: auto;
}

td,
th {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>


<template>
    <div>
        <Header>
            <template #breadcumb>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/appointment">
                                Appointment
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </template>
        </Header>

        <main class="m-4 p-4 rounded-2xl min-h-screen">
        <!-- <main class="flex items-center justify-center w-full h-full"> -->
            <div class="w-full">
                <!-- List module -->
                <AppointmentListModule />
            </div>

        </main>
        <!-- </main> -->
    </div>
</template>