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
import { Athlete, MatchBased } from "@/lib/athlete/external/athleteConstants";
import TableSortButton from "@/components/ui/TableSortButton";
import useConfirmation from "@/hooks/useConfirmation";
import { getChampionship } from "@/lib/event/eventFunctions";
import {
  deleteAthleteAtEventRedux,
  setAthleteAtEventToEditRedux,
  setAthleteToEditRedux,
} from "@/lib/redux/championship/register/athleteSlice";
import {
  deleteAthleteAtEvent,
  matchBasedToAthleteAtEvent,
} from "@/lib/athlete/external/athleteFunctions";
import { RootState } from "@/lib/redux/store";
import { getContingentAtEventByChampionshipId } from "@/lib/contingent/contingentFunctions";
import { ContingentAtEvent } from "@/lib/contingent/contingentConstants";
import { addContingentAtEventsRedux } from "@/lib/redux/championship/register/contingentSlice";

export const RegisteredAthleteColumns = (
  championshipId: string,
  art?: boolean
) => {
  const championship = getChampionship(championshipId);

  let columns: ColumnDef<MatchBased>[] = [
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
      accessorKey: "match.schema",
      header: "Skema",
      cell: ({ row }) => <div>{row.original.schema}</div>,
    },
    {
      accessorKey: "match.level",
      header: "Tingkatan",
      cell: ({ row }) => <div>{row.original.level}</div>,
    },
    {
      accessorKey: "match.category",
      header: "Kategori",
      cell: ({ row }) => <div>{row.original.category}</div>,
    },
    {
      id: "team",
      accessorKey: "match.team",
      header: "Nama Tim",
      cell: ({ row }) => <div>{row.original.team}</div>,
    },
    {
      header: "Aksi",
      id: "Aksi",
      cell: ({ row }) => {
        const matchBased = row.original;

        const contingentAtEvents = useSelector(
          (state: RootState) => state.contingent.contingentAtEvents
        );
        const contingentAtEvent = getContingentAtEventByChampionshipId(
          contingentAtEvents,
          championshipId
        ) as ContingentAtEvent;

        const dispatch = useDispatch();
        const { confirm, ConfirmationDialog } = useConfirmation();

        const handleDelete = async (matchBased: MatchBased) => {
          const paid = matchBased.paymentId;
          const message = paid
            ? "Pertandingan yang sudah dibayar tidak dapat dihapus."
            : "Apakah anda yakin?";
          const options = paid
            ? { cancelLabel: "Baik", cancelOnly: true }
            : undefined;
          const result = await confirm("Hapus Pertandingan", {
            message,
            ...options,
          });
          result &&
            deleteAthleteAtEvent(matchBased, contingentAtEvent).then(
              (updatedContingentAtEvent) => {
                dispatch(
                  addContingentAtEventsRedux({
                    contingentAtEvents: [updatedContingentAtEvent],
                    championshipId,
                  })
                );
                dispatch(deleteAthleteAtEventRedux(matchBased));
              }
            );
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
                  onClick={() =>
                    dispatch(
                      setAthleteAtEventToEditRedux(
                        matchBasedToAthleteAtEvent(matchBased)
                      )
                    )
                  }
                >
                  Edit
                </DropdownMenuItem>
                {!championship?.status.editOnly && (
                  <DropdownMenuItem
                    onClick={() => handleDelete(matchBased)}
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

  if (!art) columns = columns.filter((item) => item.id !== "team");

  return columns;
};
