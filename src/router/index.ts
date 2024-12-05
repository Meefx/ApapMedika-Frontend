import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import { Role } from '@/interfaces/user.interface'
import LandingView from '@/views/LandingView.vue'
import AccountView from '@/views/AccountView.vue'
import CreateAppointmentView from '@/views/appointment/CreateAppointmentView.vue'
import AppointmentView from '@/views/appointment/AppointmentView.vue'
import TestView from '@/views/TestView.vue'
import ReservationView from '@/views/reservation/ReservationView.vue'
import ReservationDetailView from '@/views/reservation/DetailReservationView.vue'
import CreateReservationView from '@/views/reservation/CreateReservationView.vue'
import DetailAppointmentView from '@/views/appointment/DetailAppointmentView.vue'
import NoteAppointmentView from '@/views/appointment/NoteAppointmentView.vue'
import UserView from '@/views/UserView.vue'
import ListPoliciesView from '@/views/insurance/ListPoliciesView.vue'
import ListMedicinesView from '@/views/pharmacy/ListMedicinesView.vue'
import ListPrescriptionsView from '@/views/pharmacy/ListPrescriptionsView.vue'
import DetailMedicineView from '@/views/pharmacy/DetailMedicineView.vue'
import DetailPolicyView from '@/views/insurance/DetailPolicyView.vue'
import CreatePolicyView from '@/views/insurance/CreatePolicyView.vue'
import ListBillView from '@/views/bill/ListBillView.vue'
import DetailBillView from '@/views/bill/DetailBillView.vue'
import UpdateReservationView from '@/views/reservation/UpdateReservationView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: {
        requiresAuth: true,
        role: [Role.ALL],
        useSidebar: true,
      },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/account',
      name: 'account',
      component: AccountView,
      meta: {
        requiresAuth: true,
        role: [Role.ALL],
        useSidebar: true,
      },
    },
    {
      path: '/users',
      name: 'users',
      component: UserView,
      meta: {
        requiresAuth: true,
        role: [Role.ALL],
        useSidebar: true,
      },
    },
    {
      path: '/appointment/create',
      name: 'createAppointment',
      component: CreateAppointmentView,
      meta: {
        requiresAuth: true,
        role: [Role.ALL],
        useSidebar: true,
      },
    },
    {
      path: '/appointment',
      name: 'viewAllAppointment',
      component: AppointmentView,
      meta: {
        requiresAuth: true,
        role: [Role.ALL],
        useSidebar: true,
      },
    },
    {
      path: '/appointment/:id',
      name: 'detailAppointment',
      component: DetailAppointmentView,
      meta: {
        requiresAuth: true,
        role: [Role.ALL],
        useSidebar: true,
      },
    },
    {
      path: '/appointment/:id/note',
      name: 'noteAppointment',
      component: NoteAppointmentView,
      meta: {
        requiresAuth: true,
        role: [Role.ALL],
        useSidebar: true,
      },
    },
    {
      path: '/policies',
      name: 'read all policies',
      component: ListPoliciesView,
      meta: {
        requiresAuth: true,
        role: [Role.ADMIN, Role.PATIENT],
        useSidebar: true,
      },
    },
    {
      path: '/policies/:idPolicy',
      name: 'detail policy',
      component: DetailPolicyView,
      meta: {
        requiresAuth: true,
        role: [Role.ADMIN, Role.PATIENT],
        useSidebar: true,
      },
    },
    {
      path: '/policies/new',
      name: 'create policy',
      component: CreatePolicyView,
      meta: {
        requiresAuth: true,
        role: [Role.ADMIN],
        useSidebar: true,
      },
    },
    {
      path: '/medicines',
      name: 'ListMedicines',
      component: ListMedicinesView,
      meta: {
        requiresAuth: true,
        role: [Role.ADMIN, Role.PHARMACIST, Role.DOCTOR, Role.NURSE],
        useSidebar: true,
      },
    },
    {
      path: '/medicines/:idMedicine',
      name: 'detail medicine',
      component: DetailMedicineView,
      meta: {
        requiresAuth: true,
        role: [Role.ADMIN, Role.PHARMACIST, Role.DOCTOR, Role.NURSE],
        useSidebar: true,
      },
    },
    {
      path: '/bills',
      name: 'bills',
      component: ListBillView,
      meta: {
        requiresAuth: true,
        role: [Role.PATIENT],
        useSidebar: true,
      },
    },
    {
      path: '/prescriptions',
      name: 'ListPrescriptions',
      component: ListPrescriptionsView,
      meta: {
        requiresAuth: true,
        role: [Role.PHARMACIST],
        useSidebar: true,
      },
    },
    {
      path: '/bills/:idBill',
      name: 'detail bill',
      component: DetailBillView,
      meta: {
        requiresAuth: true,
        role: [Role.PATIENT],
        useSidebar: true,
      },
    },
    {
      path: '/test',
      name: 'testPage',
      component: TestView,
    },
    {
      path: '/:notFound',
      component: NotFoundView,
    },
    {
      path: '/reservation',
      name: 'reservation',
      component: ReservationView,
      meta: {
        requiresAuth: true,
        role: [Role.ADMIN, Role.PATIENT, Role.NURSE],
        useSidebar: true,
      },
    },
    {
      path: '/reservation/:id',
      name: 'reservation-detail',
      component: ReservationDetailView,
      props: true,
      meta: {
        requiresAuth: true,
        role: [Role.ADMIN, Role.PATIENT, Role.NURSE],
        useSidebar: true,
      },
    },
    {
      path: '/reservation/create',
      name: 'buat reservasi',
      component: CreateReservationView,
      meta: {
        requiresAuth: true,
        role: [Role.NURSE],
        useSidebar: true,
      },
    },
    {
      path: '/reservation/:id/edit',
      name: 'update-reservation',
      component: UpdateReservationView,
      props: true,
      meta: {
        requiresAuth: true,
        role: [Role.ADMIN, Role.PATIENT, Role.NURSE],
        useSidebar: true,
      },
    }
  ],
})

export default router
