import type {
  CancelPolicyResponse,
  CreatePolicy,
  CreatePolicyResponse,
  DeletePolicyResponse,
  GetAllPoliciesResponse,
  GetDetailPolicyResponse,
  PolicyState,
} from '@/interfaces/policy.interface'
import { customFetch, customFetchBody } from '@/utils/customFetch'
import { defineStore } from 'pinia'
import { getLocalTimeZone, type DateValue } from '@internationalized/date'

export const usePolicyStore = defineStore('policy', {
  state: () =>
    ({
      policies: [],
      policy: undefined,
    }) as PolicyState,
  actions: {
    async getAllPolicies({
      status,
      minCoverage,
      maxCoverage,
    }: {
      status?: string
      minCoverage?: number | null
      maxCoverage?: number | null
    }): Promise<GetAllPoliciesResponse> {
      const url = new URL(`${import.meta.env.VITE_INSURANCE_API}/api/policies`)
      url.searchParams.set('status', status || '')
      url.searchParams.set('minCoverage', minCoverage?.toString() || '')
      url.searchParams.set('maxCoverage', maxCoverage?.toString() || '')

      const response = await customFetch<GetAllPoliciesResponse>(url.toString(), {
        uploadFile: false,
        isAuthorized: true,
        method: 'GET',
      })

      if (response.status < 200 || response.status >= 300) {
        throw new Error(response.message)
      }

      this.policies = response.data

      return response
    },

    async cancelPolicy(idPolicy: string): Promise<CancelPolicyResponse> {
      const response = await customFetch<CancelPolicyResponse>(
        `${import.meta.env.VITE_INSURANCE_API}/api/policies/${idPolicy}/cancel`,
        {
          uploadFile: false,
          isAuthorized: true,
          method: 'PUT',
        },
      )

      if (response.status < 200 || response.status >= 300) {
        throw new Error(response.message)
      }

      await this.getAllPolicies({})
      await this.getDetailPolicy(idPolicy)

      return response
    },

    async deletePolicy(idPolicy: string): Promise<DeletePolicyResponse> {
      const response = await customFetch<CancelPolicyResponse>(
        `${import.meta.env.VITE_INSURANCE_API}/api/policies/${idPolicy}/delete`,
        {
          uploadFile: false,
          isAuthorized: true,
          method: 'DELETE',
        },
      )

      if (response.status < 200 || response.status >= 300) {
        throw new Error(response.message)
      }

      await this.getAllPolicies({})

      return response
    },

    async getDetailPolicy(idPolicy: string): Promise<GetDetailPolicyResponse> {
      const response = await customFetch<GetDetailPolicyResponse>(
        `${import.meta.env.VITE_INSURANCE_API}/api/policies/${idPolicy}`,
        {
          uploadFile: false,
          isAuthorized: true,
          method: 'GET',
        },
      )

      if (response.status < 200 || response.status >= 300) {
        throw new Error(response.message)
      }

      this.policy = response.data

      return response
    },

    async updatePolicy(idPolicy: string, expiryDate: DateValue): Promise<GetDetailPolicyResponse> {
      const response = await customFetch<GetDetailPolicyResponse>(
        `${import.meta.env.VITE_INSURANCE_API}/api/policies/update`,
        {
          uploadFile: false,
          isAuthorized: true,
          method: 'PUT',
          body: customFetchBody({
            id: idPolicy,
            expiryDate: expiryDate.toDate(getLocalTimeZone()).toISOString().slice(0, 10),
          }),
        },
      )

      if (response.status < 200 || response.status >= 300) {
        throw new Error(response.message)
      }

      this.policy = response.data

      return response
    },

    async createPolicy({
      companyId,
      expiryDate,
      patientId,
    }: CreatePolicy): Promise<CreatePolicyResponse> {
      const convertedDate = expiryDate.toDate(getLocalTimeZone())

      const response = await customFetch<CreatePolicyResponse>(
        `${import.meta.env.VITE_INSURANCE_API}/api/policies`,
        {
          uploadFile: false,
          isAuthorized: true,
          method: 'POST',
          body: customFetchBody({
            companyId,
            expiryDate: `${convertedDate.getFullYear()}-${convertedDate.getMonth() + 1}-${convertedDate.getDate()}`,
            patientId,
          }),
        },
      )

      if (response.status < 200 || response.status >= 300) {
        throw new Error(response.message)
      }

      return response
    },
  },
})
