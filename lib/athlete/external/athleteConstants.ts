import { MatchCategory } from "@/lib/event/eventConstants";
import { imageSchema } from "@/lib/form/formConstants";
import { v4 } from "uuid";
import * as yup from "yup";

export const athleteGender = ["Putra", "Putri"];

export const matchSchema = ["Pemula", "Prestasi"];

export const matchType = ["Tanding", "Seni"];

export type AthleteBase = {
  id: string;
  name: string;
  nik: string;
  address: string;
  gender: string;
  email: string;
  phone_number: string;
  birth_place: string;
  birth_date: number;
  height: string;
  weight: string;
  contingent_id: string;
  contingent_name: string;
  created_by: string;
  created_at: number;
};

export type AthleteSql = AthleteBase & {
  image: string;
  kk: string;
};

export type Athlete = AthleteBase & {
  image: {
    file?: File;
    downloadUrl: string;
  };
  kk: {
    file?: File;
    downloadUrl: string;
  };
};

export type AthleteAtEventSql = {
  registration_id: number;
  athlete_id: string;
  contingent_registration_id: number;
  schema: string;
  type: string;
  level: string;
  category: string;
  team?: string;
  payment_id: string | null;
  payment_bill: number;
  registered_at: number;
};

export type AthleteAtEvent = AthleteAtEventSql & {
  championship_id: string;
};

export type MatchBased = Athlete & AthleteAtEvent;

export type RegisteredAthlete = Athlete & { matches: AthleteAtEvent[] };

export const athleteInitialValue: Athlete = {
  id: "",
  name: "",
  nik: "",
  address: "",
  gender: athleteGender[0],
  email: "",
  phone_number: "",
  birth_place: "",
  birth_date: 0,
  height: "",
  weight: "",
  contingent_id: "",
  contingent_name: "",
  image: {
    downloadUrl: "",
  },
  kk: {
    downloadUrl: "",
  },
  created_by: "",
  created_at: 0,
};

export const athleteSchema = (ignore?: {
  image: boolean;
  ktp: boolean;
  kk: boolean;
}) => {
  let schema = yup.object({
    name: yup.string().required("Tolong lengkapi nama lengkap"),
    nik: yup
      .string()
      .matches(/^[0-9]+$/, "NIK mengandung huruf")
      .min(16, "NIK tidak valid (< 16 digit)")
      .max(16, "NIK tidak valid (> 16 digit)")
      .required("Tolong lengkapi NIK"),
    address: yup.string().required("Tolong lengkapi alamat"),
    email: yup
      .string()
      .email("Email tidak valid")
      .required("Tolong lengkapi email"),
    phone_number: yup
      .number()
      .typeError("No HP mengandung huruf")
      .required("Tolong lengkapi No HP"),
    birth_place: yup.string().required("Tolong lengkapi tempat lahir"),
    birth_date: yup.string().required("Tolong lengkapi tanggal lahir"),
    height: yup
      .number()
      .typeError("Tinggi badan mengandung huruf")
      .required("Tolong lengkapi tinggi badan"),
    weight: yup
      .number()
      .typeError("Berat badan mengandung huruf")
      .required("Tolong lengkapi berat badan"),
    contingent_name: yup
      .string()
      .required("Tolong daftarkan kontingen terlebih dahulu"),
  });

  if (!ignore?.image)
    schema = schema.concat(
      yup.object({
        image: yup.object({
          file: imageSchema(1),
        }),
      })
    );

  if (!ignore?.kk)
    schema = schema.concat(
      yup.object({
        kk: yup.object({
          file: imageSchema(1),
        }),
      })
    );

  return schema;
};

export const athleteAtEventInitialValue: AthleteAtEvent = {
  registration_id: 0,
  athlete_id: "",
  championship_id: "",
  contingent_registration_id: 0,
  schema: matchSchema[0],
  type: "",
  level: "",
  category: "",
  team: "",
  payment_id: null,
  payment_bill: 0,
  registered_at: 0,
};

export const athleteAtEventSchema = (validateTeam?: boolean) => {
  let schema = yup.object({
    athlete_id: yup.string().required("Tolong pilih atlet"),
    schema: yup.string().required("Tolong pilih skema pertandingan"),
    type: yup.string().required("Tolong pilih jenis pertandingan"),
    level: yup.string().required("Tolong pilih tingakatan pertandingan"),
    category: yup.string().required("Tolong pilih kategori pertandingan"),
  });

  if (validateTeam) {
    schema = schema.concat(
      yup.object({
        team: yup.string().required("Tolong pilih nama tim"),
      })
    );
  }

  return schema;
};

export const getDummyAthletes = (length: number) => {
  let athletes: Athlete[] = [];

  const randomDate = (start: Date, end: Date) => {
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    ).getTime();
  };

  for (let i = 1; i <= length; i++) {
    athletes.push({
      id: v4(),
      name: "Athlete " + i,
      nik: i
        .toString()
        .charAt(i.toString().length - 1)
        .repeat(16),
      address: "Address " + i,
      gender: athleteGender[0],
      email: `athlete-${i}@gmail.com`,
      phone_number: i
        .toString()
        .charAt(i.toString().length - 1)
        .repeat(12),
      birth_place: "birthPlace-" + i,
      birth_date: randomDate(new Date(2001, 0, 1), new Date()),
      height: (Math.floor(Math.random() * 900) + 100).toString(),
      weight: (Math.floor(Math.random() * 90) + 10).toString(),
      contingent_id: "kontingen-" + i,
      contingent_name: "Kontingen " + i,
      image: {
        downloadUrl: "",
      },
      kk: {
        downloadUrl: "",
      },
      created_by: `irfansud2nd@gmail.com`,
      created_at: 0,
    });
  }

  return athletes;
};
