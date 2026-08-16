"use client";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { MdOutlineDeleteForever } from "react-icons/md";
import { deleteOfficial } from "@/lib/official/officialFunctions";
import { useRouter } from "next/navigation";
import useConfirmation from "@/hooks/useConfirmation";
import { Official } from "@/lib/official/officialContants";

const OfficialDeleteButton = ({ official }: { official: Official }) => {
  const router = useRouter();
  const { confirm, ConfirmationDialog } = useConfirmation();

  const handleDelete = async () => {
    const result = await confirm("Hapus Official");
    if (!result) return;
    await deleteOfficial(official);
    router.refresh();
  };

  return (
    <>
      <ConfirmationDialog />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant={"outline"} size={"icon"} onClick={handleDelete}>
              <MdOutlineDeleteForever />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Hapus</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
};

export default OfficialDeleteButton;
