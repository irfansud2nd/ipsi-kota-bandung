import { Button } from "@/components/ui/button";
import Link from "next/link";
import PagePagination from "@/components/ui/PagePagination";
import MatchBasedTable from "@/components/admin/athlete/external/MatchBasedTable";
import { getMatchBaseds } from "@/lib/athlete/external/athleteActions";
import { fetchData } from "@/lib/functions";
import TableDownloadButton from "@/components/admin/athlete/internal/attendance/TableDownloadButton";
import { getChampionship } from "@/lib/event/eventFunctions";
import ShowAllButton from "@/components/admin/ShowAllButton";

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

  const matchBaseds = await fetchData(() =>
    getMatchBaseds(params.championshipId, page, limit, showAll)
  );

  const championshipTitle = getChampionship(params.championshipId)?.title;

  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-1">
        <h1 className="font-semibold text-3xl">
          Daftar Atlet - {championshipTitle}
        </h1>
        <TableDownloadButton
          fileName={`Daftar Atlet - ${championshipTitle}`}
          needShowAll
          isShowAll={showAll}
        />
      </div>
      <div className="bg-muted flex flex-col">
        <MatchBasedTable matchBaseds={matchBaseds} />
      </div>
      <div className="flex gap-1 flex-col sm:flex-row sm:justify-between items-center mt-1">
        <p>Menampilkan per {matchBaseds.length} atlet</p>
        <ShowAllButton href="athlete" showAll={showAll} />
        <PagePagination
          page={page}
          limit={limit}
          dataLength={matchBaseds.length}
          link="athlete?"
          className="w-fit mx-0"
          disabled={showAll}
        />
      </div>
    </div>
  );
};
export default page;
