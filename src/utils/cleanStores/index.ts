// import { useCompanyStore } from '@/stores/company'
import { usePatientStore } from '@/stores/patient'
import { usePolicyStore } from '@/stores/policy'

export const cleanStores = () => {
  const policyStore = usePolicyStore()
  policyStore.policies = []
  policyStore.policy = undefined

  const patientStore = usePatientStore()
  patientStore.patients = []
  patientStore.patient = undefined

  // const companyStore = useCompanyStore()
}
