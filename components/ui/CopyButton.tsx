import { FaRegCopy } from "react-icons/fa6";
import { Button } from "../ui/button";

const CopyButton = ({ text }: { text: string | number }) => {
  return (
    <Button
      type="button"
      variant={"ghost"}
      size={"icon"}
      onClick={() => navigator.clipboard.writeText(text.toString())}
    >
      <FaRegCopy className={`size-4`} />
    </Button>
  );
};
export default CopyButton;
