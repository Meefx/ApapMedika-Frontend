import type { DoctorInterface } from './doctor.interface'
import type { Patient } from './patient.interface'
import type { TreatmentInterface } from './treatment.interface'

export interface AppointmentInterface {
  id: string
  diagnosis: string
  totalFee: number
  status: Status
  date: string
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
  treatments?: TreatmentInterface[]
  patient: Patient
  doctor: DoctorInterface
}

export enum Status {
  CREATED = 'CREATED',
  CANCELLED = 'CANCELLED',
  DONE = 'DONE',
}

export const getAppointmentStatusLabel = (status: Status) => {
  switch (status) {
    case Status.CREATED:
      return 'Created'
    case Status.CANCELLED:
      return 'Cancelled'
    case Status.DONE:
      return 'Done'
  }
}

export function getStatusIntFromStatus(status: Status): number {
  switch (status) {
    case Status.CREATED:
      return 0
    case Status.CANCELLED:
      return 2
    case Status.DONE:
      return 1
  }
}

export interface AppointmentColumn {
  idAppointment: string
  doctorName: string
  patientName: string
  date: string
  status: Status
}

export interface AppointmentRequestInterface {
  patientId: string
  doctorId: string
  date: string // Format: "dd-MM-yyyy"
  // diagnosis?: string;
  // treatmentIds?: number[];
}

export interface UpdateAppointmentNoteInterface {
  appointmentId: string
  diagnosis: string
  treatmentIds: number[]
}

export enum Treatments {
  XRAY = 1,
  CT_SCAN,
  MRI,
  ULTRASOUND,
  BLOOD_CLOTTING_TEST,
  BLOOD_GLUCOSE_TEST,
  LIVER_FUNCTION_TEST,
  COMPLETE_BLOOD_COUNT,
  URINALYSIS,
  COVID_19_TESTING,
  CHOLESTEROL_TEST,
  INPATIENT_CARE,
  SURGERY,
  ICU,
  ER,
  FLU_SHOT,
  HEPATITIS_VACCINE,
  COVID_19_VACCINE,
  MMR_VACCINE,
  HPV_VACCINE,
  PNEUMOCOCCAL_VACCINE,
  HERPES_ZOSTER_VACCINE,
  PHYSICAL_EXAM,
  MAMMOGRAM,
  COLONOSCOPY,
  DENTAL_XRAY,
  FILLINGS,
  DENTAL_SCALING,
  PHYSICAL_THERAPY,
  OCCUPATIONAL_THERAPY,
  SPEECH_THERAPY,
  PSYCHIATRIC_EVALUATION,
  NATURAL_DELIVERY,
  C_SECTION,
}
