import CountDisplay from "@/components/ui/CountDisplay";
import { fetchData, formatToRupiah } from "@/lib/functions";
import {
  sumConfirmedPaymentByChampionshipId,
  sumPaymentBillByChampionshipId,
  sumPaymentTotalByChampionshipId,
  sumUnconfirmedPaymentByChampionshipId,
} from "@/lib/payment/paymentActions";
import Link from "next/link";

const page = async ({ params }: { params: { championshipId: string } }) => {
  const paymentTotal = await fetchData(() =>
    sumPaymentTotalByChampionshipId(params.championshipId)
  );
  const paymentBill = await fetchData(() =>
    sumPaymentBillByChampionshipId(params.championshipId)
  );
  const confirmedPayment = await fetchData(() =>
    sumConfirmedPaymentByChampionshipId(params.championshipId)
  );
  const unconfirmedPayment = await fetchData(() =>
    sumUnconfirmedPaymentByChampionshipId(params.championshipId)
  );

  return (
    <div className="flex justify-center items-center gap-2 flex-wrap">
      <CountDisplay
        title="Total Pembayaran"
        count={formatToRupiah(paymentTotal)}
        className="w-fit h-fit"
      />
      <CountDisplay
        title="Total Tagihan"
        count={formatToRupiah(paymentBill)}
        className="w-fit h-fit"
      />
      <Link href={"payment/confirmed"}>
        <CountDisplay
          title="Terkonfirmasi"
          count={formatToRupiah(confirmedPayment)}
          className="w-fit h-fit hover:-translate-y-1 transition-all"
        />
      </Link>
      <Link href={"payment/unconfirmed"}>
        <CountDisplay
          title="Menunggu Konfirmasi"
          count={formatToRupiah(unconfirmedPayment)}
          className="w-fit h-fit hover:-translate-y-1 transition-all"
        />
      </Link>
    </div>
  );
};
export default page;
