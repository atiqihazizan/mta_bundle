import {
	HomeIcon,
	BuildingOfficeIcon,
	UsersIcon,
	CurrencyDollarIcon,
	EnvelopeIcon,
	TicketIcon,
	HeartIcon,
} from "@heroicons/react/24/outline";

export const navigation = [
	{ name: "Dashboard", to: "/", icon: HomeIcon },
	{ name: "Perumahan", to: "/address", icon: BuildingOfficeIcon },
	{ name: "Penduduk", to: "/peoples", icon: UsersIcon },
	{ name: "Tabung", to: "/tabung", icon: CurrencyDollarIcon },
	{ name: "Terima Surat", to: "/letters", icon: EnvelopeIcon },
	{ name: "Baucar", to: "/voucher", icon: TicketIcon },
	{ name: "Jenazah", to: "/jenazah", icon: HeartIcon },
];
