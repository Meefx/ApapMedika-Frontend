import type { FetchBaseResponse } from '@/utils/customFetch/interface'
import type { Gender, PClass } from '@/interfaces/user.interface'
export interface PatientInterface {
    id: string;
    name: string;
    username: string;
    nik: string;
  }
  
  export interface PatientOptionInterface {
    id: string;
    name: string;
    username: string;
    nik: string;
  }
  

export interface GetAllPatientsResponse extends FetchBaseResponse {
  data: Patient[]
}

export interface GetDetailPatientResponse extends FetchBaseResponse {
  data: Patient
}

export interface Patient {
  id: string
  name: string
  username: string
  email: string
  gender: Gender
  nik: string
  birthPlace: string
  birthDate: string
  pClass: PClass
  insuranceLimit: number
}

export interface PatientState {
  patients: Patient[]
  patient?: Patient
}

export interface PatientOptionInterface {
  id: string;
  name: string;
  username: string;
  nik: string;
  // Add other relevant fields
}