import type { MedicineQuantityInterface } from "@/interfaces/medicine-quantity.interface";
import type { FetchBaseResponse } from "@/utils/customFetch/interface";

export interface MedicineInterface {
  id: string;
  name: string;
  price: number;
  description: string;
  stock: number;
  medicineQuantities?: MedicineQuantityInterface[];
  createdDate: Date;
  updatedDate: Date;
  createdBy: string;
  updatedBy: string;
}

export interface MedicineState {
    medicines: MedicineInterface[];
    medicine?: MedicineInterface;
}

export interface MedicineColumn {
  idMedicine: string;
  medicineName: string;
  medicineStock: number;
  medicinePrice: number;
}

export interface GetAllMedicinesResponse extends FetchBaseResponse {
    data: MedicineInterface[]
}

export interface GetDetailMedicineResponse extends FetchBaseResponse {
    data: MedicineInterface
}

export interface DeleteMedicineResponse extends FetchBaseResponse {
  data: MedicineInterface
}