import { TableCell } from "@/components/ui/table";
import { AttendanceType } from "@/lib/athlete/internal/internalAthleteConstants";
import { getAttendanceLabel } from "@/lib/athlete/internal/internalAthleteFunctions";

type Props = {
  type: AttendanceType | undefined;
  asSpan?: boolean;
  asSelect?: boolean;
};

const AttendanceBadge = ({ type, asSpan, asSelect }: Props) => {
  let className = "bg-muted";

  switch (type) {
    case "present":
      className = "bg-green-400";
      break;
    case "negligent":
      className = "bg-red-400";
      break;
    case "leave":
      className = "bg-yellow-400";
      break;
    case "sick":
      className = "bg-blue-400";
      break;
  }

  return (
    <TableCell className={`${className} border-r font-semibold text-center`}>
      {getAttendanceLabel(type ?? "").charAt(0)}
    </TableCell>
  );
};
export default AttendanceBadge;
