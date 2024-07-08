"use client";
import useConfirmation from "@/hooks/useConfirmation";
import { SpecialUser, SpecialUserRole } from "@/lib/admin/adminConstants";
import { deleteSpecialUser } from "@/lib/admin/adminFunctions";
import { useRouter } from "next/navigation";
import AdminManageButtons from "../AdminManageButtons";

const ManageSpecialUser = ({
  specialUser,
  role,
}: {
  specialUser: SpecialUser;
  role: SpecialUserRole;
}) => {
  const router = useRouter();
  const { confirm, ConfirmationDialog } = useConfirmation();

  const handleDelete = async () => {
    const result = await confirm("Hapus akun");
    if (result) {
      deleteSpecialUser(specialUser, role).then(() => router.refresh());
    }
  };
  return (
    <>
      <ConfirmationDialog />
      <AdminManageButtons handleDelete={handleDelete} />
    </>
  );
};
export default ManageSpecialUser;
