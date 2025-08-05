"use client";
import { ErrorMessage, Field, FieldProps, FormikProps } from "formik";
import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import ErrorText from "../ui/ErrorText";
import { InputProps, getInputValue } from "@/lib/form/formConstants";
import { dateToNumber, formatDate, timeToNumber } from "@/lib/functions";
import { getChampionship } from "@/lib/event/eventFunctions";
import { useSession } from "next-auth/react";
type Props = InputProps & {
  time?: boolean;
};
const InputDate = ({
  label,
  name,
  className,
  formik,
  helperText,
  showOnEditOnly,
  championshipId,
  time,
}: Props) => {
  const {
    values,
    setFieldValue,
    isSubmitting,
    errors,
    touched,
    setFieldTouched,
  } = formik;
  const value = getInputValue(name, values);

  let disableAdd = false;
  let disableEdit = false;
  let hide = false;
  const championship = getChampionship(championshipId || "");
  const now = Date.now();

  if (championship) {
    disableAdd = now > championship.register.end;
    disableEdit = now > championship.editLimit;

    if ((disableAdd || disableEdit) && championship.privilegedEmail?.length) {
      const session = useSession();
      if (
        championship.privilegedEmail.includes(
          session.data?.user?.email as string
        )
      ) {
        if (disableAdd) disableAdd = false;
        if (disableEdit) disableEdit = false;
      }
    }
  }

  if (disableAdd && !showOnEditOnly && !disableEdit) {
    hide = true;
  }

  if (hide) return null;

  return (
    <div
      className={`input_container 
      ${className}`}
    >
      <Label>
        {label}
        {helperText && (
          <span className="text-muted-foreground text-xs ml-1">
            {helperText}
          </span>
        )}
      </Label>
      <Input
        onBlur={() => setFieldTouched(name, true)}
        className={`${errors[name] && touched[name] && "border-destructive"}`}
        type={time ? "time" : "date"}
        value={formatDate(value, {
          htmlFormat: true,
          monthNumber: true,
          hourOnly: time,
          withoutHour: true,
        })}
        onChange={(e) => {
          setFieldValue(
            name,
            time ? timeToNumber(e.target.value) : dateToNumber(e.target.value)
          );
        }}
        disabled={isSubmitting}
      />
      <ErrorMessage name={name} component={ErrorText} />
    </div>
  );
};

export default InputDate;
