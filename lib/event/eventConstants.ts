import { v4 } from "uuid";
import * as yup from "yup";
import { imageMaxSize, imageSchema } from "../form/formConstants";
import { dateToNumber } from "../functions";

export type Bank = "BJB";

export type EventBase = {
  id: string;
  title: string;
  location_name: string;
  location_url?: string;
  date_start: number;
  date_end?: number;
  time_start: number;
  time_end?: number;
  organizer: string;
  created_by: string;
  created_at: number;
  description: string;
};

export type Event = EventBase & {
  image: {
    file?: File;
    downloadUrl: string;
  };
};

export type EventSql = EventBase & {
  image: string;
};

export const eventInitialValue: Event = {
  id: "",
  title: "",
  image: {
    file: undefined,
    downloadUrl: "",
  },
  location_name: "",
  date_start: 0,
  time_start: 0,
  organizer: "IPSI Kota Bandung",
  created_by: "",
  created_at: 0,
  description: "",
};

export const eventSchema = (ignoreImage: boolean = false) => {
  let schema = yup.object({
    title: yup
      .string()
      .required("Tolong lengkapi judul event")
      .max(225, "Judul event terlalu panjang"),
    location_name: yup.string().required("Tolong lengkapi nama lokasi"),
    location_url: yup.string().url("Link tidak valid"),
    date_start: yup.number().min(1, "Tolong lengkapi tanggal mulai"),
    time_start: yup.number().min(1, "Tolong lengkapi jam mulai"),
    organizer: yup
      .string()
      .required("Tolong lengkapi nama penyelenggara")
      .max(225, "Nama penyelenggara terlalu panjang"),
    description: yup.string().required("Tolong lengkapi Deskripsi"),
  });

  if (!ignoreImage)
    schema = schema.concat(
      yup.object({
        image: yup.object({
          file: imageSchema(imageMaxSize.event),
        }),
      })
    );
  return schema;
};

export type Championship = Event & {
  register: {
    start: number;
    end: number;
  };
  athletes: number;
  matchCount: number;
  techmeet: {
    date: number;
    location: {
      name: string;
      url: string;
    };
  };
  matchCategory: MatchCategory;
  proposal: string;
  status: {
    checkLimit: boolean;
    editOnly: boolean;
  };
  payment: {
    closed: boolean;
    total: number;
    confirmed: number;
    target: {
      name: string;
      number: string;
      bank: Bank;
    };
    contact: {
      name: string;
      phoneNumber: string;
    };
  };
  matchCost: {
    tanding: number;
    tunggal: number;
    ganda: number;
    regu: number;
  };
  showOnHome?: boolean;
  dialogOnHome?: boolean;
  testerEmail?: string[];
};

// DUMMY DATA
export const getDummyEvents = (length: number, startNumber: number = 0) => {
  let result: Event[] = [];
  for (let i = 1 + startNumber; i <= length + startNumber; i++) {
    result.push({
      id: v4(),
      title: "Event " + i,
      image: {
        downloadUrl: "url " + i,
      },
      location_name: "Location " + i,
      date_start: Date.now() + i * 99999999,
      date_end: Date.now() + i * 99999999 + 99999999,
      time_start: Date.now() + i * 99999999,
      time_end: Date.now() + 50000 + i * 99999999,
      organizer: "IPSI Kota Bandung",
      created_by: "irfansud" + i + "gmail.com",
      created_at: Date.now() - i * 99999999,
      description: "Description " + i,
    });
  }
  return result;
};

const generateKategoriPertandingan = (
  endAlphabet: string,
  start: number,
  step: number,
  bebasBawah: boolean = false,
  bebasAtas: boolean = false
) => {
  const numberToAlphabet = (index: number) => {
    return String.fromCharCode(index + "A".charCodeAt(0));
  };

  const alphabetToNumber = (letter: string) => {
    return letter.toUpperCase().charCodeAt(0) - "A".charCodeAt(0);
  };

  const repeatValue = alphabetToNumber(endAlphabet);
  let kategoriArr: string[] = [];
  let startKategori: number = 0;

  if (bebasBawah) kategoriArr.push(`Kelas <A (Dibawah ${start} KG)`);

  startKategori = start;
  for (let i = 0; i <= repeatValue; i++) {
    kategoriArr.push(
      `Kelas ${numberToAlphabet(i)} (${startKategori}-${
        startKategori + step
      } KG)`
    );
    startKategori += step;
  }
  const endNumber = startKategori;
  if (bebasAtas) kategoriArr.push(`Kelas Bebas (Diatas ${endNumber} KG)`);
  return kategoriArr;
};

