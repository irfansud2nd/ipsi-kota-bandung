import { FormikProps } from "formik";
import * as yup from "yup";

export const getInputValue = (name: string, values: any) => {
  if (!name.includes(".")) return values[name];
  const names = name.split(".");
  let value: any;
  names.map((name, i) => (value = i == 0 ? values[name] : value[name]));
  return value;
};

export type InputProps = {
  label: string;
  name: string;
  formik: FormikProps<any>;
  helperText?: string;
  className?: string;
  under17?: boolean;
  forceDisabled?: boolean;
  forceValue?: string;
  showOnEditOnly?: boolean;
  eventId?: string;
};

export const imageSchema = (mb: number = 1) => {
  return yup
    .mixed()
    .test({
      message: "Tolong lengkapi",
      test: (file: any, context) => {
        const isValid = file !== undefined;
        if (!isValid) context?.createError();
        return isValid;
      },
    })
    .test({
      message: "Format tidak valid, (gunakan file .jpeg .jpg atau .png)",
      test: (file: any, context) => {
        const isValid = ["image/jpeg", "image/jpg", "image/png"].includes(
          file?.type
        );
        if (!isValid) context?.createError();
        return isValid;
      },
    })
    .test({
      message: `File melebihi ${mb} MB`,
      test: (file: any, context) => {
        const isValid = file?.size <= mb * 1024 * 1024;
        if (!isValid) context?.createError();
        return isValid;
      },
    });
};

export const imageMaxSize = {
  news: 2,
  event: 2,
  member: 1,
};
