import { Button } from "@/components/ui/button";
import Link from "next/link";
import PagePagination from "@/components/ui/PagePagination";
import { getRegisteredContingents } from "@/lib/contingent/contingentActions";
import RegisteredContingentAdminTable from "@/components/admin/contingent/RegisteredContingentAdminTable";

const page = async ({
  params,
  searchParams,
}: {
  params: { championshipId: string };
  searchParams: { page: string; showAll: string };
}) => {
  const page = Number(searchParams.page) || 1;
  const limit = 10;
  const showAll = searchParams.showAll == "true";

  const registeredContingentAdmins = await getRegisteredContingents(
    params.championshipId,
    page,
    limit,
    showAll
  );

  return (
    <div className="p-2">
      <h1 className="font-semibold text-3xl">Daftar Kontingen</h1>
      <div className="bg-muted flex flex-col">
        <RegisteredContingentAdminTable
          registeredContingentAdmins={registeredContingentAdmins}
        />
      </div>
      <div className="flex gap-1 flex-col sm:flex-row sm:justify-between items-center mt-1">
        <p>Menampilkan per {registeredContingentAdmins.length} kontingen</p>
        <Button asChild>
          <Link href={"contingent?showAll=true"}>
            Tampilkan Semua Kontingen
          </Link>
        </Button>
        <PagePagination
          page={page}
          limit={limit}
          dataLength={registeredContingentAdmins.length}
          link="contingent?"
          className="w-fit mx-0"
          disabled={showAll}
        />
      </div>
    </div>
  );
};
export default page;
