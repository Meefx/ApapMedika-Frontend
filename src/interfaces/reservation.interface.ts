import type { Gender, PClass } from '@/interfaces/user.interface'
import type { FetchBaseResponse } from '@/utils/customFetch/interface'
import type { Room } from './room.interface'

export interface Reservation {
  id: string
  dateIn: string
  dateOut: string
  totalFee: number
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
  nurse: {
    id: string
    name: string
    username: string
    email: string
    gender: Gender
  }
  roomId: string
  appointmentId: string
  facilities: {
    id: string
    name: string
    fee: number
  }[]
  createdAt: string
  updatedAt: string
  isDeleted: boolean
}

export interface ReservationColumn {
  idReservation: string
  patientName: string
  roomName: string
  totalFee: number
  status: string
}

export interface GetAllReservationResponse extends FetchBaseResponse {
  data: Reservation[]
}

export interface GetDetailReservationResponse extends FetchBaseResponse {
  data: Reservation
}

export interface DeleteReservationResponse extends FetchBaseResponse {
  message: string
}

export interface ReservationState {
  reservations: Reservation[]
  reservationDetail?: Reservation
  loading: boolean
  availableRooms: Room[]
}

export interface CreateReservationBody {
  dateIn: string
  dateOut: string
  patientId: string
  roomId: string
  appointmentId?: string
  listFacilityIds: string[]
}
