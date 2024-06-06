"use client";
import { DataTable } from "@/components/ui/DataTable";
import { AthletColumns } from "./AthleteColumns";
import { Athlete } from "@/lib/athlete/external/athleteConstants";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";

type Props = {
  registered?: boolean;
  championshipId: string;
};

const AthleteTable = ({ registered, championshipId }: Props) => {
  const { all, registered: registeredAthletes } = useSelector(
    (state: RootState) => state.athlete
  );

  const athletes: Athlete[] = registered ? registeredAthletes : all;
  return (
    <div>
      <p className="text-muted-foreground">
        {registered
          ? "atlet yang telah mendaftarkan pertandingan di event ini"
          : "atlet yang tergabung di kontingen anda"}
      </p>
      <DataTable columns={AthletColumns(championshipId)} data={athletes} />
    </div>
  );
};
export default AthleteTable;
