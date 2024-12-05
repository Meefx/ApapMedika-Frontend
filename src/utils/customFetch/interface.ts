export interface CustomFetchRequestInit extends RequestInit {
  isAuthorized?: boolean
  uploadFile?: boolean
}

export interface FetchBaseResponse {
  status: number
  message: string
  timestamp: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any
}
