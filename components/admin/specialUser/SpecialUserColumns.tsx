"use client";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import useConfirmation from "@/hooks/useConfirmation";
import { SpecialUser, SpecialUserRole } from "@/lib/admin/adminConstants";
import { deleteSpecialUser } from "@/lib/admin/adminFunctions";
import AdminManageButtons from "../AdminManageButtons";

export const SpecialUserColumns = (role: SpecialUserRole) => {
  let columns: ColumnDef<SpecialUser>[] = [
    {
      accessorKey: "name",
      header: "Nama",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      header: "Aksi",
      cell: ({ row }) => {
        const router = useRouter();
        const { confirm, ConfirmationDialog } = useConfirmation();

        const handleDelete = async () => {
          const result = await confirm("Hapus akun");
          if (result) {
            deleteSpecialUser(row.original, role).then(() => router.refresh());
          }
        };
        return (
          <>
            <ConfirmationDialog />
            <AdminManageButtons handleDelete={handleDelete} />
          </>
        );
      },
    },
  ];
  return columns;
};
