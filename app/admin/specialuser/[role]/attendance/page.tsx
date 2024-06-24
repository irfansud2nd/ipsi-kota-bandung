import AttendanceBarcode from "@/components/admin/athlete/internal/attendance/AttendanceBarcode";
import AttendanceMonthPicker from "@/components/admin/athlete/internal/attendance/AttendanceMonthPicker";
import AttendanceTable from "@/components/admin/athlete/internal/attendance/AttendanceTable";
import { getAttendances } from "@/lib/athlete/internal/internalAthleteActions";
import { InternalAthleteRole } from "@/lib/athlete/internal/internalAthleteConstants";
import { isInternalAthleteRole } from "@/lib/athlete/internal/internalAthleteFunctions";
import { getSpecialUserLabel } from "@/lib/functions";
import { notFound } from "next/navigation";

const page = async ({
  params,
  searchParams,
}: {
  params: { role: InternalAthleteRole };
  searchParams: { month: string };
}) => {
  const { role } = params;
  const { month } = searchParams;
  if (!isInternalAthleteRole(role)) return notFound();

  const data = month ? await getAttendances(role, month) : [];

  return (
    <div className="p-2">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">
          Kehadiran {getSpecialUserLabel(role)}
        </h1>
        <AttendanceMonthPicker month={month} />
        <AttendanceBarcode athleteType={role} />
      </div>
      {month ? (
        data.length ? (
          <AttendanceTable data={data} month={month} role={role} />
        ) : (
          <p>Belum ada data</p>
        )
      ) : (
        <p>Pilih bulan terlebih dahulu untuk menampilkan rekap</p>
      )}
    </div>
  );
};
export default page;
