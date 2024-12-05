export interface DoctorInterface {
  id: string
  name: string
  specialist: SpecialistDTO
  schedules?: string[]
  // Add other relevant fields
}

export interface SpecialistDTO {
  codeNumber: number
  code: string
  // Add other relevant fields
}

export interface DoctorOptionInterface {
  id: string
  name: string
  username: string
  specialist: SpecialistDTO
  // email: string;
  // gender: Gender;
  // specialist: Specialization;
  // yearsOfExperience: number;
  // fee: number;
  schedules?: string[]
}

export interface DoctorSchedule {
  scheduleDate: string
  scheduleString: string
}
