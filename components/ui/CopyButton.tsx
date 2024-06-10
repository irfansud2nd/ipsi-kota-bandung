import { FaRegCopy } from "react-icons/fa6";
import { Button } from "../ui/button";

const CopyButton = ({
  text,
  className,
}: {
  text: string | number;
  className?: string;
}) => {
  return (
    <Button
      type="button"
      variant={"secondary"}
      size={"icon"}
      onClick={() => navigator.clipboard.writeText(text.toString())}
      className={className}
    >
      <FaRegCopy className={`size-4`} />
    </Button>
  );
};
export default CopyButton;
