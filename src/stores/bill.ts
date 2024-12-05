import type {
  Bill,
  BillState,
  GetAllBillsResponse,
  GetDetailBillResponse,
} from '@/interfaces/bill.interface'
// import { Gender, PClass } from '@/interfaces/user.interface'
import { customFetch } from '@/utils/customFetch'
import type { FetchBaseResponse } from '@/utils/customFetch/interface'
import { defineStore } from 'pinia'

export const useBillStore = defineStore('bill', {
  state: () =>
    ({
      bills: [] as Bill[],
    }) as BillState,
  actions: {
    async getAllBills(): Promise<GetAllBillsResponse> {
      const response = await customFetch<GetAllBillsResponse>(
        `${import.meta.env.VITE_BILL_API}/api/bills`,
        {
          uploadFile: false,
          isAuthorized: true,
          method: 'GET',
        },
      )

      if (response.status < 200 || response.status >= 300) {
        throw new Error(response.message)
      }

      this.bills = response.data
      console.log(this.bills)

      // this.bills = dummy.data

      return response
      // return dummy
    },

    async getDetailBill(idBill: string): Promise<GetDetailBillResponse> {
      // TODO: nanti di uncomment, ini lagi pake dummy data dulu aja
      const response = await customFetch<GetDetailBillResponse>(
        `${import.meta.env.VITE_BILL_API}/api/bills/${idBill}`,
        {
          uploadFile: false,
          isAuthorized: true,
          method: 'GET',
        },
      )

      if (response.status < 200 || response.status >= 300) {
        throw new Error(response.message)
      }

      // const dummy: GetDetailBillResponse = {
      //   message: 'berhasil',
      //   status: 200,
      //   timestamp: new Date().toISOString(),
      //   data: {
      //     id: 'ecbece52-58f0-5f53-a9b0-55bff96f0dea',
      //     status: 'UNPAID',
      //     createdAt: new Date().toISOString(),
      //     updatedAt: new Date().toISOString(),
      //     createdBy: 'admin',
      //     updatedBy: 'admin',
      //     policy: {
      //       id: 'policy123',
      //       totalCoverage: 1000000,
      //       totalCovered: 800000,
      //     },
      //     appointment: {
      //       id: 'appointment123',
      //       totalFee: 500000,
      //     },
      //     reservation: {
      //       id: 'reservation123',
      //       totalFee: 100000,
      //     },
      //     patient: {
      //       id: 'ecbece52-58f0-5f53-a9b0-55bff96f0dea',
      //       name: 'Dwi',
      //       username: 'dwi_user',
      //       email: 'dwi@example.com',
      //       gender: Gender.FEMALE,
      //       nik: '1234567890123456',
      //       birthPlace: 'Jakarta',
      //       birthDate: '1995-05-10',
      //       pClass: PClass.LEVEL_3,
      //     },
      //   },
      // }

      this.bill = response.data
      // this.bill = dummy.data

      return response
      // return dummy
    },

    async payBill(idBill: string): Promise<FetchBaseResponse> {
      const response = await customFetch<FetchBaseResponse>(
        `${import.meta.env.VITE_BILL_API}/api/bills/${idBill}/pay`,
        {
          uploadFile: false,
          isAuthorized: true,
          method: 'PUT',
        },
      )

      if (response.status < 200 || response.status >= 300) {
        throw new Error(response.message)
      }

      return response
    },
  },
})
