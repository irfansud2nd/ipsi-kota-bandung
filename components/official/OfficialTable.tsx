"use client";
import { DataTable } from "@/components/ui/DataTable";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { OfficialColumn } from "./OfficialColumns";

const OfficialTable = ({ championshipId }: { championshipId: string }) => {
  const officials = useSelector((state: RootState) => state.official.all);

  return (
    <DataTable columns={OfficialColumn(championshipId)} data={officials} />
  );
};
export default OfficialTable;
