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
          {event.locationUrl ? (
            <Link
              href={event.locationUrl}
              className="hover:text-green- transition"
            >
              {event.locationName}
            </Link>
          ) : (
            event.locationName
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
            {formatDate(event.dateStart, {
              longMonth: true,
              withoutHour: true,
              withoutYear: event.dateEnd != 0,
            })}
            {event.dateEnd
              ? ` - ${formatDate(event.dateEnd, {
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
          {formatDate(event.timeStart, { hourOnly: true })}
          {event.timeEnd
            ? ` - ${formatDate(event.timeEnd, {
                hourOnly: true,
              })} WIB`
            : " WIB - selesai"}
        </div>
      );
    },
  },
  {
    accessorKey: "creatorName",
    header: "Penyelenggara",
  },
  {
    accessorKey: "creatorEmail",
    header: "Email Pembuat",
  },
  {
    accessorKey: "createdAt",
    header: "Waktu Pembuatan",
    cell: ({ row }) => <div>{formatDate(row.original.createdAt)}</div>,
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
