export interface User {
  id: string
  name: string
  username: string
  email: string
  role: Role
  gender: Gender
  // id: number | string
}

export interface UserState {
  user?: User | null
  isLogged: boolean
  accessToken?: string | null
  error?: string
  users: User[]
  loading: boolean
}

export enum Gender {
  FEMALE = 'FEMALE',
  MALE = 'MALE',
}
export const genders = [Gender.FEMALE, Gender.MALE]

export interface UserColumn {
  name: string
  username: string
  email: string
  role: Role
  gender: Gender
  id: string
}

// export const genderValues: number[] = Object.values(Gender).filter(
//   (value) => typeof value === 'number',
// )
// export const genderValuesString: string[] = genderValues.map((value) => value.toString())

export const getGenderString = (gender: Gender): string | null => {
  switch (gender) {
    case Gender.FEMALE:
      return 'Female'
    case Gender.MALE:
      return 'Male'
  }
}

export enum Role {
  ADMIN = 'ADMIN',
  NURSE = 'NURSE',
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR',
  PHARMACIST = 'PHARMACIST',
  ALL = 'ALL',
}
export const roles = [Role.ADMIN, Role.NURSE, Role.PATIENT, Role.DOCTOR, Role.PHARMACIST]

// export const roleValues: number[] = Object.values(Role).filter((value) => typeof value === 'number')
// export const roleValuesString: string[] = roleValues.map((value) => value.toString())

export const getRoleString = (role: Role): string | null => {
  switch (role) {
    case Role.ADMIN:
      return 'Admin'
    case Role.DOCTOR:
      return 'Doctor'
    case Role.NURSE:
      return 'Nurse'
    case Role.PATIENT:
      return 'Patient'
    case Role.PHARMACIST:
      return 'Pharmacist'
    default:
      return null
  }
}

// export const getRoleFromValueString = (roleValueStr: string): Role | null => {
//   if (!roleValuesString.includes(roleValueStr)) {
//     return null
//   }

//   switch (roleValueStr) {
//     case '0':
//       return Role.ADMIN
//     case '1':
//       return Role.NURSE
//     case '2':
//       return Role.PATIENT
//     case '3':
//       return Role.DOCTOR
//     case '4':
//       return Role.PHARMACIST
//     default:
//       return null
//   }
// }

export enum PClass {
  LEVEL_1 = 1,
  LEVEL_2 = 2,
  LEVEL_3 = 3,
}

export const pClassValues: number[] = Object.values(PClass).filter(
  (value) => typeof value === 'number',
)
export const pClassValuesString: string[] = pClassValues.map((value) => value.toString())
