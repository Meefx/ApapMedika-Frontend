import type { FetchBaseResponse } from '@/utils/customFetch/interface'
import type { Gender, PClass } from './user.interface'

export type BillStatus = 'TREATMENT_IN_PROGRESS' | 'UNPAID' | 'PAID'

export interface Bill {
  id: string
  status: BillStatus
}

export interface GetAllBillsResponse extends FetchBaseResponse {
  data: Bill[]
}

export interface BillColumn {
  number: number
  id: string
  status: BillStatus
}

export interface BillState {
  bills: Bill[]
  bill: BillDetail
}

export interface GetDetailBillResponse extends FetchBaseResponse {
  data: BillDetail
}

export interface BillDetail {
  id: string
  status: BillStatus
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
  policy?: {
    id: string
    totalCoverage: number
    totalCovered: number
  }
  appointment?: {
    id: string
    totalFee: number
  }
  reservation?: {
    id: string
    totalFee: number
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
}
