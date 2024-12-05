import { defineStore } from 'pinia'
import type {
  AppointmentInterface,
  AppointmentRequestInterface,
  UpdateAppointmentNoteInterface,
} from '@/interfaces/appointment.interface'
import type { CommonResponseInterface } from '@/interfaces/common.interface'
import { useToast } from 'vue-toastification'
import router from '@/router'
import { customFetch, customFetchBody } from '@/utils/customFetch'
import type { FetchBaseResponse } from '@/utils/customFetch/interface'

export const useAppointmentStore = defineStore('appointment', {
  state: () => ({
    appointments: [] as AppointmentInterface[],
    loading: false,
    error: null as null | string,
  }),
  actions: {
    async getAppointments(
      bearerToken: string,
      patientId?: string,
      doctorId?: string,
      from?: string,
      to?: string,
    ): Promise<AppointmentInterface[]> {
      this.loading = true
      this.error = null

      try {
        let url = `${import.meta.env.VITE_APPOINTMENT_API}/api/appointments`

        // Construct query parameters
        const queryParams: Record<string, string> = {}
        if (patientId) queryParams.patientId = patientId
        if (doctorId) queryParams.doctorId = doctorId
        if (from) queryParams.from = from
        if (to) queryParams.to = to

        console.log(patientId)
        console.log(doctorId)

        const queryString = new URLSearchParams(queryParams).toString()
        if (queryString) {
          url += `?${queryString}`
        }

        console.log(doctorId)

        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${bearerToken}`,
          },
        })

        const data: CommonResponseInterface<AppointmentInterface[]> = await response.json()
        this.appointments = data.data
        return data.data
      } catch (err) {
        this.error = `Gagal mengambil appointment ${err}`
        return []
      } finally {
        this.loading = false
        return []
      }
    },

    async getAppointmentDetail(
      id: string,
      bearerToken: string,
    ): Promise<AppointmentInterface | undefined> {
      this.loading = true
      this.error = null

      try {
        const response = await fetch(
          `${import.meta.env.VITE_APPOINTMENT_API}/api/appointments/${id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${bearerToken}`,
            },
          },
        )
        const data: CommonResponseInterface<AppointmentInterface> = await response.json()
        return data.data
      } catch (err) {
        this.error = `Gagal mengambil appointment ${(err as Error).message}`
      } finally {
        this.loading = false
      }
    },

    async createAppointment(body: AppointmentRequestInterface): Promise<FetchBaseResponse> {
      this.loading = true
      this.error = null

      const response = await customFetch<FetchBaseResponse>(
        `${import.meta.env.VITE_APPOINTMENT_API}/api/appointments/create`,
        {
          uploadFile: false,
          isAuthorized: true,
          method: 'POST',
          body: customFetchBody(body),
        },
      )

      console.log('create appointment')
      console.log(response)

      if (response.status < 200 || response.status >= 300) {
        throw new Error(response.message)
      }

      return response
    },

    async updateAppointmentNote(body: UpdateAppointmentNoteInterface, bearerToken: string) {
      this.loading = true
      this.error = null

      try {
        const response = await fetch(
          `${import.meta.env.VITE_APPOINTMENT_API}/api/appointments/update-note`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${bearerToken}`,
            },
            body: JSON.stringify(body),
          },
        )
        const data: CommonResponseInterface<AppointmentInterface> = await response.json()
        this.appointments.push(data.data)
        useToast().success('Sukses mengubah appointment')
        await router.push('/appointment')
      } catch (err) {
        this.error = `Gagal mengubah appointment ${(err as Error).message}`
        useToast().error(this.error)
      } finally {
        this.loading = false
      }
    },

    async updateAppointmentStatus(idAppointment: string, status: number, bearerToken: string) {
      this.loading = true
      this.error = null

      try {
        const response = await fetch(
          `${import.meta.env.VITE_APPOINTMENT_API}/api/appointments/update-status`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${bearerToken}`,
            },
            body: JSON.stringify({ idAppointment, status }),
          },
        )
        const data: CommonResponseInterface<AppointmentInterface> = await response.json()
        this.appointments.push(data.data)
        useToast().success('Sukses mengubah appointment')
        await router.push('/appointment')
      } catch (err) {
        this.error = `Gagal mengubah appointment ${(err as Error).message}`
        useToast().error(this.error)
      } finally {
        this.loading = false
      }
    },

    async deleteAppointment(idAppointment: string, bearerToken: string) {
      this.loading = true
      this.error = null

      try {
        const response = await fetch(
          `${import.meta.env.VITE_APPOINTMENT_API}/api/appointments/delete`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${bearerToken}`,
            },
            body: JSON.stringify({ idAppointment }),
          },
        )

        if (response.ok) {
          this.appointments = this.appointments.filter(
            (appointment) => appointment.id !== idAppointment,
          )
        }
        useToast().success('Sukses menghapus appointment')
        await router.push('/appointment')
      } catch (err) {
        this.error = `Gagal menghapus appointment ${(err as Error).message}`
        useToast().error(this.error)
      } finally {
        this.loading = false
      }
    },
  },
})
