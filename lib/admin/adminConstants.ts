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

export type SpecialUserBase = {
  name: string;
  email: string;
  roles: SpecialUserRole[];
};

export type SpecialUser = SpecialUserBase & {
  image?: {
    file?: File;
    downloadUrl: string;
  };
};

export type SpecialUserSql = SpecialUserBase & {
  image: string;
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
    dir: [
      "news",
      "event",
      "announcement",
      "employee",
      "contingent",
      "athlete",
      "official",
    ],
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
  {
    href: "/admin/championship",
    label: "Kejuaraan",
    restricted: true,
  },
];

export const championshipAdminLinks: {
  links: Links;
  groupedLinks: GroupedLinks;
} = {
  links: [],
  groupedLinks: [
    {
      title: "Kontingen",
      prefix: "contingent",
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
      prefix: "official",
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
      prefix: "athlete",
      links: [
        {
          href: "/",
          label: "Daftar",
        },
        {
          href: "/count",
          label: "Jumlah Atlet",
        },
        {
          href: "/count/match",
          label: "Jumlah Pertandingan",
        },
        {
          href: "/categorized",
          label: "Filter Kategori",
        },
        {
          href: "/categorized/count",
          label: "Kuota Pertandingan Pertasi",
        },
      ],
    },
    {
      title: "Pembayaran",
      prefix: "payment",
      links: [
        {
          href: "/",
          label: "Jumlah",
        },
        {
          href: "/confirmed",
          label: "Dikonfirmasi",
        },
        {
          href: "/unconfirmed",
          label: "Menunggu Konfirmasi",
        },
      ],
    },
  ],
};

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
];

export const adminLinks = { links, groupedLinks };
