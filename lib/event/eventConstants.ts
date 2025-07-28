import { v4 } from "uuid";
import * as yup from "yup";
import { imageMaxSize, imageSchema } from "../form/formConstants";
import { dateToNumber } from "../functions";

export type Bank = "BJB" | "RAYA";

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
  date_end: number;
  register: {
    start: number;
    end: number;
  };
  editLimit: number;
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
  };
  payment: {
    closedAt: number;
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
  officialGroupLink?: string;
  reserveForPal: boolean;
  showOnHome?: boolean;
  dialogOnHome?: boolean;
  testerEmail?: string[];
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
    title: "Bandung Pencak Silat Tournament 2024",
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
      end: dateToNumber("2024-07-26", "13:00"),
    },
    editLimit: dateToNumber("2024-07-28", "23:59"),
    athletes: 0,
    matchCount: 0,
    techmeet: {
      date: dateToNumber("2024-08-04", "10:00"),
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
        schema: "ROOKIE",
      },
      {
        level: "Usia Dini (8-11 Tahun)",
        category: {
          fight: generateKategoriPertandingan("O", 26, 2, true),
          art: ["Tunggal"],
        },
        schema: "BOTH",
      },
      {
        level: "Pra Remaja (11-14 Tahun)",
        category: {
          fight: generateKategoriPertandingan("P", 30, 3, true),
          art: ["Tunggal", "Ganda", "Regu"],
        },
        schema: "ROOKIE",
      },
      {
        level: "Remaja (14-17 Tahun)",
        category: {
          fight: generateKategoriPertandingan("I", 39, 4, true, true),
          art: ["Tunggal", "Ganda", "Regu"],
        },
        schema: "BOTH",
        limit: {
          paid: true,
          putra: {
            tanding: 16,
            tunggal: 16,
            ganda: 8,
            regu: 8,
          },
          putri: {
            tanding: 16,
            tunggal: 16,
            ganda: 8,
            regu: 8,
          },
        },
        oneAthletePerCategory: true,
      },
      {
        level: "Dewasa (17-30 Tahun)",
        category: {
          fight: generateKategoriPertandingan("J", 45, 5, true, true),
          art: ["Tunggal", "Ganda", "Regu"],
        },
        schema: "BOTH",
        limit: {
          paid: true,
          putra: {
            tanding: 16,
            tunggal: 16,
            ganda: 8,
            regu: 8,
          },
          putri: {
            tanding: 16,
            tunggal: 16,
            ganda: 8,
            regu: 8,
          },
        },
        oneAthletePerCategory: true,
      },
    ],
    proposal: "#",
    status: {
      checkLimit: false,
    },
    payment: {
      closedAt: dateToNumber("2024-08-05", "16:00"),
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
    reserveForPal: false,
    officialGroupLink: "https://chat.whatsapp.com/FD4me26mk1FD7FOC1dMDoR",
    showOnHome: true,
    dialogOnHome: false,
    testerEmail: [
      "irfansud2nd@gmail.com",
      "iqbalbobalfarisy@gmail.com",
      "andra08malela@gmail.com",
    ],
  },
  {
    id: "bandung-open-25",
    title: "Bandung Pencak Silat Tournament 2025",
    image: {
      downloadUrl: "/images/championships/bandung-open-25/thumbnail.png",
    },
    location_name: "GOR KONI Kota Bandung",
    location_url: "https://maps.app.goo.gl/QKjqy6Y6gHY2Ey9L9",
    date_start: dateToNumber("2025-08-06"),
    date_end: dateToNumber("2025-08-10"),
    time_start: 0,
    organizer: "",
    created_by: "irfansud2nd@gmail.com",
    created_at: dateToNumber("2025-05-16"),
    description: "",
    register: {
      start: dateToNumber("2025-06-01"),
      end: dateToNumber("2025-07-28", "17:59"),
    },
    editLimit: dateToNumber("2025-07-28", "17:59"),
    athletes: 0,
    matchCount: 0,
    techmeet: {
      date: dateToNumber("2025-08-03", "08:00"),
      location: {
        name: "GOR KONI Kota Bandung",
        url: "https://maps.app.goo.gl/QKjqy6Y6gHY2Ey9L9",
      },
    },
    matchCategory: [
      {
        level: "Usia Dini I (SD Kelas 1, 2, 3)",
        category: {
          fight: generateKategoriPertandingan("T", 16, 2),
          art: ["Tunggal Tangan Kosong", "Tunggal Bersenjata"],
        },
        schema: "ROOKIE",
      },
      {
        level: "Usia Dini II (SD Kelas 4, 5, 6)",
        category: {
          fight: generateKategoriPertandingan("T", 26, 2, true),
          art: [
            "Tunggal Tangan Kosong",
            "Tunggal Bersenjata",
            "Ganda Tangan Kosong",
            "Ganda Bersenjata",
            "Regu A (1-6)",
            "Regu B(7-12)",
          ],
        },
        schema: "ROOKIE",
      },
      {
        level: "Pra Remaja (SMP)",
        category: {
          fight: generateKategoriPertandingan("P", 30, 3, true),
          art: [
            "Tunggal Tangan Kosong",
            "Tunggal Bersenjata",
            "Ganda Tangan Kosong",
            "Ganda Bersenjata",
            "Regu A (1-6)",
            "Regu B (7-12)",
          ],
        },
        schema: "ROOKIE",
      },
      {
        level: "Remaja (SMA)",
        category: {
          fight: generateKategoriPertandingan("I", 39, 4, true, true),
          art: ["Tunggal Tangan Kosong", "Tunggal Bersenjata"],
        },
        schema: "ROOKIE",
      },
      {
        level: "Dewasa (Mahasiswa & Umum)",
        category: {
          fight: generateKategoriPertandingan("J", 45, 5, true, true),
          art: ["Tunggal Tangan Kosong", "Tunggal Bersenjata"],
        },
        schema: "ROOKIE",
      },
      {
        level: "SD (Kelas 4, 5, 6)",
        category: {
          fight: generateKategoriPertandingan("T", 26, 2, true),
          art: ["Tunggal", "Ganda", "Regu"],
        },
        schema: "PRO",
        oneAthletePerCategory: true,
        limit: {
          paid: true,
          putra: {
            tanding: 32,
            tunggal: 32,
            ganda: 32,
            regu: 32,
          },
          putri: {
            tanding: 32,
            tunggal: 32,
            ganda: 32,
            regu: 32,
          },
        },
      },
      {
        level: "SMP",
        category: {
          fight: generateKategoriPertandingan("P", 30, 3, true),
          art: ["Tunggal", "Ganda", "Regu"],
        },
        schema: "PRO",
        oneAthletePerCategory: true,
        limit: {
          paid: true,
          putra: {
            tanding: 32,
            tunggal: 32,
            ganda: 32,
            regu: 32,
          },
          putri: {
            tanding: 32,
            tunggal: 64,
            ganda: 32,
            regu: 32,
          },
        },
      },
      {
        level: "SMA",
        category: {
          fight: generateKategoriPertandingan("I", 39, 4, true, true),
          art: ["Tunggal", "Ganda", "Regu"],
        },
        schema: "PRO",
        oneAthletePerCategory: true,
        limit: {
          paid: true,
          putra: {
            tanding: 32,
            tunggal: 32,
            ganda: 32,
            regu: 32,
          },
          putri: {
            tanding: 32,
            tunggal: 32,
            ganda: 32,
            regu: 32,
          },
        },
      },
      {
        level: "Mahasiswa & Umum (17 - 30 Tahun)",
        category: {
          fight: generateKategoriPertandingan("J", 45, 5, true, true),
          art: ["Tunggal", "Ganda", "Regu"],
        },
        schema: "PRO",
        oneAthletePerCategory: true,
        limit: {
          paid: true,
          putra: {
            tanding: 32,
            tunggal: 32,
            ganda: 32,
            regu: 32,
          },
          putri: {
            tanding: 32,
            tunggal: 32,
            ganda: 32,
            regu: 32,
          },
        },
      },
    ],
    proposal:
      "https://firebasestorage.googleapis.com/v0/b/ipsi-bandung.appspot.com/o/proposal%2FPROPOSAL%20BANDUNG%20OPEN%20PENCAK%20SILAT%20TOURNAMENT%202025.pdf?alt=media&token=e4beac31-abce-446d-8f98-00a4ab23dec8",
    status: {
      checkLimit: false,
    },
    payment: {
      closedAt: dateToNumber("2025-08-01", "23:59"),
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
      tanding: 375000,
      tunggal: 375000,
      ganda: 375000,
      regu: 375000,
    },
    reserveForPal: false,
    officialGroupLink: "https://chat.whatsapp.com/DExK59aj2Vs8SJTA84UnXi",
    showOnHome: true,
    dialogOnHome: false,
    testerEmail: [
      "irfansud2nd@gmail.com",
      "iqbalbobalfarisy@gmail.com",
      "andra08malela@gmail.com",
    ],
  },
  // {
  //   id: "usc-25",
  //   title: "UNPAS Silat Championship 2025",
  //   image: {
  //     downloadUrl: "/images/championships/usc-25/thumbnail.png",
  //   },
  //   location_name: "GOR KONI Kota Bandung",
  //   location_url: "https://maps.app.goo.gl/QKjqy6Y6gHY2Ey9L9",
  //   date_start: dateToNumber("2025-05-01"),
  //   date_end: dateToNumber("2025-05-04"),
  //   time_start: 0,
  //   organizer: "",
  //   created_by: "irfansud2nd@gmail.com",
  //   created_at: dateToNumber("2025-02-15"),
  //   description: "",
  //   register: {
  //     start: dateToNumber("2025-02-12"),
  //     end: dateToNumber("2025-04-23", "23:59"),
  //   },
  //   editLimit: dateToNumber("2025-04-23", "23:59"),
  //   athletes: 0,
  //   matchCount: 0,
  //   techmeet: {
  //     date: dateToNumber("2025-04-24", "08:00"),
  //     location: {
  //       name: "GOR KONI Kota Bandung",
  //       url: "https://maps.app.goo.gl/QKjqy6Y6gHY2Ey9L9",
  //     },
  //   },
  //   matchCategory: [
  //     {
  //       level: "Usia Dini I (SD Kelas 1, 2, & 3)",
  //       category: {
  //         fight: generateKategoriPertandingan("P", 16, 2),
  //         art: ["Tunggal"],
  //       },
  //       rookieOnly: true,
  //     },
  //     {
  //       level: "Usia Dini II (SD Kelas 4, 5, & 6)",
  //       category: {
  //         fight: generateKategoriPertandingan("O", 26, 2, true),
  //         art: ["Tunggal"],
  //       },
  //       proOnly: true,
  //       oneAthletePerCategory: true,
  //     },
  //     {
  //       level: "SMP",
  //       category: {
  //         fight: generateKategoriPertandingan("I", 39, 4, true, true),
  //         art: ["Tunggal", "Ganda", "Regu"],
  //       },
  //       proOnly: true,
  //       oneAthletePerCategory: true,
  //     },
  //     {
  //       level: "SMA",
  //       category: {
  //         fight: generateKategoriPertandingan("J", 45, 5, true, true),
  //         art: ["Tunggal", "Ganda", "Regu"],
  //       },
  //       limit: {
  //         paid: true,
  //         tanding: 16,
  //         tunggal: 16,
  //         ganda: 8,
  //         regu: 8,
  //       },
  //       proOnly: true,
  //       oneAthletePerCategory: true,
  //     },
  //     {
  //       level: "Mahasiswa",
  //       category: {
  //         fight: generateKategoriPertandingan("J", 45, 5, true, true),
  //         art: ["Tunggal", "Ganda", "Regu"],
  //       },
  //       limit: {
  //         paid: true,
  //         tanding: 16,
  //         tunggal: 16,
  //         ganda: 8,
  //         regu: 8,
  //       },
  //       proOnly: true,
  //       oneAthletePerCategory: true,
  //     },
  //   ],
  //   proposal:
  //     "https://firebasestorage.googleapis.com/v0/b/ipsi-bandung.appspot.com/o/proposal%2FPROPOSAL%20USC%202025.pdf?alt=media&token=4c36b6ee-47f4-48cd-b4c7-6fa402de1078",
  //   status: {
  //     checkLimit: false,
  //   },
  //   payment: {
  //     closedAt: dateToNumber("2025-04-23", "16:00"),
  //     total: 0,
  //     confirmed: 0,
  //     target: {
  //       name: "SYAFIRA NASHWA H",
  //       number: "001001647471312",
  //       bank: "RAYA",
  //     },
  //     contact: {
  //       name: "Hanna",
  //       phoneNumber: "6281394706019",
  //     },
  //   },
  //   matchCost: {
  //     tanding: 350000,
  //     tunggal: 350000,
  //     ganda: 350000,
  //     regu: 350000,
  //   },
  //   reserveForPal: false,
  //   // officialGroupLink: "https://chat.whatsapp.com/FD4me26mk1FD7FOC1dMDoR",
  //   showOnHome: true,
  //   dialogOnHome: false,
  //   testerEmail: [
  //     "irfansud2nd@gmail.com",
  //     "iqbalbobalfarisy@gmail.com",
  //     "andra08malela@gmail.com",
  //   ],
  // },
];

export type MatchCategory = {
  level: string;
  category: {
    fight: string[];
    art: string[];
  };
  schema: "ROOKIE" | "PRO" | "BOTH";
  limit?: {
    paid: boolean;
    putra: {
      tanding: number;
      tunggal: number;
      ganda: number;
      regu: number;
    };
    putri: {
      tanding: number;
      tunggal: number;
      ganda: number;
      regu: number;
    };
  };
  oneAthletePerCategory?: boolean;
}[];
