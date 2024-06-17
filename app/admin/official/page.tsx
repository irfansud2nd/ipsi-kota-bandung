import { Button } from "@/components/ui/button";
import Link from "next/link";
import PagePagination from "@/components/ui/PagePagination";
import { getOfficials } from "@/lib/official/officialActions";
import OfficialTable from "@/components/admin/official/OfficialTable";

const page = async ({
  searchParams,
}: {
  searchParams: { page: string; showAll: string };
}) => {
  const page = Number(searchParams.page) || 1;
  const limit = 10;
  const showAll = searchParams.showAll == "true";

  const officials = await getOfficials(page, limit, showAll);

  return (
    <div className="p-2">
      <h1 className="font-semibold text-3xl">Daftar Atlet</h1>
      <div className="bg-muted flex flex-col">
        <OfficialTable officials={officials} />
      </div>
      <div className="flex gap-1 flex-col sm:flex-row sm:justify-between items-center mt-1">
        <p>Menampilkan per {officials.length} atlet</p>
        <Button asChild>
          <Link href={"official?showAll=true"}>Tampilkan Semua Atlet</Link>
        </Button>
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
export default page;
