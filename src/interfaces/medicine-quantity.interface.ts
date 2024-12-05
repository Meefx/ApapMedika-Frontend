import type { MedicineInterface } from "@/interfaces/medicine.interface";
import type { PrescriptionInterface } from "@/interfaces/prescription.interface";

export interface MedicineQuantityInterface {
    id: string,
    medicine: MedicineInterface,
    prescription: PrescriptionInterface,
    quantity: number,
    fulfilledQty: number;
}