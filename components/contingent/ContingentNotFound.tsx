"use client";
import { getChampionship } from "@/lib/event/eventFunctions";
import { Button } from "../ui/button";
import Link from "next/link";
import ContingentForm from "./ContingentForm";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { Championship } from "@/lib/event/eventConstants";
import { useSession } from "next-auth/react";

const ContingentNotFound = ({ championshipId }: { championshipId: string }) => {
  const championship = getChampionship(championshipId) as Championship;
  const unregisteredContingent = useSelector(
    (state: RootState) => state.contingent.unregistered
  );

  let disableAdd = Date.now() > championship.register.end;

  if (disableAdd && championship.privilegedEmail?.length) {
    const session = useSession();
    if (
      championship.privilegedEmail.includes(session.data?.user?.email as string)
    ) {
      disableAdd = false;
    }
  }

  if (unregisteredContingent) return null;

  return (
    <div className="h-full w-full flex justify-center items-center text-center">
      <div className="flex flex-col gap-1 items-center">
        <h1 className="text-3xl font-semibold">
          {disableAdd
            ? "Maaf, pendaftaran telah ditutup"
            : "Daftarkan kontingen terlebih dahulu untuk melanjutkan"}
        </h1>
        {disableAdd ? (
          <Button asChild className="w-fit">
            <Link href={"/"}>Kembali ke halaman awal</Link>
          </Button>
        ) : (
          <ContingentForm championshipId={championshipId} locked={disableAdd} />
        )}
      </div>
    </div>
  );
};

export default ContingentNotFound;
