"use client";

import useShowFile from "@/hooks/useShowFile";
import { Button } from "../ui/button";
import { FaRegFileImage } from "react-icons/fa6";

type Props = {
  title: string;
  src?: string;
  landscape?: boolean;
};

const ShowFileButton = ({ title, src, landscape }: Props) => {
  const { showFile, ShowFileDialog } = useShowFile();
  const handleClick = () => {
    if (src) {
      showFile(title, src, landscape);
    }
  };
  return (
    <>
      <ShowFileDialog />
      <Button
        size={"icon"}
        variant={"outline"}
        onClick={handleClick}
        disabled={!src}
      >
        <FaRegFileImage className="size-4" />
      </Button>
    </>
  );
};
export default ShowFileButton;
