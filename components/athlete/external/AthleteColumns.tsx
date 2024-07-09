"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FiMoreHorizontal } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Athlete } from "@/lib/athlete/external/athleteConstants";
import TableSortButton from "@/components/ui/TableSortButton";
import { formatDate } from "@/lib/functions";
import useConfirmation from "@/hooks/useConfirmation";
import { getChampionship } from "@/lib/event/eventFunctions";
import {
  deleteAthleteRedux,
  setAthleteToEditRedux,
} from "@/lib/redux/championship/register/athleteSlice";
import { RootState } from "@/lib/redux/store";
import { deleteAthlete } from "@/lib/athlete/external/athleteFunctions";
import { apiProtect } from "@/lib/admin/adminActions";

export const AthleteColumns = (championshipId: string) => {
  const championship = getChampionship(championshipId);

  let columns: ColumnDef<Athlete>[] = [
    {
      header: "No",
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return <TableSortButton column={column} text="Nama" />;
      },
    },
    {
      accessorKey: "nik",
      header: "NIK",
    },
    {
      accessorKey: "gender",
      header: "Jenis Kelamin",
    },
    {
      accessorKey: "birth_date",
      header: "Tangga Lahir",
      cell: ({ row }) => (
        <div>{formatDate(row.original.birth_date, { withoutHour: true })}</div>
      ),
    },
    {
      accessorKey: "height",
      header: "Tinggi Badan",
      cell: ({ row }) => <div>{row.original.height} CM</div>,
    },
    {
      accessorKey: "weight",
      header: "Berat Badan",
      cell: ({ row }) => <div>{row.original.weight} KG</div>,
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => {
        return <TableSortButton column={column} text="Waktu Pendaftaran" />;
      },
      cell: ({ row }) => (
        <div>{formatDate(row.original.created_at, { withoutHour: true })}</div>
      ),
    },
    {
      header: "Aksi",
      id: "Aksi",
      cell: ({ row }) => {
        const athlete = row.original;
        const dispatch = useDispatch();
        const athleteAtEvents = useSelector(
          (state: RootState) => state.athlete.athleteAtEvents
        );
        const contingent = useSelector(
          (state: RootState) => state.contingent.unregistered
        );

        const getHisAthleteAtEvents = () => {
          return athleteAtEvents.filter(
            (athleteAtEvent) => athleteAtEvent.athlete_id == athlete.id
          );
        };

        const isAthletePaid = () => {
          const athleteAtEvents = getHisAthleteAtEvents();
          if (!athleteAtEvents.length) return false;
          const paid = athleteAtEvents.filter(
            (item) => item.payment_id != null && item.payment_id != ""
          );
          return paid.length > 0;
        };

        const { confirm, ConfirmationDialog } = useConfirmation();

        const handleDelete = async () => {
          const paid = isAthletePaid();
          const message = paid
            ? "Atlet yang sudah dibayar tidak dapat dihapus."
            : "Apakah anda yakin?";
          const options = paid
            ? { cancelLabel: "Baik", cancelOnly: true }
            : undefined;
          const result = await confirm("Hapus Atlet", { ...options, message });
          if (!result) return;
          try {
            await deleteAthlete(athlete);
          } catch (error) {}
          dispatch(deleteAthleteRedux(athlete));
        };

        return (
          <>
            <ConfirmationDialog />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <FiMoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => dispatch(setAthleteToEditRedux(athlete))}
                >
                  Edit
                </DropdownMenuItem>
                {!championship?.status.editOnly && (
                  <DropdownMenuItem
                    onClick={handleDelete}
                    className={`text-destructive`}
                  >
                    Hapus
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
    },
  ];

  if (Date.now() >= (championship?.register.end || 0)) {
    columns = columns.filter((item) => item.id !== "Aksi");
  }

  return columns;
};
