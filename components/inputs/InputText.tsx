import { ErrorMessage } from "formik";
import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import ErrorText from "../ui/ErrorText";
import { calculateAge } from "@/lib/athlete/external/athleteFunctions";
import { championships } from "@/lib/event/eventConstants";
import { InputProps, getInputValue } from "@/lib/form/formConstants";
import { getChampionship } from "@/lib/event/eventFunctions";

type Props = InputProps & {
  upperCase?: boolean;
  displayOnly?: {
    state: boolean;
    value: string;
  };
};

const InputText = ({
  label,
  name,
  under17,
  className,
  formik,
  upperCase,
  helperText,
  forceDisabled,
  forceValue,
  showOnEditOnly,
  championshipId,
  displayOnly,
}: Props) => {
  const [display, setDisplay] = useState<string | undefined>();

  useEffect(() => {
    setDisplay(displayOnly?.value);
  }, [displayOnly?.value]);

  const {
    errors,
    touched,
    isSubmitting,
    values,
    setFieldValue,
    setFieldTouched,
  } = formik;

  const value = getInputValue(name, values);

  useEffect(() => {
    if (forceValue && value != forceValue) {
      setFieldValue(name, forceValue);
    }
  }, [forceValue]);

  let umur;
  if (under17) {
    umur = calculateAge(values.birthDate);
  }

  const editOnly =
    (championshipId && getChampionship(championshipId)?.status.editOnly) ||
    false;

  return (
    <div
      className={`input_container 
      ${editOnly && !showOnEditOnly && "hidden"}
      ${className}
      `}
    >
      <Label>
        {label}
        {under17 ? (
          <Badge className="px-1 py-0  pb-0.5 ml-1">
            {umur && umur >= 17 ? "Atlet" : "Orang Tua"}
          </Badge>
        ) : null}
        {helperText && (
          <span className="text-muted-foreground text-xs ml-1">
            {helperText}
          </span>
        )}
      </Label>
      <Input
        onBlur={() => setFieldTouched(name, true)}
        type="text"
        className={`${errors[name] && touched[name] && "border-destructive"}`}
        value={display ?? value}
        onChange={(e) =>
          !displayOnly?.state &&
          setFieldValue(
            name,
            upperCase ? e.target.value.toUpperCase() : e.target.value
          )
        }
        disabled={
          displayOnly?.state ? true : forceDisabled ? true : isSubmitting
        }
      />
      <ErrorMessage name={name} component={ErrorText} />
    </div>
  );
};

export default InputText;