export const championships: Championship[] = [
  {
    id: "bandung-open-24",
    title: "Bandung Open Pencak Silat Tournament",
    image: {
      downloadUrl: "/images/championships/bandung-open-24/thumbnail.png",
    },
    location_name: "GOR KONI Kota Bandung",
    location_url: "https://maps.app.goo.gl/QKjqy6Y6gHY2Ey9L9",
    date_start: dateToNumber("2024-08-06"),
    date_end: dateToNumber("2024-08-10"),
    time_start: 0,
    organizer: "",
    created_by: "irfansud2nd@gmail.com",
    created_at: dateToNumber("2024-06-01"),
    description: "",
    register: {
      start: dateToNumber("2024-06-10"),
      end: dateToNumber("2024-07-31"),
    },
    athletes: 0,
    matchCount: 0,
    techmeet: {
      date: dateToNumber("2024-08-03 10:00:00"),
      location: {
        name: "GOR KONI Kota Bandung",
        url: "https://maps.app.goo.gl/QKjqy6Y6gHY2Ey9L9",
      },
    },
    matchCategory: [
      {
        level: "Pra Usia Dini (6-8 Tahun)",
        category: {
          fight: generateKategoriPertandingan("P", 16, 2),
          art: ["Tunggal"],
        },
        rookieOnly: true,
      },
      {
        level: "Usia Dini (8-11 Tahun)",
        category: {
          fight: generateKategoriPertandingan("O", 26, 2, true),
          art: ["Tunggal"],
        },
      },
      {
        level: "Pra Remaja (11-14 Tahun)",
        category: {
          fight: generateKategoriPertandingan("P", 30, 3, true),
          art: ["Tunggal", "Ganda", "Regu"],
        },
        rookieOnly: true,
      },
      {
        level: "Remaja (14-17 Tahun)",
        category: {
          fight: generateKategoriPertandingan("I", 39, 4, true, true),
          art: ["Tunggal", "Ganda", "Regu"],
        },
        limit: {
          paid: true,
          tanding: 16,
          tunggal: 16,
          ganda: 8,
          regu: 8,
        },
        oneAthletePerCategory: true,
      },
      {
        level: "Dewasa (17-30 Tahun)",
        category: {
          fight: generateKategoriPertandingan("J", 45, 5, true, true),
          art: ["Tunggal", "Ganda", "Regu"],
        },
        limit: {
          paid: true,
          tanding: 16,
          tunggal: 16,
          ganda: 8,
          regu: 8,
        },
        oneAthletePerCategory: true,
      },
    ],
    proposal:
      "https://firebasestorage.googleapis.com/v0/b/ipsi-bandung.appspot.com/o/proposal%2FPROPOSAL%20BANDUNG%20OPEN%20PENCAK%20SILAT%20TOURNAMENT.pdf?alt=media&token=468ece91-8965-4ad4-994b-22dc6fdcd9e1",
    status: {
      checkLimit: false,
      editOnly: false,
    },
    payment: {
      closed: false,
      total: 0,
      confirmed: 0,
      target: {
        name: "Andra Ramdhan Malela Putera",
        number: "0129228164100",
        bank: "BJB",
      },
      contact: {
        name: "Bob",
        phoneNumber: "6285794163821",
      },
    },
    matchCost: {
      tanding: 350000,
      tunggal: 350000,
      ganda: 350000,
      regu: 350000,
    },
    showOnHome: true,
    dialogOnHome: true,
    testerEmail: [
      "irfansud2nd@gmail.com",
      "iqbalbobalfarisy@gmail.com",
      "andra08malela@gmail.com",
    ],
  },
];

export type MatchCategory = {
  level: string;
  category: {
    fight: string[];
    art: ("Tunggal" | "Ganda" | "Regu")[];
  };
  rookieOnly?: boolean;
  limit?: {
    paid: boolean;
    tanding: number;
    tunggal: number;
    ganda: number;
    regu: number;
  };
  oneAthletePerCategory?: boolean;
}[];
