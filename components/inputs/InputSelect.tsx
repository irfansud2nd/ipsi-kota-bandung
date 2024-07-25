"use client";
import React, { useEffect } from "react";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { InputProps } from "@/lib/form/formConstants";
import { getChampionship } from "@/lib/event/eventFunctions";
import { ErrorMessage } from "formik";
import ErrorText from "../ui/ErrorText";

type InputSelectProps = InputProps & {
  options: string[];
  customOptionLabel?: (option: any) => string;
  dynamicOptions?: boolean;
  onChange?: (value: any) => void;
  onEdit?: boolean;
};

const InputSelect = ({
  name,
  label,
  options,
  formik,
  customOptionLabel,
  dynamicOptions,
  onChange,
  forceDisabled,
  forceValue,
  showOnEditOnly,
  onEdit,
  championshipId,
  className,
}: InputSelectProps) => {
  const { setFieldValue, values, isSubmitting } = formik;
  const value = values[name];

  useEffect(() => {
    if (options.length && dynamicOptions) {
      if (onEdit && options.includes(value)) return;
      setFieldValue(name, options[0]);
    }
  }, [options]);

  useEffect(() => {
    if (forceValue && value != forceValue) setFieldValue(name, forceValue);
  }, [forceValue]);

  const editOnly =
    (championshipId &&
      Date.now() > (getChampionship(championshipId)?.editLimit || 0)) ||
    false;

  return (
    <div
      className={`input_container 
      ${editOnly && !showOnEditOnly && "hidden"}
      ${className}
      `}
    >
      <Label>{label}</Label>
      <Select
        onValueChange={(value) => {
          onChange && onChange(value);
          setFieldValue(name, value);
        }}
        value={forceValue ? forceValue : value}
        disabled={forceDisabled ? true : isSubmitting}
      >
        <SelectTrigger>
          <SelectValue placeholder={value} />
        </SelectTrigger>
        <SelectContent className="max-h-[200px]">
          <SelectGroup>
            {options.map((option) => (
              <SelectItem value={option} key={option}>
                <span>
                  {customOptionLabel ? customOptionLabel(option) : option}
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <ErrorMessage name={name} component={ErrorText} />
    </div>
  );
};

export default InputSelect;
