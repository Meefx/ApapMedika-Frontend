import type { Facility } from '@/interfaces/facility.interface'
import { customFetch } from '@/utils/customFetch'
import { defineStore } from 'pinia'

interface FacilityResponse {
  status: number
  message: string
  data: Facility[]
}

export const useFacilityStore = defineStore('facility', {
  state: () => ({
    facilities: [] as Facility[]
  }),
  actions: {
    async getFacilities(): Promise<FacilityResponse> {
      const response = await customFetch<FacilityResponse>(
        `${import.meta.env.VITE_RESERVATION_API}/api/facilities`,
        {
          uploadFile: false,
          isAuthorized: true,
          method: 'GET',
        }
      )

      if (response.status < 200 || response.status >= 300) {
        throw new Error(response.message)
      }

      this.facilities = response.data
      return response
    }
  }
})
