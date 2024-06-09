"use client";
import { RootState } from "@/lib/redux/store";
import { useSelector } from "react-redux";
import { DataTable } from "../ui/DataTable";
import { PaymentColumns } from "./PaymentColumns";

const PaidTable = ({ confirmed }: { confirmed?: boolean }) => {
  const matchBaseds = useSelector(
    (state: RootState) => state.athlete.matchBased
  );
  const { unconfirmed: unconfirmedPayments, confirmed: confirmedPayments } =
    useSelector((state: RootState) => state.payment);

  const confirmedMatchBaseds = matchBaseds.filter((matchBased) =>
    confirmedPayments.find((payment) => payment.id == matchBased.payment_id)
  );
  const unconfirmedMatchBaseds = matchBaseds.filter((matchBased) =>
    unconfirmedPayments.find((payment) => payment.id == matchBased.payment_id)
  );

  return (
    <DataTable
      columns={PaymentColumns(true)}
      data={confirmed ? confirmedMatchBaseds : unconfirmedMatchBaseds}
    />
  );
};
export default PaidTable;
