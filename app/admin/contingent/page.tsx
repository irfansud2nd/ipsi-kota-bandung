import ContingentTable from "@/components/admin/contingent/ContingentTable";
import PagePagination from "@/components/ui/PagePagination";
import { Button } from "@/components/ui/button";
import { getContingents } from "@/lib/contingent/contingentActions";
import { Contingent } from "@/lib/contingent/contingentConstants";
import Link from "next/link";

const page = async ({
  searchParams,
}: {
  searchParams: { page: string; showAll: string };
}) => {
  const page = Number(searchParams.page) || 1;
  const limit = 10;
  const showAll = searchParams.showAll == "true";

  const contingents = await getContingents(page, limit, showAll);

  return (
    <div className="p-2">
      <h1 className="font-semibold text-3xl">Daftar Kontingen</h1>
      <div className="bg-muted flex flex-col">
        <ContingentTable contingents={contingents} />
      </div>
      <div className="flex gap-1 flex-col sm:flex-row sm:justify-between items-center mt-1">
        <p>Menampilkan per {contingents.length} kontingen</p>
        <Button asChild>
          <Link href={"contingent?showAll=true"}>
            Tampilkan Semua Kontingen
          </Link>
        </Button>
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
