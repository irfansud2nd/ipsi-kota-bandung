"use client";
import { useState } from "react";
import { Button } from "./button";
import { Label } from "./label";
import { Skeleton } from "./skeleton";
import Link from "next/link";

type Props = {
  label: string;
  src: string;
  landscape?: boolean;
  newTab?: boolean;
  className?: string;
};

const ShowFile = ({ label, src, landscape, newTab, className }: Props) => {
  const [skeleton, setSkeleton] = useState(true);
  return (
    <div className={`flex flex-col gap-1 items-center w-fit ${className}`}>
      <Label>{label}</Label>
      <div
        className={`border rounded-md relative overflow-hidden
            ${landscape ? "aspect-video" : "aspect-[9/16]"}`}
      >
        <img
          src={src}
          className={`transition-all object-cover object-center
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
      {newTab && (
        <Button size={"sm"} asChild>
          <Link href={src} target="_blank">
            Open in New Tab
          </Link>
        </Button>
      )}
    </div>
  );
};

export default ShowFile;
