import { adultGender, imageSchema } from "../form/formConstants";
import * as yup from "yup";

export const officialPositions = ["Official", "Manajer Tim", "Pelatih"];

export type OfficialBase = {
  id: string;
  name: string;
  gender: string;
  contingent_id: string;
  contingent_name: string;
  phone_number: string;
  position: string;
  created_at: number;
};

export type OfficialSql = OfficialBase & {
  image: string;
  certificate_file: string;
};

export type Official = OfficialBase & {
  image: {
    file?: File;
    downloadUrl: string;
  };
  certificate_file: {
    file?: File;
    downloadUrl: string;
  };
};

export const officialInitialValue: Official = {
  id: "",
  name: "",
  phone_number: "",
  gender: adultGender[0],
  contingent_id: "",
  contingent_name: "",
  position: officialPositions[0],
  created_at: 0,
  image: {
    downloadUrl: "",
  },
  certificate_file: {
    downloadUrl: "",
  },
};

export const officialSchema = (ignore?: {
  image: boolean;
  certificateFile: boolean;
}) => {
  let schema = yup.object({
    name: yup.string().required("Tolong lengkapi nama lengkap"),
    contingent_name: yup
      .string()
      .required("Tolong daftarkan kontingen terlebih dahulu"),
    phone_number: yup
      .number()
      .typeError("No HP mengandung huruf")
      .required("Tolong lengkapi No HP"),
  });

  if (!ignore?.image)
    schema = schema.concat(
      yup.object({
        image: yup.object({
          file: imageSchema(),
        }),
      })
    );

  // if (!ignore?.certificateFile)
  //   schema = schema.concat(
  //     yup.object({
  //       certificate_file: yup.object({
  //         file: imageSchema(),
  //       }),
  //     })
  //   );

  return schema;
};
