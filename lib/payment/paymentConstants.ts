import * as yup from "yup";
import { imageSchema } from "../form/formConstants";

export type PaymentBase = {
  id: string;
  total: number;
  contingent_registration_id: number;
  phone_number: string;
  confirmed_by: string;
  created_at: number;
};

export type PaymentSql = PaymentBase & {
  image: string;
};

export type Payment = PaymentBase & {
  contingent_id: string;
  contingent_name: string;
  championship_id: string;
  image: {
    file?: File;
    downloadUrl: string;
  };
};

export const paymentInitialValue: Payment = {
  id: "",
  total: 0,
  contingent_registration_id: 0,
  contingent_id: "",
  contingent_name: "",
  championship_id: "",
  phone_number: "",
  confirmed_by: "",
  created_at: 0,
  image: {
    downloadUrl: "",
  },
};

export const paymentSchema = yup.object({
  phone_number: yup
    .number()
    .typeError("No HP mengandung huruf")
    .required("Tolong lengkapi No HP"),
  image: yup.object({
    file: imageSchema(1),
  }),
});
