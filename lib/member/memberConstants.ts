import * as yup from "yup";
import { imageMaxSize, imageSchema } from "../form/formConstants";

export type Member = {
  id: string;
  name: string;
  position: string;
  order: number;
  image?: {
    file?: File;
    downloadUrl: string;
  };
};

export const memberInitialValue: Member = {
  id: "",
  name: "",
  position: "",
  order: 0,
  image: {
    downloadUrl: "",
  },
};

export const memberSchema = (ignoreImage: boolean = false) => {
  let schema = yup.object({
    name: yup
      .string()
      .required("Tolong lengkapi nama")
      .max(225, "Nama terlalu panjang"),
    position: yup
      .string()
      .required("Tolong lengkapi posisi")
      .max(225, "Posisi terlalu panjang"),
  });
  if (!ignoreImage)
    schema = schema.concat(
      yup.object({
        image: yup.object({
          file: imageSchema(imageMaxSize.member),
        }),
      })
    );
  return schema;
};
