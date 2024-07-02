import { NextResponse } from "next/server";
import { PostgrestError } from "@supabase/supabase-js";

export type ServerAction<T> =
  | { result: T; error: null }
  | { result: null; error: PostgrestError };

export type Links = {
  href: string;
  label: string;
  restricted?: boolean;
}[];

export type GroupedLinks = {
  title: string;
  prefix: string;
  links: Links;
  restricted?: boolean;
}[];

const links: Links = [
  // {
  //   href: "/profile",
  //   label: "Profil",
  // },
  // {
  //   href: "/news",
  //   label: "Berita",
  // },
  // {
  //   href: "/event",
  //   label: "Event",
  // },
  // {
  //   href: "/championship",
  //   label: "Kejuaraan",
  // },
  // {
  //   href: "/employee",
  //   label: "Pengurus",
  // },
];

const groupedLinks: GroupedLinks = [
  // {
  //   title: "Atlet",
  //   prefix: "/athlete",
  //   links: internalAthleteRoles.map((item) => ({
  //     href: "/" + item,
  //     label: getSpecialUserLabel(item).replace("Atlet ", ""),
  //   })),
  // },
];

export const clientLinks = { links, groupedLinks };

export type SearchPageParams = { [key: string]: string };

export const invalidIdentifier = NextResponse.json(
  { message: "Invalid identifier" },
  { status: 500 }
);

export const baseUrl = "https://www.ipsikotabandung.com";
