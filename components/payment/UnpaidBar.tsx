import { MatchBased } from "@/lib/athlete/external/athleteConstants";
import { getTotalMatchCost } from "@/lib/athlete/external/athleteFunctions";
import { formatToRupiah } from "@/lib/functions";
import { Row } from "@tanstack/react-table";
import PaymentForm from "./PaymentForm";

const UnpaidBar = (props: any) => {
  const { rows, selectedRows } = props as {
    rows: Row<MatchBased>[];
    selectedRows: Row<MatchBased>[];
  };
  let total = getTotalMatchCost(selectedRows.map((item) => item.original));
  return (
    <div className="flex justify-between items-center w-full mt-1">
      <p className="text-sm text-muted-foreground">
        {selectedRows.length}/{rows.length} terpilih.
      </p>
      <p className="text-lg">
        Total Biaya: <b>{formatToRupiah(total)}</b>
      </p>
      <PaymentForm
        selectedMatchBaseds={selectedRows.map((row) => row.original)}
      />
    </div>
  );
};
export default UnpaidBar;
