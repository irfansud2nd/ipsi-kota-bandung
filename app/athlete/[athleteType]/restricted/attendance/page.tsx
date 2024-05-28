import AttendanceScanner from "@/components/athlete/internal/attendance/AttendanceScanner";
import { InternalAthleteRole } from "@/lib/athlete/internal/internalAthleteConstants";
import { isInternalAthleteRole } from "@/lib/athlete/internal/internalAthleteFunctions";
import { getSpecialUserLabel } from "@/lib/functions";
import { notFound } from "next/navigation";

const page = ({ params }: { params: { athleteType: InternalAthleteRole } }) => {
  const { athleteType } = params;
  if (!isInternalAthleteRole(athleteType)) return notFound();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">
        Absen {getSpecialUserLabel(athleteType)}
      </h1>
      <AttendanceScanner athleteType={athleteType} />
    </div>
  );
};
export default page;
