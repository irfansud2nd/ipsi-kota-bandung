import { Button } from "@/components/ui/button";
import Link from "next/link";
import PagePagination from "@/components/ui/PagePagination";
import AthleteTable from "@/components/admin/athlete/external/AthleteTable";
import { getAthletes } from "@/lib/athlete/external/athleteFunctions";

const page = async ({
  searchParams,
}: {
  searchParams: { page: string; showAll: string };
}) => {
  const page = Number(searchParams.page) || 1;
  const limit = 10;
  const showAll = searchParams.showAll == "true";

  const athletes = await getAthletes(page, limit, showAll);

  return (
    <div className="p-2">
      <h1 className="font-semibold text-3xl">Daftar Atlet</h1>
      <div className="bg-muted flex flex-col">
        <AthleteTable athletes={athletes} />
      </div>
      <div className="flex gap-1 flex-col sm:flex-row sm:justify-between items-center mt-1">
        <p>Menampilkan per {athletes.length} atlet</p>
        <Button asChild>
          <Link href={"athlete?showAll=true"}>Tampilkan Semua Atlet</Link>
        </Button>
        <PagePagination
          page={page}
          limit={limit}
          dataLength={athletes.length}
          link="athlete?"
          className="w-fit mx-0"
          disabled={showAll}
        />
      </div>
    </div>
  );
};
export default page;
