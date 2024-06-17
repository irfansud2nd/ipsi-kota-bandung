import { toast } from "sonner";
import { Payment, PaymentSql } from "./paymentConstants";
import { v4 } from "uuid";
import { getFileUrl } from "../functions";
import { apiProtect } from "../admin/adminActions";
import { sendFile, toastError } from "../form/formFunctions";
import { addPaymentSql } from "./paymentActions";

// PAYMENT
export const addPayment = async (paymentData: Payment) => {
  const toastId = toast.loading("Mendaftarkan pembayaran");
  const id = v4();

  let payment: Payment = { ...paymentData, id };
  payment.created_at = Date.now();

  const { imageUrl } = getFileUrl("payment", id);

  try {
    if (!payment.contingent_registration_id)
      throw { message: "ID pendaftaran kontingen tidak ditemukan" };
    if (!payment.contingent_id)
      throw { message: "ID Kontingen tidak ditemukan" };
    if (!payment.contingent_name)
      throw { message: "Nama Kontingen tidak ditemukan" };
    if (!payment.image.file) throw { message: "Pas foto tidak ditemukan" };

    const { message } = await apiProtect({
      loggedInOnly: true,
    });
    if (message) throw { message };

    // SEND IMAGE
    toast.loading("Mengunggah pas foto pembayaran", { id: toastId });
    payment.image.downloadUrl = await sendFile(payment.image.file, imageUrl);
    delete payment.image.file;

    // SEND PAYMENT
    toast.loading("Mendaftarkan pembayaran", { id: toastId });
    await addPaymentSql(paymentToPaymentSql(payment));

    // FINISH
    toast.success("Pembayaran berhasil didaftarkan", { id: toastId });
    return payment;
  } catch (error) {
    toastError(error, toastId);
    throw error;
  }
};

// OTHERS
export const paymentToPaymentSql = (payment: Payment) => {
  const result: PaymentSql = {
    id: payment.id,
    total: payment.total,
    contingent_registration_id: payment.contingent_registration_id,
    phone_number: payment.phone_number,
    confirmed_by: payment.confirmed_by,
    created_at: payment.created_at,
    image: payment.image.downloadUrl,
  };
  return result;
};

export const getUniquePaymentTotal = (
  totalPayment: number,
  phoneNumber: string
) => {
  let last3digit = phoneNumber
    .substring(phoneNumber.length - 3)
    .padStart(3, "0");
  const result = (totalPayment / 1000).toString() + last3digit;
  return Number(result);
};
