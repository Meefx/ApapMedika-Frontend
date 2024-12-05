import type { GetAllPrescriptionsResponse, PrescriptionState } from "@/interfaces/prescription.interface"
import { customFetch } from "@/utils/customFetch"
import { defineStore } from "pinia"

export const usePrescriptionStore = defineStore('prescription', {
    state: () =>
        ({
        prescriptions: [],
        prescription: undefined,
        }) as PrescriptionState,
    actions: {
        async getPrescriptions({
            status,
          }: {
            status?: string;
          }): Promise<GetAllPrescriptionsResponse> {

            const url = new URL(`${import.meta.env.VITE_PHARMACY_API}/api/prescriptions`)

            if (status) {
                url.searchParams.set('status', status)
            }

            const response = await customFetch<GetAllPrescriptionsResponse>(
                url.toString(),
                {
                uploadFile: false,
                isAuthorized: true,
                method: 'GET',
                },
            )

            if (response.status < 200 || response.status >= 300) {
                throw new Error(response.message)
            }

            this.prescriptions = response.data

            return response
        },
    },
})
