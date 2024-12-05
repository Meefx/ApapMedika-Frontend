import type { FetchBaseResponse } from '@/utils/customFetch/interface'
import type { PClass } from './user.interface'

export interface RegisterRequest {
  name: string
  username: string
  password: string
  email: string
  gender: 'FEMALE' | 'MALE'
  role: 'ADMIN' | 'NURSE' | 'PATIENT' | 'DOCTOR' | 'PHARMACIST'
  nik?: string
  birthPlace?: string
  birthDate?: string
  pClass?: string

  specialist?: number //TODO: nanti ganti jadi enum
  yearsOfExperience?: number
  fee?: number
  schedules?: string[] //TODO: nanti ganti jadi day of week
}

export interface RegisterResponse extends FetchBaseResponse {
  data?: {
    user: {
      id: string
      name: string
      username: string
      email: string
      gender: 'FEMALE' | 'MALE'
      role: 'ADMIN' | 'NURSE' | 'PATIENT' | 'DOCTOR' | 'PHARMACIST'
    }
    token: string
  }
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse extends FetchBaseResponse {
  data?: {
    user: {
      id: string
      name: string
      username: string
      email: string
      gender: 'FEMALE' | 'MALE'
      role: 'ADMIN' | 'NURSE' | 'PATIENT' | 'DOCTOR' | 'PHARMACIST'
    }
    token: string
  }
}

export interface ValidateResponse extends FetchBaseResponse {
  data?: {
    id: string
    name: string
    username: string
    email: string
    gender: 'FEMALE' | 'MALE'
    role: 'ADMIN' | 'NURSE' | 'PATIENT' | 'DOCTOR' | 'PHARMACIST'
  }
}
