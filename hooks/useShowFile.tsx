"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

type Props = {
  label: string;
  src: string;
  landscape?: boolean;
  newTab?: boolean;
};

const ShowFile = ({ label, src, landscape, newTab }: Props) => {
  const [skeleton, setSkeleton] = useState(true);
  return (
    <div className="flex flex-col gap-1 items-center w-fit">
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
        <Button size={"sm"}>
          <link href={src}>Open in New Tab</link>
        </Button>
      )}
    </div>
  );
};

const useShowFileDialog = () => {
  const [open, setOpen] = useState(false);
  const [src, setSrc] = useState("");
  const [title, setTitle] = useState("");
  const [landscape, setLandscape] = useState(false);
  const [resolveCallback, setResolveCallback] = useState<any>(null);

  const showFile = (title: string, src: string, landscape: boolean = false) => {
    setSrc(src);
    setTitle(title);
    setLandscape(landscape);
    setOpen(true);
    return new Promise((resolve) => {
      setResolveCallback(() => resolve);
    });
  };

  const handleConfirm = (result: boolean) => {
    resolveCallback(result);
    setOpen(false);
  };

  const handleOpenChange = (state: boolean) => {
    setOpen(state);
    if (!state) handleConfirm(false);
  };

  const ShowFileDialog = () => (
    <Dialog open={open} onOpenChange={(state) => handleOpenChange(state)}>
      <DialogContent className="w-fit">
        <ShowFile label={title} src={src} landscape={landscape} />
      </DialogContent>
    </Dialog>
  );

  return {
    showFile,
    ShowFileDialog,
  };
};
export default useShowFileDialog;
