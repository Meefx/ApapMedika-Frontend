<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { RouterLink, useRouter } from 'vue-router'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useUserStore } from '@/stores/user'
import {
  genders,
  // genderValues,
  // genderValuesString,
  getGenderString,
  // getRoleFromValueString,
  getRoleString,
  pClassValues,
  pClassValuesString,
  Role,
  roles,
  // roleValues,
  // roleValuesString,
} from '@/interfaces/user.interface'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useForm } from 'vee-validate'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { reactive } from 'vue'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
  parseDate,
  today,
  type DateValue,
} from '@internationalized/date'
import { Calendar as CalendarIcon } from 'lucide-vue-next'
import { toDate } from 'radix-vue/date'
import { computed, ref } from 'vue'
import Separator from '@/components/ui/separator/Separator.vue'
import type { RegisterRequest } from '@/interfaces/auth.interface'
import { toast } from 'vue-sonner'

const df = new DateFormatter('en-US', {
  dateStyle: 'long',
})

const state = reactive<{ selectedRole: Role | null }>({
  selectedRole: null,
})

const userStore = useUserStore()

const router = useRouter()

const register = async (body: RegisterRequest) => await userStore.register(router, body)

const formSchema = toTypedSchema(
  z
    .object({
      name: z.string().min(1, 'Name is required').max(50, 'Name cannot exceed 50 characters'),
      username: z
        .string()
        .min(1, 'Username is required')
        .max(50, 'Username cannot exceed 50 characters'),
      email: z
        .string()
        .email('Invalid email format')
        .min(1, 'Email is required')
        .max(50, 'Email cannot exceed 50 characters'),
      role: z
        .string()
        .refine(
          (role) =>
            role == 'ADMIN' ||
            role == 'NURSE' ||
            role == 'PATIENT' ||
            role == 'DOCTOR' ||
            role == 'PHARMACIST',
          {
            message: 'Must between Admin, Nurse, Patient, Doctor, or Pharmacist',
          },
        ),
      gender: z.string().refine((gender) => gender == 'MALE' || gender == 'FEMALE', {
        message: 'Must between Female or Male',
      }),
      password: z.string().min(8, 'Password must be at least 8 characters'),
      passwordConfirmation: z.string().min(1),

      nik: z.string().optional(),
      birthPlace: z.string().optional(),
      birthDate: z.string().optional(),
      pClass: z.string().optional(),

      specialist: z.number().optional(),
      yearsOfExperience: z.number().optional(),
      fee: z.number().optional(),
      // schedules: z.array()
      // TODO: ini gimanah caranya
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: 'Confirm password does not match the password you entered. Please try again.',
      path: ['passwordConfirmation'],
    })
    .refine(
      (data) => {
        console.log(data.role == 'PATIENT')
        if (data.role == 'PATIENT') {
          return data.nik != undefined
        }
        return true
      },
      {
        message: 'Required',
        path: ['nik'],
      },
    )
    .refine(
      (data) => {
        if (data.role == 'PATIENT') {
          return data.pClass && pClassValuesString.includes(data.pClass)
        }
        return true
      },
      {
        message: 'Must between Level 1, 2, or 3.',
        path: ['pClass'],
      },
    ),
  // TODO: nambahin validasi lagi
)

const form = useForm({
  validationSchema: formSchema,
})

const onSubmit = form.handleSubmit(async (values) => {
  console.log('Form submitted!', values)
  try {
    await register(values)
  } catch (error) {
    toast.error((error as Error).message)
  }
})

const handleChangeRole = (role: Role) => {
  state.selectedRole = role
}

const birthDatePlaceholder = ref()
const birthDateValue = computed({
  get: () => (form.values.birthDate ? parseDate(form.values.birthDate) : undefined),
  set: (val) => val,
})
</script>

