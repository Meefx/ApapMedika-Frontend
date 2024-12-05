import type { AppointmentInterface } from "@/interfaces/appointment.interface";
import type { PharmacistInterface } from "@/interfaces/pharmacist.interface";
import type { MedicineQuantityInterface } from "@/interfaces/medicine-quantity.interface";
import type { FetchBaseResponse } from "@/utils/customFetch/interface";

export interface PrescriptionInterface {
    id: string,
    totalPrice: number,
    status: PrescriptionStatus,
    appointment: AppointmentInterface,
    pharmacist: PharmacistInterface,
    medicineQuantities: MedicineQuantityInterface[],
    createdDate: Date,
    updatedDate: Date,
    createdBy: string,
    updatedBy: string;
}

export type PrescriptionStatus =
  | 'CREATED'
  | 'WAITING_FOR_STOCK'
  | 'DONE'
  | 'CANCELLED'

export const prescriptionStatusValues: PrescriptionStatus[] = [
  'CREATED',
  'WAITING_FOR_STOCK',
  'DONE',
  'CANCELLED',
]

export function getPrescriptionStatusInt(status: PrescriptionStatus): number {
    switch(status) {
        case 'CREATED':
            return 0;
        case 'WAITING_FOR_STOCK':
            return 1;
        case 'DONE':
            return 2;
        case 'CANCELLED':
            return 3;
    }
}

export const getPrescriptionStatusLabel = (status: PrescriptionStatus) => {
    switch(status) {
        case 'CREATED':
            return "Created";
        case 'WAITING_FOR_STOCK':
            return "Waiting for Stock";
        case 'DONE':
            return "Done";
        case 'CANCELLED':
            return "Cancelled";
    }
}

export interface PrescriptionColumn {
    idPrescription: string;
    createdDate: Date;
    patientName: string;
    totalPrice: number;
    status: PrescriptionStatus;
}

export interface GetAllPrescriptionsResponse extends FetchBaseResponse {
    data: PrescriptionInterface[]
}
  
export interface PrescriptionState {
    prescriptions: PrescriptionInterface[]
    prescription?: PrescriptionInterface
}