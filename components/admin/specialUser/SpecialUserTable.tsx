"use client";
import { DataTable } from "@/components/ui/DataTable";
import { SpecialUser, SpecialUserRole } from "@/lib/admin/adminConstants";
import { SpecialUserColumns } from "./SpecialUserColumns";

type Props = { data: SpecialUser[]; role: SpecialUserRole };

const SpecialUserTable = ({ data, role }: Props) => {
  return <DataTable data={data} columns={SpecialUserColumns(role)} />;
};
export default SpecialUserTable;
