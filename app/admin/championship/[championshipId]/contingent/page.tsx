import { Button } from "@/components/ui/button";
import Link from "next/link";
import PagePagination from "@/components/ui/PagePagination";
import { getRegisteredContingentAdminsByChampionshipId } from "@/lib/contingent/contingentActions";
import RegisteredContingentAdminTable from "@/components/admin/contingent/RegisteredContingentAdminTable";
import { fetchData } from "@/lib/functions";
import TableDownloadButton from "@/components/admin/athlete/internal/attendance/TableDownloadButton";
import { getChampionship } from "@/lib/event/eventFunctions";
import ShowAllButton from "@/components/admin/ShowAllButton";
import RefreshButton from "@/components/ui/RefreshButton";

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

  const registeredContingentAdmins = await fetchData(() =>
    getRegisteredContingentAdminsByChampionshipId(
      params.championshipId,
      page,
      limit,
      showAll
    )
  );

  const championshipTitle = getChampionship(params.championshipId)?.title;

  return (
    <div className="p-2">
      <div className="flex justify-center items-center max-md:flex-wrap mb-1">
        <h1 className="font-semibold text-3xl mr-auto">
          Daftar Kontigen - {championshipTitle}
        </h1>
        <RefreshButton className="mr-1" />
        <TableDownloadButton
          fileName={`Daftar Kontigeng - ${championshipTitle}`}
          needShowAll
          isShowAll={showAll}
        />
      </div>
      <div className="bg-muted flex flex-col">
        <RegisteredContingentAdminTable
          registeredContingentAdmins={registeredContingentAdmins}
        />
      </div>
      <div className="flex gap-1 flex-col sm:flex-row sm:justify-between items-center mt-1">
        <p>Menampilkan per {registeredContingentAdmins.length} kontingen</p>
        <ShowAllButton href="contingent" showAll={showAll} />
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
