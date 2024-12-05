import type {
  GetAllPatientsResponse,
  GetDetailPatientResponse,
  PatientState,
} from '@/interfaces/patient.interface'
import { customFetch } from '@/utils/customFetch'
import { defineStore } from 'pinia'

export const usePatientStore = defineStore('patient', {
  state: () =>
    ({
      patients: [],
      patient: undefined,
    }) as PatientState,
  actions: {
    async getAllPatients(): Promise<GetAllPatientsResponse> {
      const response = await customFetch<GetAllPatientsResponse>(
        `${import.meta.env.VITE_PROFILE_API}/api/patients`,
        {
          uploadFile: false,
          isAuthorized: true,
          method: 'GET',
        },
      )

      if (response.status < 200 || response.status >= 300) {
        throw new Error(response.message)
      }

      this.patients = response.data

      return response
    },

    async getDetailPatient(idPatient: string): Promise<GetDetailPatientResponse> {
      const response = await customFetch<GetDetailPatientResponse>(
        `${import.meta.env.VITE_PROFILE_API}/api/patients/${idPatient}`,
        {
          uploadFile: false,
          isAuthorized: true,
          method: 'GET',
        },
      )

      if (response.status < 200 || response.status >= 300) {
        throw new Error(response.message)
      }

      this.patient = response.data

      return response
    },

    async getPatientByNIK(nik: string): Promise<GetDetailPatientResponse> {
      const response = await customFetch<GetDetailPatientResponse>(
        `${import.meta.env.VITE_PROFILE_API}/api/patients/nik/${nik}`,
        {
          uploadFile: false,
          isAuthorized: true,
          method: 'GET',
        }
      )

      if (response.status < 200 || response.status >= 300) {
        throw new Error(response.message)
      }

      return response
    }
  },
})
