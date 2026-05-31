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
import { Championship } from "@/lib/event/eventConstants";
import OptionButton from "@/components/ui/OptionButton";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";

export const AthleteColumns = (championshipId: string) => {
  const championship = getChampionship(championshipId) as Championship;

  let locked =
    Date.now() > championship.register.end &&
    Date.now() > championship.editLimit;

  if (locked && championship.privilegedEmail?.length) {
    const session = useSession();
    if (
      championship.privilegedEmail.includes(session.data?.user?.email as string)
    )
      locked = false;
  }

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
      accessorKey: "file_completeness",
      header: "Kelengkapan Berkas",
      cell: ({ row }) => {
        const isComplete =
          row.original.image.downloadUrl &&
          row.original.kk.downloadUrl &&
          row.original.id_card.downloadUrl;
        return (
          <Badge variant={isComplete ? "default" : "destructive"}>
            {!isComplete && "Tidak"} Lengkap
          </Badge>
        );
      },
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
          if (locked) return;
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
              <DropdownMenuTrigger>
                <OptionButton />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    if (locked) return;
                    dispatch(setAthleteToEditRedux(athlete));
                  }}
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  className={`text-destructive`}
                >
                  Hapus
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
    },
  ];

  if (locked) {
    columns = columns.filter((item) => item.id != "Aksi");
  }

  return columns;
};
