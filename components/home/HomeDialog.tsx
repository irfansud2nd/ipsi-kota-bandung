"use client";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Checkbox } from "../ui/checkbox";
import Link from "next/link";
import { getChampionship } from "@/lib/event/eventFunctions";
import { Championship } from "@/lib/event/eventConstants";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

const HomeDialog = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (Cookies.get("oOxS52zULHKFheIC") !== "hide") setOpen(true);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex flex-col gap-2">
        <h1 className="text-center font-semibold text-lg">Informasi</h1>
        <p>Pendaftaran</p>
        <p>
          <b>"Bandung Open Pencak Silat Tournament 2024"</b>
        </p>
        <p>
          dibuka pada tanggal
          <b> 10 Juni 2024</b>.
        </p>
        <Button className="mx-auto" asChild>
          <Link
            href={(getChampionship("bandung-open-24") as Championship).proposal}
            target="_blank"
          >
            Download Proposal disini
          </Link>
        </Button>
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
