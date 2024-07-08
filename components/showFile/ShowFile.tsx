"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import { saveAs } from "file-saver";
import { toastError } from "@/lib/form/formFunctions";

type Props = {
  label: string;
  src: string;
  landscape?: boolean;
  className?: string;
};

const ShowFile = ({ label, src, landscape, className }: Props) => {
  const [skeleton, setSkeleton] = useState(true);

  const handleDownload = async () => {
    try {
      const response = await fetch(
        `/api/downloadimage?src=${encodeURIComponent(src)}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob();
      saveAs(blob, label + ".png");
    } catch (error) {
      toastError(error);
    }
  };

  return (
    <div className={`flex flex-col gap-1 items-center w-fit ${className}`}>
      <Label>{label}</Label>
      <div
        className={`border rounded-md relative overflow-hidden
            ${landscape ? "aspect-video" : "aspect-[9/16]"}`}
      >
        <img
          src={src}
          className={`transition-all object-contain object-center bg-gray-200
              ${skeleton ? "opacity-0" : "opacity-100"}
              ${landscape ? "aspect-video" : "aspect-[9/16]"}
              `}
          onLoad={() => setSkeleton(false)}
        />
        {skeleton && (
          <Skeleton
            className={`w-full h-full absolute top-0 ${
              landscape ? "aspect-video" : "aspect-[9/16]"
            }`}
          />
        )}
      </div>
      <div className="flex gap-1">
        <Button size={"sm"} asChild>
          <Link href={src} target="_blank">
            Buka di Tab baru
          </Link>
        </Button>
        <Button size={"sm"} onClick={handleDownload}>
          Unduh
        </Button>
      </div>
    </div>
  );
};

export default ShowFile;
