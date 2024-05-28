import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AttendanceBadge from "./AttendanceBadge";
import { getDaysInMonth } from "@/lib/athlete/internal/internalAthleteFunctions";
import TableDownloadButton from "./TableDownloadButton";
import AttendanceEditor from "./AttendanceEditor";
import {
  AttendanceReport,
  InternalAthleteRole,
} from "@/lib/athlete/internal/internalAthleteConstants";

type Props = {
  data: AttendanceReport[];
  month: string;
  role: InternalAthleteRole;
};

const AttendanceTable = ({ data, month, role }: Props) => {
  const days = getDaysInMonth(month);

  return (
    <div className="max-w-full overflow-x-auto">
      <Table className="mt-2 border-2" id="table">
        <TableHeader>
          <TableRow>
            <TableHead className="border-r sticky left-0 bg-white">
              Nama
            </TableHead>
            {days.map((day) => (
              <TableHead className="border-r" key={day}>
                {day}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.email}>
              <TableCell className="sticky left-0 bg-white">
                {item.name}
              </TableCell>
              {days.map((day) => (
                <AttendanceBadge
                  key={day}
                  type={
                    item.attendances.find(
                      (attendance) => new Date(attendance.date).getDate() == day
                    )?.type
                  }
                />
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex gap-2 items-center mt-2">
        <AttendanceEditor month={month} data={data} role={role} />
        <TableDownloadButton
          fileName={`Rekap Absen ${month.split("-").reverse().join("-")}`}
        />
      </div>
    </div>
  );
};
export default AttendanceTable;
