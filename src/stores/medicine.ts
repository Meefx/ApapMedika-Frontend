import type {
    DeleteMedicineResponse,
    GetAllMedicinesResponse,
    GetDetailMedicineResponse,
    MedicineState,
} from '@/interfaces/medicine.interface'
import { customFetch, customFetchBody } from '@/utils/customFetch'
import { defineStore } from 'pinia'

export const useMedicineStore = defineStore('medicine', {
    state: () =>
        ({
            medicines: [],
            medicine: undefined,
        }) as MedicineState,
    actions: {
        async getMedicines(): Promise<GetAllMedicinesResponse> {
            const response = await customFetch<GetAllMedicinesResponse>(
                `${import.meta.env.VITE_PHARMACY_API}/api/medicines`,
                {
                    uploadFile: false,
                    isAuthorized: true,
                    method: 'GET',
                },
            );

            if (response.status < 200 || response.status >= 300) {
                throw new Error(response.message);
            }

            this.medicines = response.data;

            return response;
        },

        async getDetailMedicine(idMedicine: string): Promise<GetDetailMedicineResponse> {
            const response = await customFetch<GetDetailMedicineResponse>(
              `${import.meta.env.VITE_PHARMACY_API}/api/medicines/${idMedicine}`,
              {
                uploadFile: false,
                isAuthorized: true,
                method: 'GET',
              },
            )
      
            if (response.status < 200 || response.status >= 300) {
              throw new Error(response.message)
            }
      
            this.medicine = response.data
      
            return response
        },

        async addMedicineStock(idMedicine: string, addedStock: number): Promise<GetDetailMedicineResponse> {
            const response = await customFetch<GetDetailMedicineResponse>(
              `${import.meta.env.VITE_PHARMACY_API}/api/medicines/update-stock`,
              {
                uploadFile: false,
                isAuthorized: true,
                method: 'PUT',
                body: customFetchBody({
                  id: idMedicine,
                  addedStock: addedStock,
                }),
              },
            )
      
            if (response.status < 200 || response.status >= 300) {
              throw new Error(response.message)
            }
      
            this.medicine = response.data
      
            return response
        },

        async deleteMedicine(idMedicine: string): Promise<DeleteMedicineResponse> {
            const response = await customFetch<DeleteMedicineResponse>(
              `${import.meta.env.VITE_PHARMACY_API}/api/medicines/${idMedicine}/delete`,
              {
                uploadFile: false,
                isAuthorized: true,
                method: 'DELETE',
              },
            )
      
            if (response.status < 200 || response.status >= 300) {
              throw new Error(response.message)
            }
      
            await this.getMedicines()
      
            return response
        },
    },
})
