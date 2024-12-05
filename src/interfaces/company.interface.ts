import type { FetchBaseResponse } from '@/utils/customFetch/interface'

export interface Company {
  id: string
  name: string
  contact: string
  email: string
  address: string
  coverages: CoverageCompany[]
}

export interface CoverageCompany {
  id: string
  name: string
  coverageAmount: number
}

export interface CompanyState {
  companies: Company[]
}

export interface GetAllCompaniesResponse extends FetchBaseResponse {
  data: Company[]
}
