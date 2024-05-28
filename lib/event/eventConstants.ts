import { v4 } from "uuid";
import * as yup from "yup";
import { imageMaxSize, imageSchema } from "../form/formConstants";

export type Event = {
  id: string;
  title: string;
  image: {
    file?: File;
    downloadUrl: string;
  };
  location: {
    name: string;
    url?: string;
  };
  date: {
    start: number;
    end?: number;
  };
  time: {
    start: number;
    end?: number;
  };
  creator: {
    name: string;
    email: string;
  };
  createdAt: number;
  description: string;
};

export const eventInitialValue: Event = {
  id: "",
  title: "",
  image: {
    file: undefined,
    downloadUrl: "",
  },
  location: {
    name: "",
  },
  date: {
    start: 0,
  },
  time: {
    start: 0,
  },
  creator: {
    name: "IPSI Kota Bandung",
    email: "",
  },
  createdAt: 0,
  description: "",
};

export const eventSchema = (ignoreImage: boolean = false) => {
  let schema = yup.object({
    title: yup
      .string()
      .required("Tolong lengkapi judul event")
      .max(225, "Judul event terlalu panjang"),
    location: yup.object({
      name: yup.string().required("Tolong lengkapi nama lokasi"),
      url: yup.string().url("Link tidak valid"),
    }),
    date: yup.object({
      start: yup.number().min(1, "Tolong lengkapi tanggal mulai"),
    }),
    time: yup.object({
      start: yup.number().min(1, "Tolong lengkapi jam mulai"),
    }),
    creator: yup.object({
      name: yup
        .string()
        .required("Tolong lengkapi nama penyelenggara")
        .max(225, "Nama penyelenggara terlalu panjang"),
    }),
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
    date: {
      start: number;
      end: number;
    };
  };
  Athletes: number;
  nomorPertandingan: number;
  status: {
    checkLimit: boolean;
    editOnly: boolean;
  };
  payment: {
    closed: boolean;
    total: number;
    confirmed: number;
  };
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
      location: {
        name: "Location " + i,
      },
      date: {
        start: Date.now() + i * 99999999,
        end: Date.now() + i * 99999999 + 99999999,
      },
      time: {
        start: Date.now() + i * 99999999,
        end: Date.now() + 50000 + i * 99999999,
      },
      creator: {
        name: "IPSI Kota Bandung",
        email: "irfansud" + i + "gmail.com",
      },
      createdAt: Date.now() - i * 99999999,
      description: "Description " + i,
    });
  }
  return result;
};

export const getDummychampionships = (
  length: number,
  startNumber: number = 1
) => {
  let result: Championship[] = [];
  for (let i = 1 + startNumber; i <= length + startNumber; i++) {
    result.push({
      id: v4(),
      title: "Championship " + i,
      image: {
        downloadUrl: "url " + i,
      },
      location: {
        name: "Location " + i,
        url: "locationUrl " + i,
      },
      date: {
        start: Date.now() + i * 99999999,
        end: Date.now() + i * 99999999 + 99999999,
      },
      time: {
        start: Date.now() + i * 99999999,
        end: Date.now() + 50000 + i * 99999999,
      },
      creator: {
        name: "Pesilat Championship",
        email: "irfansud" + i + "gmail.com",
      },
      createdAt: Date.now() - i * 99999999 - 99999999,
      register: {
        date: {
          start: Date.now() - i * 99999999,
          end: Date.now(),
        },
      },
      Athletes: 2,
      nomorPertandingan: 3,
      status: {
        checkLimit: false,
        editOnly: false,
      },
      payment: {
        closed: false,
        total: 1000000,
        confirmed: 300000,
      },
      description: "desc",
    });
  }
  return result;
};

// export const championships = getDummychampionships(3);
export const championships: Championship[] = [
  {
    id: "championship-1",
    title: "Championship 1",
    image: {
      downloadUrl: "/images/logo-ipsi.png",
    },
    location: {
      name: "Location 1",
      url: "locationUrl 1",
    },
    date: {
      start: 1714640316973 + 86400000,
      end: 1714640316973 + 3 * 86400000,
    },
    time: {
      start: 1714640316973 + 86400000,
      end: 1714640316973 + 8 * 3600000,
    },
    creator: {
      name: "Pesilat Championship",
      email: "irfansud1" + "gmail.com",
    },
    createdAt: 1714640316973,
    register: {
      date: {
        start: 1714640316973 - 99999999,
        end: 1714640316973,
      },
    },
    Athletes: 2,
    nomorPertandingan: 3,
    status: {
      checkLimit: false,
      editOnly: false,
    },
    payment: {
      closed: false,
      total: 1000000,
      confirmed: 300000,
    },
    description: "desc",
  },
];
