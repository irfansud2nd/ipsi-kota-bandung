"use client";
import { ErrorMessage, Field, FieldProps, FormikProps } from "formik";
import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import ErrorText from "../ui/ErrorText";
import { InputProps, getInputValue } from "@/lib/form/formConstants";
import { dateToNumber, formatDate, timeToNumber } from "@/lib/functions";
import { getChampionship } from "@/lib/event/eventFunctions";
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

  const editOnly =
    (championshipId && getChampionship(championshipId)?.status.editOnly) ||
    false;

  return (
    <div
      className={`input_container 
      ${editOnly && !showOnEditOnly && "hidden"}
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
