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
import { deleteOfficial } from "@/lib/official/officialFunctions";
import {
  deleteOfficialRedux,
  setOfficialToEditRedux,
} from "@/lib/redux/championship/register/officialSlice";
import { Button } from "../ui/button";
import { FiMoreHorizontal } from "react-icons/fi";
import { getChampionship } from "@/lib/event/eventFunctions";
import { Championship } from "@/lib/event/eventConstants";
import OptionButton from "../ui/OptionButton";
import { useSession } from "next-auth/react";

export const OfficialColumn = (championshipId: string) => {
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
      accessorKey: "phone_number",
      header: "Nomor Telepon",
    },
    {
      header: "Aksi",
      id: "Aksi",
      cell: ({ row }) => {
        const official = row.original;
        const dispatch = useDispatch();

        const { confirm, ConfirmationDialog } = useConfirmation();

        const handleDelete = async () => {
          if (locked) return;
          const result = await confirm("Hapus Official");
          if (!result) return;
          await deleteOfficial(official);
          dispatch(deleteOfficialRedux(official));
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
                    dispatch(setOfficialToEditRedux(official));
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
