import PagePagination from "@/components/ui/PagePagination";
import AthleteTable from "@/components/admin/athlete/external/AthleteTable";
import { getUnregisteredAthletes } from "@/lib/athlete/external/athleteFunctions";
import TableDownloadButton from "@/components/admin/athlete/internal/attendance/TableDownloadButton";
import ShowAllButton from "@/components/admin/ShowAllButton";

const page = async ({
  searchParams,
}: {
  searchParams: { page: string; showAll: string };
}) => {
  const page = Number(searchParams.page) || 1;
  const limit = 10;
  const showAll = searchParams.showAll == "true";

  const athletes = await getUnregisteredAthletes(page, limit, showAll);

  return (
    <div className="p-2">
      <div className="flex items-center justify-between max-md:flex-wrap mb-1">
        <h1 className="font-semibold text-3xl">
          Daftar Atlet Tanpa Pertandingan
        </h1>
        <TableDownloadButton
          fileName="Daftar Atlet Tanpa Pertandingan"
          needShowAll
          isShowAll={showAll}
        />
      </div>
      <div className="bg-muted flex flex-col">
        <AthleteTable athletes={athletes} />
      </div>
      <div className="flex gap-1 flex-col sm:flex-row sm:justify-between items-center mt-1">
        <p>Menampilkan per {athletes.length} atlet</p>
        <ShowAllButton href="unregistered" showAll={showAll} />
        <PagePagination
          page={page}
          limit={limit}
          dataLength={athletes.length}
          link="unregistered?"
          className="w-fit mx-0"
          disabled={showAll}
        />
      </div>
    </div>
  );
};
export default page;
