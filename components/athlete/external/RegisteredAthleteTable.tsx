"use client";
import { DataTable } from "@/components/ui/DataTable";
import { matchType } from "@/lib/athlete/external/athleteConstants";
import { RootState } from "@/lib/redux/store";
import { useSelector } from "react-redux";
import { RegisteredAthleteColumns } from "./RegisteredAthleteColumns";

type Props = {
  championshipId: string;
  art?: boolean;
};

const RegisteredAthleteTable = ({ championshipId, art }: Props) => {
  const { matchBased } = useSelector((state: RootState) => state.athlete);

  const data = matchBased.filter((item) => item.type == matchType[art ? 1 : 0]);

  return (
    <DataTable
      columns={RegisteredAthleteColumns(championshipId, art)}
      data={data}
    />
  );
};
export default RegisteredAthleteTable;
