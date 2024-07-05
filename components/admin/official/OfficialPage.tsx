import { Button } from "@/components/ui/button";
import Link from "next/link";
import PagePagination from "@/components/ui/PagePagination";
import OfficialTable from "@/components/admin/official/OfficialTable";
import { getOfficials } from "@/lib/official/officialFunctions";
import TableDownloadButton from "../athlete/internal/attendance/TableDownloadButton";
import ShowAllButton from "../ShowAllButton";

type Props = {
  page: number;
  limit: number;
  showAll: boolean;
};

const OfficialPage = async ({ page, limit, showAll }: Props) => {
  const officials = await getOfficials(page, limit, showAll);

  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-1">
        <h1 className="font-semibold text-3xl">Daftar Official</h1>
        <TableDownloadButton
          fileName="Daftar Official"
          needShowAll
          isShowAll={showAll}
        />
      </div>
      <div className="bg-muted flex flex-col">
        <OfficialTable officials={officials} />
      </div>
      <div className="flex gap-1 flex-col sm:flex-row sm:justify-between items-center mt-1">
        <p>Menampilkan per {officials.length} official</p>
        <ShowAllButton href="official" showAll={showAll} />
        <PagePagination
          page={page}
          limit={limit}
          dataLength={officials.length}
          link="official?"
          className="w-fit mx-0"
          disabled={showAll}
        />
      </div>
    </div>
  );
};
export default OfficialPage;
