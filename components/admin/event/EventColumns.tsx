"use client";
import { Event } from "@/lib/event/eventConstants";
import { formatDate } from "@/lib/functions";
import { ColumnDef } from "@tanstack/react-table";
import useConfirmation from "@/hooks/useConfirmation";
import { useRouter } from "next/navigation";
import AdminManageButtons from "../AdminManageButtons";
import { deleteEvent } from "@/lib/event/eventFunctions";
import Link from "next/link";

export const EventColumns: ColumnDef<Event>[] = [
  {
    accessorKey: "title",
    header: "Judul Event",
  },
  {
    accessorKey: "location",
    header: "Lokasi",
    cell: ({ row }) => {
      const event = row.original;

      return (
        <div>
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
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Tanggal",
    cell: ({ row }) => {
      const event = row.original;
      return (
        <div>
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
        </div>
      );
    },
  },
  {
    accessorKey: "time",
    header: "Waktu",
    cell: ({ row }) => {
      const event = row.original;
      return (
        <div>
          {formatDate(event.time_start, { hourOnly: true })}
          {event.time_end
            ? ` - ${formatDate(event.time_end, {
                hourOnly: true,
              })} WIB`
            : " WIB - selesai"}
        </div>
      );
    },
  },
  {
    accessorKey: "organizer",
    header: "Penyelenggara",
  },
  {
    accessorKey: "created_by",
    header: "Email Pembuat",
  },
  {
    accessorKey: "created_at",
    header: "Waktu Pembuatan",
    cell: ({ row }) => <div>{formatDate(row.original.created_at)}</div>,
  },
  {
    header: "Aksi",
    cell: ({ row }) => {
      const router = useRouter();
      const { confirm, ConfirmationDialog } = useConfirmation();

      const handleDelete = async () => {
        const result = await confirm("Hapus event");
        if (result) {
          deleteEvent(row.original).then((res) => router.refresh());
        }
      };
      return (
        <>
          <ConfirmationDialog />
          <AdminManageButtons
            show={{
              label: "Lihat Event",
              url: `/event/${row.original.id}?title=${row.original.title}`,
            }}
            edit={{
              url: `/admin/event/edit?id=${row.original.id}`,
            }}
            handleDelete={handleDelete}
          />
        </>
      );
    },
  },
];
