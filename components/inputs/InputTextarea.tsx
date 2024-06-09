import { ErrorMessage, FormikProps } from "formik";
import React from "react";
import { Label } from "../ui/label";
import ErrorText from "../ui/ErrorText";
import { InputProps } from "@/lib/form/formConstants";
import { Textarea } from "../ui/textarea";
import { championships } from "@/lib/event/eventConstants";
import { getChampionship } from "@/lib/event/eventFunctions";

type Props = InputProps;

const InputTextarea = ({
  label,
  name,
  formik,
  showOnEditOnly,
  championshipId,
}: Props) => {
  const {
    errors,
    touched,
    isSubmitting,
    setFieldValue,
    values,
    setFieldTouched,
  } = formik;

  const editOnly =
    (championshipId && getChampionship(championshipId)?.status.editOnly) ||
    false;

  return (
    <div
      className={`input_container 
      ${editOnly && !showOnEditOnly && "hidden"}`}
    >
      <Label htmlFor={name}>{label}</Label>
      <Textarea
        onBlur={() => setFieldTouched(name, true)}
        disabled={isSubmitting}
        onChange={(e) => setFieldValue(name, e.target.value)}
        value={values[name]}
        className={`resize-none 
        ${errors[name] && touched[name] && "border-destructive"}`}
        rows={3}
      />
      <ErrorMessage name={name} component={ErrorText} />
    </div>
  );
};

export default InputTextarea;