<template>
  <div class="grid place-items-center min-h-screen p-5">
    <Card class="w-10/12 max-w-[500px]">
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>Create your account.</CardDescription>
      </CardHeader>

      <form @submit="onSubmit" class="grid items-center w-full gap-4">
        <CardContent class="grid items-center gap-4">
          <div class="grid grid-cols-[1fr,1fr] gap-2">
            <FormField v-slot="{ componentField }" name="name">
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="John Doe" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="username">
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="john.doe" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <div class="grid grid-cols-[1fr,1fr] gap-2">
            <FormField v-slot="{ componentField }" name="email">
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="john.doe@mail.co.id" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField
              v-slot="{ componentField }"
              name="role"
              v-on:update:model-value="handleChangeRole"
            >
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <template v-for="role in roles" :key="role">
                        <SelectItem :value="role.toString()">{{ getRoleString(role) }}</SelectItem>
                      </template>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <FormField v-slot="{ componentField }" name="gender">
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <template v-for="gender in genders" :key="gender">
                      <SelectItem :value="gender.toString()">{{
                        getGenderString(gender)
                      }}</SelectItem>
                    </template>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="passwordConfirmation">
            <FormItem>
              <FormLabel>Password Confirmation</FormLabel>
              <FormControl>
                <Input type="password" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <div v-if="state.selectedRole == Role.PATIENT" class="grid items-center gap-4">
            <Separator />

            <div class="grid grid-cols-[1fr,1fr] gap-2">
              <FormField v-slot="{ componentField }" name="nik">
                <FormItem>
                  <FormLabel>NIK</FormLabel>
                  <FormControl>
                    <Input v-bind="componentField" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="birthPlace">
                <FormItem>
                  <FormLabel>Birth Place</FormLabel>
                  <FormControl>
                    <Input v-bind="componentField" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>

            <div class="grid grid-cols-[1fr,1fr] items-center gap-2">
              <FormField name="birthDate">
                <FormItem class="flex flex-col">
                  <FormLabel>Date of Birth</FormLabel>
                  <Popover>
                    <PopoverTrigger as-child>
                      <FormControl>
                        <Button
                          variant="outline"
                          :class="
                            cn(
                              'w-[240px] ps-3 text-start font-normal',
                              !birthDateValue && 'text-muted-foreground',
                            )
                          "
                        >
                          <span>{{
                            birthDateValue ? df.format(toDate(birthDateValue)) : 'Pick a date'
                          }}</span>
                          <CalendarIcon class="ms-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent class="w-auto p-0">
                      <Calendar
                        v-model:placeholder="birthDatePlaceholder"
                        v-model="birthDateValue"
                        calendar-label="Date of birth"
                        initial-focus
                        :min-value="new CalendarDate(1900, 1, 1)"
                        :max-value="today(getLocalTimeZone())"
                        @update:model-value="
                          (v: DateValue | undefined) => {
                            console.log(v)
                            if (v) {
                              form.setFieldValue('birthDate', v.toString())
                            } else {
                              form.setFieldValue('birthDate', undefined)
                            }
                          }
                        "
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="pClass">
                <FormItem>
                  <FormLabel>Policy Class</FormLabel>
                  <FormControl>
                    <Select v-bind="componentField">
                      <SelectTrigger id="policy">
                        <SelectValue placeholder="Select Policy" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <template v-for="policy in pClassValues" :key="policy">
                          <SelectItem :value="policy.toString()">{{
                            `Level ${policy}`
                          }}</SelectItem>
                        </template>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>
          </div>

          <div v-if="state.selectedRole == Role.DOCTOR">
            <div class="grid grid-cols-[1fr,1fr] gap-2">
              <FormField v-slot="{ componentField }" name="yearsOfExperience">
                <FormItem>
                  <FormLabel>Years of Experience</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="12" v-bind="componentField" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="fee">
                <FormItem>
                  <FormLabel>Fee</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Rp 20.000.000,00" v-bind="componentField" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>
            <!-- TODO: doctor fields: specialist and schedules -->
          </div>
        </CardContent>

        <CardFooter class="flex justify-between px-6 pb-6">
          <RouterLink to="/login">
            <Button variant="outline">Go to login page</Button>
          </RouterLink>

          <Button type="submit">Register</Button>
        </CardFooter>
      </form>
    </Card>
  </div>
</template>
