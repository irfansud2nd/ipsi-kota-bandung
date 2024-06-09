import { adultGender, imageSchema } from "../form/formConstants";
import * as yup from "yup";

export const officialPositions = ["Official", "Manajer Tim", "Pelatih"];

export type OfficialBase = {
  id: string;
  name: string;
  gender: string;
  contingent_id: string;
  contingent_name: string;
  position: string;
  created_by: string;
  created_at: number;
};

export type OfficialSql = OfficialBase & {
  image: string;
};

export type Official = OfficialBase & {
  image: {
    file?: File;
    downloadUrl: string;
  };
};

export const officialInitialValue: Official = {
  id: "",
  name: "",
  gender: adultGender[0],
  contingent_id: "",
  contingent_name: "",
  position: officialPositions[0],
  created_by: "",
  created_at: 0,
  image: {
    downloadUrl: "",
  },
};

export const officialSchema = (ignoreImage?: boolean) => {
  let schema = yup.object({
    name: yup.string().required("Tolong lengkapi nama lengkap"),
    contingent_name: yup
      .string()
      .required("Tolong daftarkan kontingen terlebih dahulu"),
  });

  if (!ignoreImage)
    schema = schema.concat(
      yup.object({
        image: yup.object({
          file: imageSchema(1),
        }),
      })
    );

  return schema;
};
