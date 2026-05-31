"use client";
import { DataTable } from "@/components/ui/DataTable";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { OfficialColumn } from "./OfficialColumns";

const OfficialTable = ({ championshipId }: { championshipId: string }) => {
  const officials = useSelector((state: RootState) => state.official.all);

  return (
    <DataTable
      columns={OfficialColumn(championshipId)}
      data={officials}
      getRowClassName={(row) => {
        const isComplete = row.image.downloadUrl;

        return !isComplete ? "bg-destructive/20 hover:bg-destructive/40" : "";
      }}
    />
  );
};
export default OfficialTable;
