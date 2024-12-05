import { defineStore } from 'pinia'
import type {
  GetAllReservationResponse,
  ReservationState,
  GetDetailReservationResponse,
  DeleteReservationResponse,
  CreateReservationBody,
} from '@/interfaces/reservation.interface'
import { customFetch } from '@/utils/customFetch'
import { useToast } from 'vue-toastification'
import type { Room } from '@/interfaces/room.interface'

interface AvailableRoomResponse {
  status: number
  message: string
  data: Room[]
}

export const useReservationStore = defineStore('reservation', {
  state: () =>
    ({
      reservations: [],
      reservationDetail: undefined,
      loading: false,
      availableRooms: [],
      error: null,
    }) as ReservationState,
  actions: {
    async getReservations(): Promise<GetAllReservationResponse> {
      const response = await customFetch<GetAllReservationResponse>(
        `${import.meta.env.VITE_RESERVATION_API}/api/reservations`,
        {
          uploadFile: false,
          isAuthorized: true,
          method: 'GET',
        },
      )

      if (response.status < 200 || response.status >= 300) {
        throw new Error(response.message)
      }

      this.reservations = response.data
      return response
    },

    async getReservationById(id: string): Promise<GetDetailReservationResponse> {
      const response = await customFetch<GetDetailReservationResponse>(
        `${import.meta.env.VITE_RESERVATION_API}/api/reservations/${id}`,
        {
          uploadFile: false,
          isAuthorized: true,
          method: 'GET',
        },
      )

      if (response.status < 200 || response.status >= 300) {
        throw new Error(response.message)
      }

      this.reservationDetail = response.data
      return response
    },

    // Create new reservation
    async createReservation(body: CreateReservationBody): Promise<GetDetailReservationResponse> {
      const response = await customFetch<GetDetailReservationResponse>(
        `${import.meta.env.VITE_RESERVATION_API}/api/reservations`,
        {
          uploadFile: false,
          isAuthorized: true,
          method: 'POST',
          body: JSON.stringify(body),
        },
      )

      if (response.status < 200 || response.status >= 300) {
        throw new Error(response.message)
      }

      // Add the new reservation to the state
      await this.getReservations()

      return response
    },

    async updateReservation(updatedData: {
      id: string
      dateIn: string
      dateOut: string
      roomId: string
      patientId: string
      listFacilityIds: string[]
    }) {
      const response = await customFetch(
        `${import.meta.env.VITE_RESERVATION_API}/api/reservations/${updatedData.id}`,
        {
          method: 'PUT',
          isAuthorized: true,
          uploadFile: false,
          body: JSON.stringify(updatedData),
        },
      )
      if (response.status < 200 || response.status >= 300) {
        throw new Error(response.message)
      }
      return response
    },

    async getAvailableRooms(dateIn: string, dateOut: string): Promise<AvailableRoomResponse> {
      const url = new URL(`${import.meta.env.VITE_RESERVATION_API}/api/rooms`)
      url.searchParams.append('dateIn', dateIn)
      url.searchParams.append('dateOut', dateOut)

      const response = await customFetch<AvailableRoomResponse>(url.toString(), {
        uploadFile: false,
        isAuthorized: true,
        method: 'GET',
      })

      if (response.status < 200 || response.status >= 300) {
        throw new Error(response.message)
      }

      this.availableRooms = response.data

      return response
    },

    async deleteReservation(id: string): Promise<DeleteReservationResponse> {
      const response = await customFetch<DeleteReservationResponse>(
        `${import.meta.env.VITE_RESERVATION_API}/api/reservations/${id}`,
        {
          uploadFile: false,
          isAuthorized: true,
          method: 'DELETE',
        },
      )

      if (response.status < 200 || response.status >= 300) {
        throw new Error(response.message)
      }

      // Filter out the deleted reservation from the state
      this.reservations = this.reservations.filter((reservation) => reservation.id !== id)

      useToast().success('Reservasi berhasil dihapus')
      return response
    },
  },
})
