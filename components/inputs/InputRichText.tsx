import { InputProps, getInputValue } from "@/lib/form/formConstants";
import { Label } from "../ui/label";
import Tiptap from "../admin/news/Tiptap";

type Props = InputProps;
const InputRichText = ({ label, name, formik, className }: Props) => {
  const { setFieldValue, values } = formik;

  const value = getInputValue(name, values);

  return (
    <div
      className={`input_container 
      ${className}
      `}
    >
      <Label>{label}</Label>
      <Tiptap onChange={(value) => setFieldValue(name, value)} text={value} />
    </div>
  );
};
export default InputRichText;
