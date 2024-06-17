import { Payment } from "@/lib/payment/paymentConstants";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatToRupiah } from "@/lib/functions";
import { getUniquePaymentTotal } from "@/lib/payment/paymentFunctions";
import ConfirmPaymentForm from "./ConfirmPaymentForm";

const UnconfirmedPaymentTable = ({ payments }: { payments: Payment[] }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No</TableHead>
          <TableHead>ID</TableHead>
          <TableHead>Nama Kontingen</TableHead>
          <TableHead>Total Pembayaran</TableHead>
          <TableHead>Nomor Telepon</TableHead>
          <TableHead>Nominal Transfer</TableHead>
          <TableHead>Waktu Pembayaran</TableHead>
          <TableHead>Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment, i) => (
          <TableRow key={payment.id}>
            <TableCell>{i + 1}</TableCell>
            <TableCell>{payment.id}</TableCell>
            <TableCell>{payment.contingent_name}</TableCell>
            <TableCell>{formatToRupiah(payment.total)}</TableCell>
            <TableCell>{payment.phone_number}</TableCell>
            <TableCell>
              {formatToRupiah(
                getUniquePaymentTotal(payment.total, payment.phone_number)
              )}
            </TableCell>
            <TableCell>{formatDate(payment.created_at)}</TableCell>
            <TableCell>
              <div className="flex gap-1">
                <ConfirmPaymentForm payment={payment} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
export default UnconfirmedPaymentTable;
