"use client";
import { DataTable } from "@/components/ui/DataTable";
import { matchType } from "@/lib/athlete/external/athleteConstants";
import { RootState } from "@/lib/redux/store";
import { useSelector } from "react-redux";
import { MatchBasedColumns } from "./MatchBasedColumns";

type Props = {
  championshipId: string;
  art?: boolean;
};

const MatchBasedTable = ({ championshipId, art }: Props) => {
  const { matchBased } = useSelector((state: RootState) => state.athlete);

  const data = matchBased.filter((item) => item.type == matchType[art ? 1 : 0]);

  return (
    <DataTable columns={MatchBasedColumns(championshipId, art)} data={data} />
  );
};
export default MatchBasedTable;
