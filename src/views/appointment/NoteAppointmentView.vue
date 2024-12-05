<script setup lang="ts">
import Header from '@/components/elements/Header/Header.vue';
import Breadcrumb from '@/components/ui/breadcrumb/Breadcrumb.vue';
import BreadcrumbList from '@/components/ui/breadcrumb/BreadcrumbList.vue';
import BreadcrumbItem from '@/components/ui/breadcrumb/BreadcrumbItem.vue';
import BreadcrumbLink from '@/components/ui/breadcrumb/BreadcrumbLink.vue';
import { useRoute, useRouter } from 'vue-router';
import type { AppointmentInterface } from '@/interfaces/appointment.interface';
import { useAppointmentStore } from '@/stores/appointment';
import { onMounted, ref } from 'vue';
import { format, parse } from 'date-fns';
import TagsInputCombobox from '@/components/ui/tags-input/TagsInputCombobox.vue';
import Button from '@/components/ui/button/Button.vue';
import { useUserStore } from '@/stores/user';
import type { UpdateAppointmentNoteInterface } from '@/interfaces/appointment.interface';
import { Treatments } from '@/interfaces/appointment.interface';

const router = useRouter()
const route = useRoute()

const { id: appointmentId } = route.params

const userStore = useUserStore()
const appointmentStore = useAppointmentStore()

const appointment = ref(undefined as undefined | AppointmentInterface)
const diagnosis = ref('')
const treatments = ref<string[]>([])
const errorMessage = ref('')

// Convert Treatments enum to an array of treatment names
const availableTreatments = Object.values(Treatments).filter(value => typeof value === 'string') as string[]

// Convert treatment names to enum values
const treatmentNamesToEnumValues = (names: string[]): number[] => {
  return names.map(name => availableTreatments.indexOf(name) + 1)
}

// Convert enum values to treatment names
const treatmentEnumValuesToNames = (values: number[]): string[] => {
  return values.map(value => availableTreatments[value - 1])
}

// Handle treatment updates
const handleValueUpdate = (newValues: string[]) => {
  treatments.value = newValues
  console.log('Selected treatments:', treatments.value)
}

const formatDate = (dateStr: string) => {
    try {
        if (dateStr.includes('T')) {
            return format(new Date(dateStr), 'EEEE, dd MMMM yyyy HH:mm:ss')
        }
        // Parse DD-MM-YYYY format
        return format(parse(dateStr, 'dd-MM-yyyy', new Date()), 'EEEE, dd MMMM yyyy')
    } catch (e) {
        console.error('Date parsing error:', e)
        return '-'
    }
}

const getAppointment = async () => {
    appointment.value = await appointmentStore.getAppointmentDetail(appointmentId as string, userStore.accessToken as string)
    if (appointment.value) {
        diagnosis.value = appointment.value.diagnosis || ''
        treatments.value = treatmentEnumValuesToNames(appointment.value.treatments?.map(t => t.id) || [])
    }
}

const handleSubmit = async () => {
    if (!diagnosis.value || treatments.value.length === 0) {
        errorMessage.value = 'Diagnosis and treatments are required.'
        return
    }

    // Confirmation message
    const confirmed = window.confirm('Are you sure you want to update the appointment with the current diagnosis and treatments?')
    if (!confirmed) {
        return
    }

    const updateNote: UpdateAppointmentNoteInterface = {
        appointmentId: appointmentId as string,
        diagnosis: diagnosis.value,
        treatmentIds: treatmentNamesToEnumValues(treatments.value)
    }

    try {
        await appointmentStore.updateAppointmentNote(updateNote, userStore.accessToken as string)
    } catch (error) {
        console.error('Failed to update appointment note:', error)
        router.back()
    }
}

onMounted(getAppointment)
</script>

<template>
    <div>
        <Header>
            <template #breadcrumb>
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

        <main class="w-full h-screen flex justify-center items-center bg-gray-400/30">
            <div class="w-[60%] flex flex-col gap-2 divide-y-2 bg-white drop-shadow-xl p-6 rounded-xl">
                <div class="w-full flex justify-between">
                <h1 class="text-green-600 font-bold text-xl">Detail Appointment</h1>
                </div>
                
                <div class="flex flex-col gap-2 py-4">
                <div class="flex flex-col gap-1 w-full">
                    <span>ID Appointment</span>
                    <span class="text-xl font-bold">{{ appointment?.id }}</span>
                </div>
                <div class="flex flex-col gap-1 w-full">
                    <span>Patient</span>
                    <span class="text-xl font-bold">{{ appointment?.patient?.name }}</span>
                </div>
                <div class="flex flex-col gap-1 w-full">
                    <span>Doctor</span>
                    <span class="text-xl font-bold">{{ appointment?.doctor?.name }}</span>
                </div>
                <div class="flex flex-col gap-1 w-full">
                    <span>Appointment Date</span>
                    <span class="text-xl font-bold">{{ appointment?.date ? formatDate(appointment.date) : "-" }}</span>
                </div>
                <div class="flex gap-12 w-full">
                    <div class="flex flex-col gap-1 w-1/3">
                        <span>Updated At</span>
                        <span class="text-xl font-bold">
                            {{ appointment?.updatedAt ? formatDate(appointment.updatedAt) : "-" }}
                        </span>
                    </div>
                    <div class="flex flex-col gap-1 w-1/3">
                        <span>Created At</span>
                        <span class="text-xl font-bold">
                            {{ appointment?.createdAt ? formatDate(appointment.createdAt) : "-" }}
                        </span>
                    </div>
                </div>
                </div>

                <!-- Diagnosis Section -->
                <div class="flex flex-col gap-1 w-full mt-3">
                    <h5 class="font-medium">Diagnosis</h5>
                    <textarea 
                    v-model="diagnosis"
                    class="w-full p-2 border rounded-md" 
                    rows="3" 
                    ></textarea>
                </div>

                <!-- Treatments Section -->
                <div class="flex flex-col gap-1 w-full mt-3">
                    <h5 class="font-medium">Treatments</h5>
                    <TagsInputCombobox 
                        :initial-values="treatments"
                        :available-options="availableTreatments"
                        @update:values="handleValueUpdate"
                    />
                </div>

                <div v-if="errorMessage" class="text-red-500 text-sm mt-2">
                    {{ errorMessage }}
                </div>

                <div class="flex gap-2 mt-4">
                    <Button @click="router.back()" class="bg-slate-600 hover:bg-slate-800 text-white">Kembali</Button>
                    <Button @click="handleSubmit" class="bg-green-600 hover:bg-green-800 text-white">Submit</Button>
                </div>
            </div>
        </main>
    </div>
</template>

<style scoped></style>