"use client";
import { FaRegCopy } from "react-icons/fa6";
import { Button } from "../ui/button";
import { toast } from "sonner";

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
      onClick={() =>
        navigator.clipboard
          .writeText(text.toString())
          .then(() => toast.success("Text berhasil disalin", { duration: 700 }))
      }
      className={className}
    >
      <FaRegCopy className={`size-4`} />
    </Button>
  );
};
export default CopyButton;
