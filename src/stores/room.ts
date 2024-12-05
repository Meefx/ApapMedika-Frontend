import type { AvailableRoomResponse, Room, RoomResponse } from '@/interfaces/room.interface'
import { customFetch } from '@/utils/customFetch'
import { defineStore } from 'pinia'

export const useRoomStore = defineStore('room', {
  state: () => ({
    rooms: [] as Room[],
    availableRooms: [] as Room[],
  }),
  actions: {
    async getAllRooms(): Promise<RoomResponse> {
      const response = await customFetch<RoomResponse>(
        `${import.meta.env.VITE_RESERVATION_API}/api/rooms`,
        {
          uploadFile: false,
          isAuthorized: true,
          method: 'GET',
        },
      )

      if (response.status < 200 || response.status >= 300) {
        throw new Error(response.message)
      }

      this.rooms = response.data
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
  },
})
