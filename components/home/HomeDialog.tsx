"use client";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Checkbox } from "../ui/checkbox";
import Link from "next/link";
import { getChampionship } from "@/lib/event/eventFunctions";
import { Championship } from "@/lib/event/eventConstants";

const HomeDialog = () => {
  return (
    <Dialog defaultOpen={localStorage.getItem("oOxS52zULHKFheIC") !== "hide"}>
      <DialogContent className="w-fit">
        <DialogHeader>
          <DialogTitle>Informasi</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <p>
            Pendaftaran <b>"Bandung Open Pencak Silat Tournament 2024"</b> di
            buka pada tanggal <b>10 Juni 2024</b>.
          </p>
          <Button className="mx-auto" asChild>
            <Link
              href={
                (getChampionship("bandung-open-24") as Championship).proposal
              }
              target="_blank"
            >
              Download Proposal disini
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-1 justify-end">
          <Checkbox
            onCheckedChange={(value) =>
              value
                ? localStorage.setItem("oOxS52zULHKFheIC", "hide")
                : localStorage.removeItem("oOxS52zULHKFheIC")
            }
          />
          <span>Jangan tampilkan ini lagi</span>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default HomeDialog;
