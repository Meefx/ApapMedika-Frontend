import type { FetchBaseResponse, CustomFetchRequestInit } from './interface'

export async function customFetch<T = FetchBaseResponse>(
  fullUrl: string,
  options: CustomFetchRequestInit = { uploadFile: false },
): Promise<T> {
  const headers: HeadersInit = {
    authorization: '',
    'Content-Type': 'application/json',
  }

  if (options.isAuthorized) {
    const token = localStorage.getItem('token')
    headers['authorization'] = `Bearer ${token}`
  }

  if (options.uploadFile) {
    delete headers['Content-Type']
  }

  const rawResult = await fetch(fullUrl.toString(), {
    headers,
    ...options,
  })

  const result = await rawResult.json()

  if (result.message === 'Token expired') {
    localStorage.removeItem('token')
  }

  console.log('CUSTOM FETCH')
  console.log(result)

  return result
}

export function customFetchBody(body: object) {
  return JSON.stringify(body)
}
