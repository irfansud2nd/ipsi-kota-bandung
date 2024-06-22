import PaymentTable from "@/components/admin/payment/PaymentTable";
import PagePagination from "@/components/ui/PagePagination";
import RefreshButton from "@/components/ui/RefreshButton";
import { getConfirmedPaymentByChampionshipId } from "@/lib/payment/paymentActions";

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

  const confirmedPayments = await getConfirmedPaymentByChampionshipId(
    params.championshipId,
    page,
    limit
  );

  return (
    <div className="p-2">
      <div className="flex gap-1 items-center justify-between flex-wrap">
        <h1 className="font-semibold text-3xl">Pembayaran Terkonfirmasi</h1>
        <RefreshButton />
      </div>
      <div className="bg-muted flex flex-col">
        <PaymentTable payments={confirmedPayments} />
      </div>
      <div className="flex gap-1 flex-col sm:flex-row sm:justify-between items-center mt-1">
        <p>Menampilkan per {confirmedPayments.length} pembayaran</p>
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
