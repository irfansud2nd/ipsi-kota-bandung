import SpecialUserForm from "@/components/admin/specialUser/SpecialUserForm";
import SpecialUserTable from "@/components/admin/specialUser/SpecialUserTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { getSpecialUsers } from "@/lib/admin/adminActions";
import { SpecialUserRole } from "@/lib/admin/adminConstants";
import { isSpecialRole } from "@/lib/admin/adminFunctions";
import { getSpecialUserLabel } from "@/lib/functions";
import { notFound } from "next/navigation";

const page = async ({ params }: { params: { role: string } }) => {
  const role = params.role as SpecialUserRole;
  if (!isSpecialRole(role)) return notFound();
  const data = await getSpecialUsers(role, 1, 6);

  return (
    <div className="p-2">
      <div className="flex items-center mb-2">
        <h1 className="text-2xl font-bold capitalize">
          Kelola {getSpecialUserLabel(role)}
        </h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="ml-auto">Tambah atlet</Button>
          </DialogTrigger>
          <DialogContent className="w-fit">
            <SpecialUserForm role={role} />
          </DialogContent>
        </Dialog>
      </div>
      <SpecialUserTable data={data} role={role} />
    </div>
  );
};
export default page;
