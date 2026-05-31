"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Skeleton } from "../ui/skeleton";
import { BiLoader } from "react-icons/bi";
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
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
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
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className={`flex flex-col gap-1 items-center w-fit ${className}`}>
      <div className="relative">
        <img
          src={src}
          className={`transition-all object-contain object-center max-h-[400px]
          ${loading ? "opacity-0 scale-0" : "opacity-100 scale-100"}
          ${landscape ? "aspect-video" : "aspect-[9/16]"}`}
          onLoad={() => setLoading(false)}
        />
        {loading && <BiLoader className="mx-auto animate-spin size-20" />}
      </div>
      <div className="flex gap-1">
        <Button size={"sm"} asChild>
          <Link href={src} target="_blank">
            Buka di Tab baru
          </Link>
        </Button>
        <Button size={"sm"} onClick={handleDownload} disabled={isDownloading}>
          Unduh
        </Button>
      </div>
    </div>
  );
};

export default ShowFile;
