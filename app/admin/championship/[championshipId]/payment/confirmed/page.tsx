import ShowAllButton from "@/components/admin/ShowAllButton";
import TableDownloadButton from "@/components/admin/athlete/internal/attendance/TableDownloadButton";
import PaymentTable from "@/components/admin/payment/PaymentTable";
import PagePagination from "@/components/ui/PagePagination";
import RefreshButton from "@/components/ui/RefreshButton";
import { Button } from "@/components/ui/button";
import { getChampionship } from "@/lib/event/eventFunctions";
import { fetchData } from "@/lib/functions";
import { getConfirmedPaymentByChampionshipId } from "@/lib/payment/paymentActions";
import Link from "next/link";

const page = async ({
  params,
  searchParams,
}: {
  params: { championshipId: string };
  searchParams: { page: string; showAll: string };
}) => {
  const page = Number(searchParams.page) || 1;
  const limit = 5;
  const showAll = searchParams.showAll == "true";

  const confirmedPayments = await fetchData(() =>
    getConfirmedPaymentByChampionshipId(params.championshipId, page, limit)
  );

  const championshipTitle = getChampionship(params.championshipId)?.title;

  return (
    <div className="p-2">
      <div className="flex gap-1 items-center justify-between flex-wrap">
        <div className="flex justify-between items-center mb-1">
          <h1 className="font-semibold text-3xl">
            Daftar Pembayaran Terkonfirmasi - {championshipTitle}
          </h1>
          <TableDownloadButton
            fileName={`Daftar Pembayaran Terkonfirmasi - ${championshipTitle}`}
            needShowAll
            isShowAll={showAll}
          />
        </div>
        <RefreshButton />
      </div>
      <div className="bg-muted flex flex-col">
        <PaymentTable payments={confirmedPayments} />
      </div>
      <div className="flex gap-1 flex-col sm:flex-row sm:justify-between items-center mt-1">
        <p>Menampilkan per {confirmedPayments.length} pembayaran</p>
        <ShowAllButton href="confirmed" showAll={showAll} />
        <PagePagination
          page={page}
          limit={limit}
          dataLength={confirmedPayments.length}
          link="confirmed?"
          className="w-fit mx-0"
          disabled={showAll}
        />
      </div>
    </div>
  );
};
export default page;
