import * as yup from "yup";
import { imageMaxSize, imageSchema } from "../form/formConstants";
import { v4 } from "uuid";

export type NewsBase = {
  id: string;
  title: string;
  text: string;
  created_by: string;
  writer: string;
  created_at: number;
};

export type NewsSql = NewsBase & {
  image: string;
};

export type News = NewsBase & {
  image: {
    file?: File;
    downloadUrl: string;
  };
};

export const newsInitialValue: News = {
  id: "",
  title: "",
  image: {
    file: undefined,
    downloadUrl: "",
  },
  text: "",
  created_by: "",
  writer: "IPSI Kota Bandung",
  created_at: 0,
};

export const newsSchema = (ignoreImage: boolean = false) => {
  let schema = yup.object({
    title: yup
      .string()
      .required("Tolong lengkapi judul berita")
      .max(225, "Judul berita terlalu panjang"),
    text: yup.string().required("Tolong lengkapi isi berita"),
    writer: yup.string().required("Tolong lengkapi nama penulis"),
  });
  if (!ignoreImage)
    schema = schema.concat(
      yup.object({
        image: yup.object({
          file: imageSchema(imageMaxSize.news),
        }),
      })
    );
  return schema;
};
