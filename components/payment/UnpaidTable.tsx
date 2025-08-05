"use client";

import { getChampionship } from "@/lib/event/eventFunctions";
import { RootState } from "@/lib/redux/store";
import { useSelector } from "react-redux";
import { SelectableTable } from "../ui/SelectableTable";
import { PaymentColumns } from "./PaymentColumns";
import UnpaidBar from "./UnpaidBar";
import { Championship } from "@/lib/event/eventConstants";
import { useSession } from "next-auth/react";

const UnpaidTable = ({ championshipId }: { championshipId: string }) => {
  const matchBased = useSelector(
    (state: RootState) => state.athlete.matchBased
  );

  const championship = getChampionship(championshipId) as Championship;
  let closePayment = Date.now() > championship.payment.closedAt;

  if (closePayment && championship.privilegedEmail?.length) {
    const session = useSession();
    if (
      championship.privilegedEmail.includes(session.data?.user?.email as string)
    ) {
      closePayment = false;
    }
  }

  let unpaidMatchBaseds = matchBased.filter((item) => !item.payment_id);
  return (
    <SelectableTable
      columns={PaymentColumns(false, closePayment)}
      data={unpaidMatchBaseds}
    >
      {closePayment ? (
        <p className="w-full text-center text-destructive font-semibold text-lg">
          Pembayaran telah ditutup
        </p>
      ) : (
        <UnpaidBar />
      )}
    </SelectableTable>
  );
};
export default UnpaidTable;
