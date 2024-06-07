"use client";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Checkbox } from "../ui/checkbox";
import Link from "next/link";
import { getChampionship } from "@/lib/event/eventFunctions";
import { Championship } from "@/lib/event/eventConstants";
import Cookies from "js-cookie";

const HomeDialog = () => {
  return (
    <Dialog defaultOpen={Cookies.get("oOxS52zULHKFheIC") !== "hide"}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Informasi</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <p>Pendaftaran</p>
          <p>
            <b>"Bandung Open Pencak Silat Tournament 2024"</b>
          </p>
          <p>
            dibuka pada tanggal <b>10 Juni 2024</b>.
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
        <div className="flex items-baseline gap-1 justify-end">
          <Checkbox
            onCheckedChange={(value) =>
              value
                ? Cookies.set("oOxS52zULHKFheIC", "hide")
                : Cookies.remove("oOxS52zULHKFheIC")
            }
            className="translate-y-0.5"
          />
          <span>Jangan tampilkan ini lagi</span>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default HomeDialog;
