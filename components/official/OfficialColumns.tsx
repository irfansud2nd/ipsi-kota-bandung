import { Official } from "@/lib/official/officialContants";
import { ColumnDef } from "@tanstack/react-table";
import TableSortButton from "../ui/TableSortButton";
import { useDispatch } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useConfirmation from "@/hooks/useConfirmation";
import { deleteOfficial } from "@/lib/official/officialFuntions";
import {
  deleteOfficialRedux,
  setOfficialToEditRedux,
} from "@/lib/redux/championship/register/officialSlice";
import { Button } from "../ui/button";
import { FiMoreHorizontal } from "react-icons/fi";
import { getChampionship } from "@/lib/event/eventFunctions";

export const OfficialColumn = (championshipId: string) => {
  const championship = getChampionship(championshipId);

  let columns: ColumnDef<Official>[] = [
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
      accessorKey: "gender",
      header: "Jenis Kelamin",
    },
    {
      accessorKey: "position",
      header: "Jabatan",
    },
    {
      header: "Aksi",
      id: "Aksi",
      cell: ({ row }) => {
        const official = row.original;
        const dispatch = useDispatch();

        const { confirm, ConfirmationDialog } = useConfirmation();

        const handleDelete = async () => {
          const result = await confirm("Hapus Official");
          if (!result) return;
          await deleteOfficial(official);
          dispatch(deleteOfficialRedux(official));
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
                  onClick={() => dispatch(setOfficialToEditRedux(official))}
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

  return columns;
};
