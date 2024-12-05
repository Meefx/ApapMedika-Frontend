import type { CompanyState, GetAllCompaniesResponse } from '@/interfaces/company.interface'
import { customFetch } from '@/utils/customFetch'
import { defineStore } from 'pinia'

export const useCompanyStore = defineStore('company', {
  state: () =>
    ({
      companies: [],
    }) as CompanyState,
  actions: {
    async getAllCompanies(): Promise<GetAllCompaniesResponse> {
      const response = await customFetch<GetAllCompaniesResponse>(
        `${import.meta.env.VITE_INSURANCE_API}/api/companies`,
        {
          uploadFile: false,
          isAuthorized: true,
          method: 'GET',
        },
      )

      if (response.status < 200 || response.status >= 300) {
        throw new Error(response.message)
      }

      this.companies = response.data

      return response
    },
  },
})
