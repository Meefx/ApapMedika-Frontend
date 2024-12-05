<script setup lang="ts">
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
} from '@/components/ui/navigation-menu'
import Button from '@/components/ui/button/Button.vue';
import { Users } from 'lucide-vue-next';
import { CircleUser, BriefcaseMedical, Pill, CalendarCheck2, Receipt, Hospital, Siren } from 'lucide-vue-next';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	Cloud,
	LifeBuoy,
	LogOut,
	User,

} from 'lucide-vue-next'
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import { Role } from '@/interfaces/user.interface';

const userStore = useUserStore()
const router = useRouter()

const logout = async () => await userStore.logout(router)

</script>

<template>
	<header class="px-2 w-full fixed grid grid-cols-[1fr,2fr,1fr] justify-items-center">
		<div class="w-full flex items-center">
			<h1 class="text-xl font-bold">ApapMedika</h1>
		</div>

		<NavigationMenu class="bg-amaranth p-2 rounded-b-xl">
			<NavigationMenuList class="flex gap-1">
				<NavigationMenuItem v-if="userStore.user?.role == Role.ADMIN">
					<Button variant="ghost">
						<Users class="!w-6 !h-6" />
					</Button>
				</NavigationMenuItem>

				<NavigationMenuItem v-if="userStore.user?.role == Role.ADMIN || userStore.user?.role == Role.PHARMACIST">
					<Button variant="ghost">
						<BriefcaseMedical class="!w-6 !h-6" />
					</Button>
				</NavigationMenuItem>

				<NavigationMenuItem
					v-if="userStore.user?.role == Role.ADMIN || userStore.user?.role == Role.DOCTOR || userStore.user?.role == Role.NURSE || userStore.user?.role == Role.PATIENT">
					<Button variant="ghost">
						<CalendarCheck2 class="!w-6 !h-6" />
					</Button>
				</NavigationMenuItem>

				<NavigationMenuItem v-if="userStore.user?.role == Role.ADMIN || userStore.user?.role == Role.PATIENT">
					<Button variant="ghost">
						<Siren class="!w-6 !h-6" />
					</Button>
				</NavigationMenuItem>

				<NavigationMenuItem
					v-if="userStore.user?.role == Role.ADMIN || userStore.user?.role == Role.NURSE || userStore.user?.role == Role.PATIENT">
					<Button variant="ghost">
						<Hospital class="!w-6 !h-6" />
					</Button>
				</NavigationMenuItem>

				<NavigationMenuItem v-if="userStore.user?.role == Role.PATIENT || userStore.user?.role == Role.PHARMACIST">
					<Button variant="ghost">
						<Pill class="!w-6 !h-6" />
					</Button>
				</NavigationMenuItem>

				<NavigationMenuItem v-if="userStore.user?.role == Role.PATIENT">
					<Button variant="ghost">
						<Receipt class="!w-6 !h-6" />
					</Button>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>

		<DropdownMenu>
			<div class="w-full flex justify-end">
				<DropdownMenuTrigger>
					<Button class="aspect-square p-2">
						<CircleUser class="!w-6 !h-6" />
					</Button>
				</DropdownMenuTrigger>
			</div>

			<DropdownMenuContent class="w-56">
				<DropdownMenuLabel>My Account</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<User class="mr-2 h-4 w-4" />
						<span>Profile</span>
					</DropdownMenuItem>
				</DropdownMenuGroup>

				<DropdownMenuSeparator />

				<DropdownMenuItem>
					<LifeBuoy class="mr-2 h-4 w-4" />
					<span>Support</span>
				</DropdownMenuItem>
				<DropdownMenuItem disabled>
					<Cloud class="mr-2 h-4 w-4" />
					<span>API</span>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem @click="logout()">
					<LogOut class="mr-2 h-4 w-4" />
					<span>Log out</span>
					<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	</header>
</template>