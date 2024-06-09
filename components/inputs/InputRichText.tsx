import { championships } from "@/lib/event/eventConstants";
import { InputProps, getInputValue } from "@/lib/form/formConstants";
import { Label } from "../ui/label";
import Tiptap from "../admin/news/Tiptap";
import { getChampionship } from "@/lib/event/eventFunctions";

type Props = InputProps;
const InputRichText = ({
  label,
  name,
  formik,
  championshipId,
  showOnEditOnly,
  className,
}: Props) => {
  const editOnly =
    (championshipId && getChampionship(championshipId)?.status.editOnly) ||
    false;

  const { setFieldValue, values } = formik;

  const value = getInputValue(name, values);

  return (
    <div
      className={`input_container 
      ${editOnly && !showOnEditOnly && "hidden"}
      ${className}
      `}
    >
      <Label>{label}</Label>
      <Tiptap onChange={(value) => setFieldValue(name, value)} text={value} />
    </div>
  );
};
export default InputRichText;
