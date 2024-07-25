"use client";
import DisplayText from "@/components/inputs/DisplayText";
import ShowFile from "@/components/showFile/ShowFile";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { toastError } from "@/lib/form/formFunctions";
import { formatToRupiah } from "@/lib/functions";
import { updatePaymentSql } from "@/lib/payment/paymentActions";
import { Payment } from "@/lib/payment/paymentConstants";
import {
  deletePayment,
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
import { MdOutlineCancel, MdOutlineDeleteForever } from "react-icons/md";
import useConfirmation from "@/hooks/useConfirmation";
import { useState } from "react";

type Props = {
  payment: Payment;
  confirm?: boolean;
  remove?: boolean;
  unconfirm?: boolean;
};

const ManagePaymentForm = ({ payment, remove, confirm, unconfirm }: Props) => {
  const [open, setOpen] = useState(false);
  const session = useSession();
  const userEmail = session.data?.user?.email;

  const router = useRouter();

  const { confirm: confirmFunc, ConfirmationDialog } = useConfirmation();

  if (!userEmail) return null;

  const handleConfirm = async () => {
    const toastId = toast.loading("Mengkonfirmasi Pembayaran");
    let data = payment;
    data.confirmed_by = userEmail;
    try {
      if (!data.confirmed_by)
        throw { message: "email pengguna tidak ditemukan" };

      const { error } = await updatePaymentSql(paymentToPaymentSql(data));
      if (error) throw error;

      toast.success("Pembayaran berhasil dikonfirmasi", { id: toastId });
      setOpen(false);
      router.refresh();
    } catch (error) {
      toastError(error, toastId);
    }
  };

  const handleUnconfirm = async () => {
    const result = await confirmFunc("Membatalkan konfirmasi");
    if (!result) return;
    const toastId = toast.loading("Membatalkan Konfirmasi");
    let data = payment;
    data.confirmed_by = "";
    try {
      const { error } = await updatePaymentSql(paymentToPaymentSql(data));
      if (error) throw error;

      toast.success("Konfirmasi berhasil dibatalkan", { id: toastId });
      setOpen(false);
      router.refresh();
    } catch (error) {
      toastError(error, toastId);
    }
  };

  const handleDelete = async () => {
    const result = await confirmFunc("Menghapus Pembayaran");
    if (!result) return;
    await deletePayment(payment);
    setOpen(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <ConfirmationDialog />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                size={"icon"}
                variant={remove || unconfirm ? "destructive" : "default"}
              >
                {confirm && <FaCheck className="size-4" />}
                {unconfirm && <MdOutlineCancel className="size-4" />}
                {remove && <MdOutlineDeleteForever className="size-4" />}
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {confirm && "Konfirmasi"}
              {unconfirm && "Batalkan Konfirmasi"}
              {remove && "Batalkan Pembayaran"}
            </p>
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
          />
        </div>
        <div className="flex gap-1 justify-end">
          {remove && (
            <Button onClick={handleDelete} variant={"destructive"}>
              Batalkan Pembayaran
            </Button>
          )}
          {unconfirm && (
            <Button onClick={handleUnconfirm} variant={"destructive"}>
              Batalkan Konfirmasi
            </Button>
          )}
          {confirm && <Button onClick={handleConfirm}>Konfirmasi</Button>}
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default ManagePaymentForm;
