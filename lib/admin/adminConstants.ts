import * as yup from "yup";
import {
  InternalAthleteRole,
  internalAthleteRoles,
} from "../athlete/internal/internalAthleteConstants";
import { GroupedLinks, Links } from "../constants";
import { championships } from "../event/eventConstants";

export type SpecialUserRole =
  | InternalAthleteRole
  | "master"
  | "admin"
  | "adminEvent"
  | "pelatih";

export type SpecialUser = {
  name: string;
  email: string;
  roles: SpecialUserRole[];
  image?: {
    file?: File;
    downloadUrl: string;
  };
};

export const hideAdminLinksFrom = [
  {
    email: "iqbalbobalfarisy@gmail.com",
    menu: ["Pengurus", "Berita", "Event", "PAL", "POPWILDA", "PORPROV"],
  },
  {
    email: "andra08malela@gmail.com",
    menu: ["Pengurus", "Berita", "Event", "PAL", "POPWILDA", "PORPROV"],
  },
];

export const specialUserIntitialValue = (role: SpecialUserRole) => {
  let result: SpecialUser = {
    email: "",
    name: "",
    roles: [],
  };
  return result;
};

export const specialUserSchema = yup.object({
  email: yup
    .string()
    .required("Tolong lengkapi email")
    .email("Email tidak valid"),
  name: yup.string().required("Tolong lengkapi nama"),
});

export const roleAccess: {
  role: SpecialUserRole;
  dir: string[];
}[] = [
  {
    role: "admin",
    dir: ["news", "event", "announcement", "employee", "contingent", "athlete"],
  },
  {
    role: "master",
    dir: ["admin", "master", "adminEvent"],
  },
  {
    role: "pelatih",
    dir: [...internalAthleteRoles],
  },
  {
    role: "adminEvent",
    dir: ["championship", "contingent", "athlete", "payment"],
  },
  ...internalAthleteRoles.map((athlete) => ({ role: athlete, dir: [athlete] })),
];

const links: Links = [
  {
    href: "/admin",
    label: "Dashboard",
  },
  {
    href: "/admin/announcement",
    label: "Pengumuman",
    restricted: true,
  },
  {
    href: "/admin/specialuser/master",
    label: "Master",
    restricted: true,
  },
  {
    href: "/admin/specialuser/admin",
    label: "Admin",
    restricted: true,
  },
  {
    href: "/admin/employee",
    label: "Pengurus",
    restricted: true,
  },
];

const championshipAdminLinks = championships.map((championship) => ({
  title: championship.title,
  prefix: `/admin/championship/${championship.id}`,
  restricted: true,
  links: [
    {
      href: "/contingent",
      label: "Daftar Kontingen",
    },
    {
      href: "/contingent/count",
      label: "Jumlah Kontingen",
    },
    {
      href: "/athlete",
      label: "Daftar Atlet",
    },
    {
      href: "/athlete/count",
      label: "Jumlah Pertandingan",
    },
    {
      href: "/athlete/categorized",
      label: "Filter Kategori",
    },
    {
      href: "/athlete/categorized/count",
      label: "Kuota Pertandingan Prestasi",
    },
    {
      href: "/payment",
      label: "Pembayaran",
    },
  ],
}));

const groupedLinks: GroupedLinks = [
  {
    title: "Berita",
    prefix: "/admin/news",
    restricted: true,
    links: [
      {
        href: "/add",
        label: "Tambah",
      },
      {
        href: "/",
        label: "Kelola",
      },
    ],
  },
  {
    title: "Event",
    prefix: "/admin/event",
    restricted: true,
    links: [
      {
        href: "/add",
        label: "Tambah",
      },
      {
        href: "/",
        label: "Kelola",
      },
    ],
  },
  {
    title: "PAL",
    prefix: "/admin/specialuser/palAthlete",
    restricted: true,
    links: [
      {
        href: "/",
        label: "Kelola Atlet",
      },
      {
        href: "/attendance",
        label: "Absen",
      },
    ],
  },
  {
    title: "POPWILDA",
    prefix: "/admin/specialuser/popwildaAthlete",
    restricted: true,
    links: [
      {
        href: "/",
        label: "Kelola Atlet",
      },
      {
        href: "/attendance",
        label: "Absen",
      },
    ],
  },
  {
    title: "PORPROV",
    prefix: "/admin/specialuser/porprovAthlete",
    restricted: true,
    links: [
      {
        href: "/",
        label: "Kelola Atlet",
      },
      {
        href: "/attendance",
        label: "Absen",
      },
    ],
  },
  {
    title: "Kontingen",
    prefix: "/admin/contingent",
    restricted: true,
    links: [
      {
        href: "/",
        label: "Daftar",
      },
      {
        href: "/count",
        label: "Jumlah",
      },
    ],
  },
  {
    title: "Atlet",
    prefix: "/admin/athlete",
    restricted: true,
    links: [
      {
        href: "/",
        label: "Daftar",
      },
      {
        href: "/count",
        label: "Jumlah",
      },
    ],
  },
  {
    title: "Official",
    prefix: "/admin/official",
    restricted: true,
    links: [
      {
        href: "/",
        label: "Daftar",
      },
      {
        href: "/count",
        label: "Jumlah",
      },
    ],
  },
  ...championshipAdminLinks,
];

export const adminLinks = { links, groupedLinks };
