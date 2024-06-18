"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "./label";

type Props = {
  options: string[];
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disable?: boolean;
};
const SelectComponent = ({
  value,
  label,
  options,
  onChange,
  disable,
  className,
}: Props) => {
  return (
    <div className="input_container">
      <Label>{label}</Label>
      <Select
        value={value}
        onValueChange={(value) => onChange(value)}
        disabled={disable}
      >
        <SelectTrigger className={`${className}`}>
          <SelectValue placeholder={options[0]} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((item) => (
              <SelectItem value={item} key={item} className={className}>
                {item}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
export default SelectComponent;
