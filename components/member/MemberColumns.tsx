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
    cell: ({ row }) => {
      const router = useRouter();
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
          <AdminManageButtons
            show={{
              label: "Preview",
              component: (
                <MemberCard member={row.original} className="w-[250px]" />
              ),
            }}
            edit={{
              component: <MemberForm memberToEdit={row.original} noDialog />,
            }}
            handleDelete={handleDelete}
          />
        </>
      );
    },
  },
];
