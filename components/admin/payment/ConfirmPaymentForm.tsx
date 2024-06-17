"use client";
import DisplayText from "@/components/inputs/DisplayText";
import ShowFile from "@/components/ui/ShowFile";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { toastError } from "@/lib/form/formFunctions";
import { formatToRupiah } from "@/lib/functions";
import { updatePaymentSql } from "@/lib/payment/paymentActions";
import { Payment } from "@/lib/payment/paymentConstants";
import {
  getUniquePaymentTotal,
  paymentToPaymentSql,
} from "@/lib/payment/paymentFunctions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaCheck } from "react-icons/fa6";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ConfirmPaymentForm = ({ payment }: { payment: Payment }) => {
  const session = useSession();
  const userEmail = session.data?.user?.email;

  const router = useRouter();

  if (!userEmail) return null;

  const handleConfirm = async () => {
    const toastId = toast.loading("Mengkonfirmasi Pembayaran");
    let data = payment;
    data.confirmed_by = userEmail;
    try {
      if (!data.confirmed_by)
        throw { message: "email pengguna tidak ditemukan" };
      await updatePaymentSql(paymentToPaymentSql(data));
      toast.success("Pembayaran berhasil dikonfirmasi", { id: toastId });
      router.refresh();
    } catch (error) {
      toastError(error, toastId);
    }
  };

  return (
    <Dialog>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button size={"icon"}>
                <FaCheck className="size-4" />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Konfirmasi</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent className="md:w-fit">
        <div className="flex gap-3 justify-center flex-wrap">
          <div className="flex flex-col gap-1">
            <DisplayText
              label="Nama Kontignen"
              value={payment.contingent_name}
            />
            <DisplayText label="Nomor Telepon" value={payment.phone_number} />
            <DisplayText
              label="Total Pembayaran"
              value={formatToRupiah(payment.total)}
            />
            <DisplayText
              label="Nominal Transaksi"
              value={formatToRupiah(
                getUniquePaymentTotal(payment.total, payment.phone_number)
              )}
            />
            <DisplayText
              label="Dikonfirmasi Oleh"
              value={
                payment.confirmed_by.length ? payment.confirmed_by : userEmail
              }
            />
          </div>
          <ShowFile
            src={payment.image.downloadUrl}
            label="Bukti Transaksi"
            className="max-w-[250px]"
            newTab
          />
        </div>
        <Button className="w-fit ml-auto" onClick={handleConfirm}>
          Konfirmasi
        </Button>
      </DialogContent>
    </Dialog>
  );
};
export default ConfirmPaymentForm;
