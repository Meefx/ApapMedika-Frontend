export interface Room {
  id: string
  name: string
  description: string
  maxCapacity: number
  pricePerDay: number
  createdAt: string
  updatedAt: string
  isDeleted: boolean
}

export interface RoomResponse {
  status: number
  message: string
  data: Room[]
}

export interface AvailableRoomResponse {
  status: number
  message: string
  data: Room[]
}
