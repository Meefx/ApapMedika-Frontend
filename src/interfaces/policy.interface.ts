import type { Gender, PClass } from '@/interfaces/user.interface'
import type { FetchBaseResponse } from '@/utils/customFetch/interface'
import type { DateValue } from '@internationalized/date'

export type PolicyStatus =
  | 'CREATED'
  | 'PARTIALLY_CLAIMED'
  | 'FULLY_CLAIMED'
  | 'EXPIRED'
  | 'CANCELLED'

export const policyStatusValues: PolicyStatus[] = [
  'CREATED',
  'PARTIALLY_CLAIMED',
  'FULLY_CLAIMED',
  'EXPIRED',
  'CANCELLED',
]

// TODO: masih boilerplate
export const getPolicyStatusColor = (status: PolicyStatus) => {
  switch (status) {
    case 'CREATED':
      return 'primary'
    case 'PARTIALLY_CLAIMED':
      return 'warning'
    case 'FULLY_CLAIMED':
      return 'danger'
    case 'EXPIRED':
      return 'danger'
    case 'CANCELLED':
      return 'danger'
  }
}

export const getPolicyStatusLabel = (status: PolicyStatus) => {
  switch (status) {
    case 'CREATED':
      return 'Created'
    case 'PARTIALLY_CLAIMED':
      return 'Partially Claimed'
    case 'FULLY_CLAIMED':
      return 'Fully Claimed'
    case 'EXPIRED':
      return 'Expired'
    case 'CANCELLED':
      return 'Cancelled'
  }
}

export interface Policy {
  id: string
  company: {
    id: string
    name: string
    contact: string
    email: string
    address: string
  }
  patient: {
    id: string
    name: string
    username: string
    email: string
    gender: Gender
    nik: string
    birthPlace: string
    birthDate: string
    pClass: PClass
  }
  coverages: Coverage[]
  status: PolicyStatus
  expiryDate: string
  totalCoverage: number
  totalCovered: number
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
}

export interface Coverage {
  id: string
  name: string
  coverageAmount: number
  status: CoverageStatus
}

export type CoverageStatus = 'USED' | 'NOT_USED'

export interface PolicyColumn {
  idPolicy: string
  patientName: string
  companyName: string
  totalCoverage: number
  status: PolicyStatus
}

export interface CoverageColumn {
  number: number
  name: string
  coverageAmount: number
  status: CoverageStatus
}

export interface GetAllPoliciesResponse extends FetchBaseResponse {
  data: Policy[]
}

export interface PolicyState {
  policies: Policy[]
  policy?: Policy
}

export interface CancelPolicyResponse extends FetchBaseResponse {
  data: Policy
}

export interface DeletePolicyResponse extends FetchBaseResponse {
  data: Policy
}

export interface GetDetailPolicyResponse extends FetchBaseResponse {
  data: Policy
}

export interface CreatePolicy {
  expiryDate: DateValue
  companyId: string
  patientId: string
}

export interface CreatePolicyResponse extends FetchBaseResponse {
  data: null
}
