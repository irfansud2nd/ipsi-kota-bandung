"use client";
import { getChampionship } from "@/lib/event/eventFunctions";
import { Button } from "../ui/button";
import Link from "next/link";
import ContingentForm from "./ContingentForm";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";

const ContingentNotFound = ({ championshipId }: { championshipId: string }) => {
  const championship = getChampionship(championshipId);
  const disableRegister = championship?.status.editOnly;
  const unregisteredContingent = useSelector(
    (state: RootState) => state.contingent.unregistered
  );

  if (unregisteredContingent) return null;

  return (
    <div className="h-full w-full flex justify-center items-center text-center">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold">
          Tidak ada kontingen terdaftar
        </h1>
        <p className="text-muted-foreground">
          {disableRegister
            ? "Maaf, pendaftaran telah ditutup"
            : "Daftarkan kontingen terlebih dahulu untuk melanjutkan"}
        </p>
        {disableRegister ? (
          <Button asChild>
            <Link href={"/"}>Kembali ke halaman awal</Link>
          </Button>
        ) : (
          <ContingentForm championshipId={championshipId} />
        )}
      </div>
    </div>
  );
};

export default ContingentNotFound;
