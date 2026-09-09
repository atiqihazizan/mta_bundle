import {
	HomeIcon,
	BuildingOfficeIcon,
	UsersIcon,
	CurrencyDollarIcon,
	EnvelopeIcon,
	TicketIcon,
	HeartIcon,
	MapIcon,
	DocumentTextIcon,
} from "@heroicons/react/24/outline";

export const navigation = [
	{ name: "Dashboard", to: "/", icon: HomeIcon },
	{ name: "Peta", to: "/peta", icon: MapIcon },
	{ name: "Perarakan", to: "/perarakan", icon: MapIcon },
	{ name: "Perumahan", to: "/address", icon: BuildingOfficeIcon },
	{ name: "Penduduk", to: "/peoples", icon: UsersIcon },
	{ name: "Tabung", to: "/tabung", icon: CurrencyDollarIcon },
	{ name: "Terima Surat", to: "/letters", icon: EnvelopeIcon },
	{ name: "Baucar", to: "/voucher", icon: TicketIcon },
	{ name: "Jenazah", to: "/jenazah", icon: HeartIcon },
	{ name: "Korban & Akikah", to: "/aqiqah/", icon: DocumentTextIcon, external: true },
	{ name: "Pugutan Fitrah", to: "/amil/", icon: DocumentTextIcon, external: true },
];
