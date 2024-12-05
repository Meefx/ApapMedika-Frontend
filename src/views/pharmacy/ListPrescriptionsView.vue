<script setup lang="ts">
import Header from '@/components/elements/Header/Header.vue'
import Breadcrumb from '@/components/ui/breadcrumb/Breadcrumb.vue'
import BreadcrumbList from '@/components/ui/breadcrumb/BreadcrumbList.vue'
import BreadcrumbItem from '@/components/ui/breadcrumb/BreadcrumbItem.vue'
import BreadcrumbLink from '@/components/ui/breadcrumb/BreadcrumbLink.vue'
import { RouterLink } from 'vue-router'
import { PrescriptionListModule } from '@/components/modules/PrescriptionListModule'
</script>

<template>
  <div>
    <Header>
      <template #breadcumb>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>
                <RouterLink to="/prescriptions">Prescription</RouterLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </template>
    </Header>

    <main class="m-4 p-4 rounded-2xl min-h-screen">
        <div>
            <h1 class="text-2xl font-bold mb-4 text-center">List of Prescriptions</h1>
        </div>
        <PrescriptionListModule />
    </main>
  </div>
</template>

<style scoped></style>
