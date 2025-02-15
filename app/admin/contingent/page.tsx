import ShowAllButton from "@/components/admin/ShowAllButton";
import TableDownloadButton from "@/components/admin/athlete/internal/attendance/TableDownloadButton";
import ContingentTable from "@/components/admin/contingent/ContingentTable";
import PagePagination from "@/components/ui/PagePagination";
import { getContingents } from "@/lib/contingent/contingentActions";
import { fetchData } from "@/lib/functions";

const page = async ({
  searchParams,
}: {
  searchParams: { page: string; showAll: string };
}) => {
  const page = Number(searchParams.page) || 1;
  const limit = 10;
  const showAll = searchParams.showAll == "true";

  const contingents = await fetchData(() =>
    getContingents(page, limit, showAll)
  );

  return (
    <div className="p-2">
      <div className="flex items-center justify-between max-md:flex-wrap mb-1">
        <h1 className="font-semibold text-3xl">Daftar Semua Kontingen</h1>
        <TableDownloadButton
          fileName="Daftar Semua Kontingen"
          needShowAll
          isShowAll={showAll}
        />
      </div>
      <div className="bg-muted flex flex-col">
        <ContingentTable contingents={contingents} />
      </div>
      <div className="flex gap-1 flex-col sm:flex-row sm:justify-between items-center mt-1">
        <p>Menampilkan per {contingents.length} kontingen</p>
        <ShowAllButton href="contingent" showAll={showAll} />
        <PagePagination
          page={page}
          limit={limit}
          dataLength={contingents.length}
          link="contingent?"
          className="w-fit mx-0"
          disabled={showAll}
        />
      </div>
    </div>
  );
};
export default page;
