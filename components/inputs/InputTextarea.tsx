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

  let disableAdd = false;
  let disableEdit = false;
  let hide = false;
  const championship = getChampionship(championshipId || "");
  const now = Date.now();

  if (championship) {
    disableAdd = now > championship.register.end;
    disableEdit = now > championship.editLimit;
  }

  if (disableAdd && !showOnEditOnly && !disableEdit) {
    hide = true;
  }

  if (hide) return null;

  return (
    <div className={`input_container`}>
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
