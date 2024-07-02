import PagePagination from "@/components/ui/PagePagination";
import { getUnconfirmedPaymentByChampionshipId } from "@/lib/payment/paymentActions";
import RefreshButton from "@/components/ui/RefreshButton";
import PaymentTable from "@/components/admin/payment/PaymentTable";
import { fetchData } from "@/lib/functions";

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

  const unconfirmedPayments = await fetchData(() =>
    getUnconfirmedPaymentByChampionshipId(params.championshipId, page, limit)
  );

  return (
    <div className="p-2">
      <div className="flex gap-1 items-center justify-between flex-wrap">
        <h1 className="font-semibold text-3xl">
          Pembayaran Menunggu Konfirmasi
        </h1>
        <RefreshButton />
      </div>
      <div className="bg-muted flex flex-col">
        <PaymentTable payments={unconfirmedPayments} />
      </div>
      <div className="flex gap-1 flex-col sm:flex-row sm:justify-between items-center mt-1">
        <p>Menampilkan per {unconfirmedPayments.length} pembayaran</p>
        <PagePagination
          page={page}
          limit={limit}
          dataLength={unconfirmedPayments.length}
          link="unconfirmed?"
          className="w-fit mx-0"
          disabled={showAll}
        />
      </div>
    </div>
  );
};
export default page;
