import { Input } from "../ui/input";
import { Label } from "../ui/label";

type Props = {
  label: string;
  value: string | number;
  helperText?: string;
};

const DisplayText = ({ label, value, helperText }: Props) => {
  return (
    <div className={`input_container`}>
      <Label>
        {label}
        {helperText && (
          <span className="text-muted-foreground text-xs ml-1">
            {helperText}
          </span>
        )}
      </Label>
      <Input type="text" value={value} disabled />
    </div>
  );
};
export default DisplayText;
