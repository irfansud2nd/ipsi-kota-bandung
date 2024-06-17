import { Input } from "../ui/input";
import { Label } from "../ui/label";

type Props = {
  label: string;
  value: string | number;
};

const DisplayText = ({ label, value }: Props) => {
  return (
    <div className={`input_container`}>
      <Label>{label}</Label>
      <Input type="text" value={value} disabled />
    </div>
  );
};
export default DisplayText;
