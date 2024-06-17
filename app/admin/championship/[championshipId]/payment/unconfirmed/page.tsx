import PagePagination from "@/components/ui/PagePagination";
import { getUnconfirmedPaymentByChampionshipId } from "@/lib/payment/paymentActions";
import UnconfirmedPaymentTable from "@/components/admin/payment/UnconfirmedPaymentTable";

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

  const unconfirmedPayments = await getUnconfirmedPaymentByChampionshipId(
    params.championshipId,
    page,
    limit
  );

  return (
    <div className="p-2">
      <h1 className="font-semibold text-3xl">Pembayaran Menunggu Konfirmasi</h1>
      <div className="bg-muted flex flex-col">
        <UnconfirmedPaymentTable payments={unconfirmedPayments} />
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
