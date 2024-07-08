import * as yup from "yup";
import { imageMaxSize, imageSchema } from "../form/formConstants";

export type EmployeeBase = {
  id: string;
  name: string;
  position: string;
  order: number;
};

export type Employee = EmployeeBase & {
  image?: {
    file?: File;
    downloadUrl: string;
  };
};
export type EmployeeSql = EmployeeBase & {
  image: string;
};

export const employeeInitialValue: Employee = {
  id: "",
  name: "",
  position: "",
  order: 0,
  image: {
    downloadUrl: "",
  },
};

export const employeeSchema = (ignoreImage: boolean = false) => {
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
          file: imageSchema(imageMaxSize.employee),
        }),
      })
    );

  return schema;
};
