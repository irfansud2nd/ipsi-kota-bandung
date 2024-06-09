"use client";

import { getChampionship } from "@/lib/event/eventFunctions";
import { RootState } from "@/lib/redux/store";
import { useSelector } from "react-redux";
import { SelectableTable } from "../ui/SelectableTable";
import { PaymentColumns } from "./PaymentColumns";
import UnpaidBar from "./UnpaidBar";

const UnpaidTable = ({ championshipId }: { championshipId: string }) => {
  const matchBased = useSelector(
    (state: RootState) => state.athlete.matchBased
  );
  const isClosed = getChampionship(championshipId)?.payment.closed;
  let unpaidMatchBaseds = matchBased.filter((item) => !item.payment_id);
  return (
    <SelectableTable
      columns={PaymentColumns(false, isClosed)}
      data={unpaidMatchBaseds}
    >
      {isClosed ? (
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
