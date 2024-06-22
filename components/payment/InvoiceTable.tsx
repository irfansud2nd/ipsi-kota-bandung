"use client";

import { RootState } from "@/lib/redux/store";
import { useSelector } from "react-redux";
import { DataTable } from "../ui/DataTable";
import { InvoiceColumns } from "./InvoiceColumns";

const InvoiceTable = () => {
  const payments = useSelector((state: RootState) => state.payment.all);
  return <DataTable columns={InvoiceColumns()} data={payments} />;
};
export default InvoiceTable;
