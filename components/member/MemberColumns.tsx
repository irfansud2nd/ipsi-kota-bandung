"use client";
import { formatDate } from "@/lib/functions";
import { ColumnDef } from "@tanstack/react-table";
import useConfirmation from "@/hooks/useConfirmation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Member } from "@/lib/member/memberConstants";
import AdminManageButtons, {
  EditButton,
  ShowButton,
} from "../admin/AdminManageButtons";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import MemberCard from "./MemberCard";
import MemberForm from "./MemberForm";
import { Button } from "../ui/button";

export const MemberColumns: ColumnDef<Member>[] = [
  {
    accessorKey: "name",
    header: "Nama",
  },
  {
    accessorKey: "position",
    header: "Jabatan",
  },
  {
    header: "Aksi",
    cell: ({ row, table }) => {
      const router = useRouter();
      const member = row.original;
      const rowsLength = table.getRowCount();
      const currentId = row.id;

      const { confirm, ConfirmationDialog } = useConfirmation();

      const handleDelete = async () => {
        const result = await confirm("Hapus event");
        if (result) {
          // DELETE EMPLOYEE
        }
      };
      return (
        <>
          <ConfirmationDialog />
          <Button onClick={() => {}}>ADD BELOW</Button>
          <Button onClick={() => {}}>ADD ABOVE</Button>
          <AdminManageButtons
            show={{
              label: "Preview",
              component: <MemberCard member={member} className="w-[250px]" />,
            }}
            edit={{
              component: <MemberForm memberToEdit={member} noDialog />,
            }}
            handleDelete={handleDelete}
          />
        </>
      );
    },
  },
];
