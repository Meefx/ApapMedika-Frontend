import type { Gender } from '@/interfaces/user.interface'

export interface PharmacistInterface {
    id: string,
    name: string,
    username: string,
    email: string,
    gender: Gender;
}

