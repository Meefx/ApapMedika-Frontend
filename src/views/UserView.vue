<script setup lang="ts">
import { onMounted } from 'vue'
import { DataTable } from 'simple-datatables'
import Button from '@/components/ui/button/Button.vue'
import { useUserStore } from '@/stores/user'
import { UserListModule } from '@/components/modules/UserListModule'
import Header from '@/components/elements/Header/Header.vue';
import Breadcrumb from '@/components/ui/breadcrumb/Breadcrumb.vue';
import BreadcrumbList from '@/components/ui/breadcrumb/BreadcrumbList.vue';
import BreadcrumbItem from '@/components/ui/breadcrumb/BreadcrumbItem.vue';
import BreadcrumbLink from '@/components/ui/breadcrumb/BreadcrumbLink.vue';

const userStore = useUserStore()

console.log("TOKEN: ",userStore.accessToken)

</script>

<style scoped>
</style>


<template>
    <div>
        <Header>
            <template #breadcumb>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/users">
                                Users
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
                <UserListModule />
            </div>

        </main>
        <!-- </main> -->
    </div>
</template>