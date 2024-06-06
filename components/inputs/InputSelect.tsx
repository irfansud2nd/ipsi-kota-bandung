"use client";
import React, { useEffect } from "react";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { championships } from "@/lib/event/eventConstants";
import { InputProps } from "@/lib/form/formConstants";

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
  eventId,
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

  const editOnly = championships.find((event) => event.id == eventId)?.status
    .editOnly;

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
        <SelectContent>
          {options.map((option) => (
            <SelectItem value={option} key={option}>
              {customOptionLabel ? customOptionLabel(option) : option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default InputSelect;
