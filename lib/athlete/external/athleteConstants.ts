import { MatchCategory } from "@/lib/event/eventConstants";
import { imageSchema } from "@/lib/form/formConstants";
import { v4 } from "uuid";
import * as yup from "yup";

export const athleteGender = ["Putra", "Putri"];

export const matchSchema = ["Pemula", "Prestasi"];

export const matchType = ["Tanding", "Seni"];

export type Athlete = {
  id: string;
  name: string;
  nik: string;
  address: string;
  gender: string;
  email: string;
  phoneNumber: string;
  birthPlace: string;
  birthDate: number;
  height: string;
  weight: string;
  contingentId: string;
  contingentName: string;
  image: {
    file?: File;
    downloadUrl: string;
  };
  // ktp: {
  //   file?: File;
  //   downloadUrl: string;
  // };
  kk: {
    file?: File;
    downloadUrl: string;
  };
  createdBy: string;
  createdAt: number;
};

export const athleteInitialValue: Athlete = {
  id: "",
  name: "",
  nik: "",
  address: "",
  gender: athleteGender[0],
  email: "",
  phoneNumber: "",
  birthPlace: "",
  birthDate: 0,
  height: "",
  weight: "",
  contingentId: "",
  contingentName: "",
  image: {
    downloadUrl: "",
  },
  kk: {
    downloadUrl: "",
  },
  // ktp: {
  //   downloadUrl: "",
  // },
  createdBy: "",
  createdAt: 0,
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
    phoneNumber: yup
      .number()
      .typeError("No HP mengandung huruf")
      .required("Tolong lengkapi No HP"),
    birthPlace: yup.string().required("Tolong lengkapi tempat lahir"),
    birthDate: yup.string().required("Tolong lengkapi tanggal lahir"),
    height: yup
      .number()
      .typeError("Tinggi badan mengandung huruf")
      .required("Tolong lengkapi tinggi badan"),
    weight: yup
      .number()
      .typeError("Berat badan mengandung huruf")
      .required("Tolong lengkapi berat badan"),
    contingentName: yup
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

  // if (!ignore?.ktp)
  //   schema = schema.concat(
  //     yup.object({
  //       ktp: yup.object({
  //         file: imageSchema(1),
  //       }),
  //     })
  //   );

  return schema;
};

export type AthleteAtEvent = {
  registrationId: number;
  athleteId: string;
  championshipId: string;
  schema: string;
  type: string;
  level: string;
  category: string;
  team?: string;
  paymentId: string | null;
  registeredAt: number;
};

export const athleteAtEventInitialValue: AthleteAtEvent = {
  registrationId: 0,
  athleteId: "",
  championshipId: "",
  schema: matchSchema[0],
  type: "",
  level: "",
  category: "",
  paymentId: null,
  registeredAt: 0,
};

export const athleteAtEventSchema = (art?: boolean) => {
  let schema = yup.object({
    athleteId: yup.string().required("Tolong pilih atlet"),
    schema: yup.string().required("Tolong pilih skema pertandingan"),
    athletId: yup.string().required("Tolong pilih atlet"),
    type: yup.string().required("Tolong pilih jenis pertandingan"),
    level: yup.string().required("Tolong pilih tingakatan pertandingan"),
    category: yup.string().required("Tolong pilih kategori pertandingan"),
  });

  if (art) {
    schema = schema.concat(
      yup.object({
        team: yup.string().required("Tolong pilih nama tim"),
      })
    );
  }
};

export type MatchBased = Athlete & AthleteAtEvent;

export type RegisteredAthlete = Athlete & { matches: AthleteAtEvent[] };

export const getMatchCategory = (
  level: string,
  type: string,
  matchCategory: MatchCategory
) => {
  const categories = matchCategory.find(
    (item) => item.level == level
  )?.category;
  const result = type == matchType[0] ? categories?.fight : categories?.art;
  return result ?? [];
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
      phoneNumber: i
        .toString()
        .charAt(i.toString().length - 1)
        .repeat(12),
      birthPlace: "birthPlace-" + i,
      birthDate: randomDate(new Date(2001, 0, 1), new Date()),
      height: (Math.floor(Math.random() * 900) + 100).toString(),
      weight: (Math.floor(Math.random() * 90) + 10).toString(),
      contingentId: "kontingen-" + i,
      contingentName: "Kontingen " + i,
      image: {
        downloadUrl: "",
      },
      kk: {
        downloadUrl: "",
      },
      // ktp: {
      //   downloadUrl: "",
      // },
      createdBy: `creatorEmail${i}@gmail.com`,
      createdAt: 0,
    });
  }

  return athletes;
};
