import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Event } from "@/lib/event/eventConstants";
import { formatDate } from "@/lib/functions";
import Link from "next/link";
import ManageEvent from "./ManageEvent";

const EventTable = ({ events }: { events: Event[] }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No</TableHead>
          <TableHead>Judul Event</TableHead>
          <TableHead>Lokasi</TableHead>
          <TableHead>Tanggal</TableHead>
          <TableHead>Waktu</TableHead>
          <TableHead>Penyelenggara</TableHead>
          <TableHead>Email Pembuat</TableHead>
          <TableHead>Waktu Pembuatan</TableHead>
          <TableHead>Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((event, i) => (
          <TableRow key={event.id}>
            <TableCell>{i + 1}</TableCell>
            <TableCell>{event.title}</TableCell>
            <TableCell>
              {event.location_url ? (
                <Link
                  href={event.location_url}
                  className="hover:text-green- transition"
                >
                  {event.location_name}
                </Link>
              ) : (
                event.location_name
              )}
            </TableCell>
            <TableCell>
              <p className="whitespace-nowrap">
                {formatDate(event.date_start, {
                  longMonth: true,
                  withoutHour: true,
                  withoutYear: event.date_end != 0,
                })}
                {event.date_end
                  ? ` - ${formatDate(event.date_end, {
                      longMonth: true,
                      withoutHour: true,
                    })}`
                  : null}
              </p>
            </TableCell>
            <TableCell>
              {formatDate(event.time_start, { hourOnly: true })}
              {event.time_end
                ? ` - ${formatDate(event.time_end, {
                    hourOnly: true,
                  })} WIB`
                : " WIB - selesai"}
            </TableCell>
            <TableCell>{event.organizer}</TableCell>
            <TableCell>{event.created_by}</TableCell>
            <TableCell>{formatDate(event.created_at)}</TableCell>
            <TableCell>
              <ManageEvent event={event} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
export default EventTable;
