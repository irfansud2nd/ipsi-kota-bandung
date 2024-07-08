import MatchBasedTable from "@/components/admin/athlete/external/MatchBasedTable";
import ManagePaymentForm from "@/components/admin/payment/ManagePaymentForm";
import HorizontalTable from "@/components/contingent/HorizontalTable";
import ShowFile from "@/components/showFile/ShowFile";
import { getMatchBasedsByPaymentId } from "@/lib/athlete/external/athleteActions";
import { fetchData, formatDate, formatToRupiah } from "@/lib/functions";
import { getPaymentById } from "@/lib/payment/paymentActions";
import { getUniquePaymentTotal } from "@/lib/payment/paymentFunctions";
import { notFound } from "next/navigation";

const page = async ({ params }: { params: { paymentId: string } }) => {
  const { paymentId } = params;

  const payment = await fetchData(() => getPaymentById(paymentId));

  if (!payment) return notFound;

  const matchBaseds = await fetchData(() =>
    getMatchBasedsByPaymentId(payment.id)
  );

  return (
    <div>
      <h1 className="font-semibold text-2xl">Pembayaran {paymentId}</h1>
      <div className="flex gap-2 flex-wrap">
        <div className="border-2 p-1 rounded grow justify-center">
          <h2 className="font-medium text-lg border-b-2 ">Info Pembayaran</h2>
          <HorizontalTable
            data={[
              {
                key: "ID",
                value: payment.id,
              },
              {
                key: "Nama Kontingen",
                value: payment.contingent_name,
              },
              {
                key: "Total Pembayaran",
                value: formatToRupiah(payment.total),
              },
              {
                key: "Nomor Telepon",
                value: payment.phone_number,
              },
              {
                key: "Nominal Transfer",
                value: formatToRupiah(
                  getUniquePaymentTotal(payment.total, payment.phone_number)
                ),
              },
              {
                key: "Status",
                value: (
                  <span
                    className={`${
                      payment.confirmed_by.length
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {payment.confirmed_by.length
                      ? "Dikonfirmasi"
                      : "Menunggu Konfirmasi"}
                  </span>
                ),
              },
              {
                key: "Waktu Pembayaran",
                value: formatDate(payment.created_at),
              },
              {
                key: "Aksi",
                value: (
                  <div className="flex gap-1">
                    {payment.confirmed_by.length ? (
                      <ManagePaymentForm payment={payment} unconfirm />
                    ) : (
                      <>
                        <ManagePaymentForm payment={payment} confirm />
                        <ManagePaymentForm payment={payment} remove />
                      </>
                    )}
                  </div>
                ),
              },
            ]}
          />
        </div>
        <div className="border-2 p-1 rounded grow">
          <h2 className="font-medium text-lg border-b-2">Bukti Pembayaran</h2>
          <img
            src={payment.image.downloadUrl}
            className="max-h-[300px] object-center object-contain mx-auto my-auto"
          />
        </div>
      </div>
      <div className="border-2 rounded pt-1 mt-1">
        <h2 className="font-medium text-lg border-b-2 w-fit">Daftar Atlet</h2>
        <MatchBasedTable matchBaseds={matchBaseds} />
      </div>
    </div>
  );
};
export default page;
