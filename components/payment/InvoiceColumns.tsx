import { ColumnDef } from "@tanstack/react-table";
import TableSortButton from "../ui/TableSortButton";
import { formatDate, formatToRupiah } from "@/lib/functions";
import { Payment } from "@/lib/payment/paymentConstants";
import { getUniquePaymentTotal } from "@/lib/payment/paymentFunctions";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import PaymentInvoice from "./PaymentInvoice";

export const InvoiceColumns = () => {
  let columns: ColumnDef<Payment>[] = [
    {
      header: "No",
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      accessorKey: "id",
      header: "ID Pembayaran",
    },
    {
      accessorKey: "total",
      header: "Total Pembayaran",
      cell: ({ row }) => <div>{formatToRupiah(row.original.total)}</div>,
    },
    {
      accessorKey: "nominal",
      header: "Nominal Transaksi",
      cell: ({ row }) => (
        <div>
          {formatToRupiah(
            getUniquePaymentTotal(row.original.total, row.original.phone_number)
          )}
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => {
        return <TableSortButton column={column} text="Waktu Pembayaran" />;
      },
      cell: ({ row }) => <div>{formatDate(row.original.created_at)}</div>,
    },
    {
      accessorKey: "confirmed_by",
      header: "Status",
      cell: ({ row }) => (
        <div>
          {row.original.confirmed_by.length
            ? "Dikonfirmasi"
            : "Menunggu Konfirmasi"}
        </div>
      ),
    },
    {
      header: "Aksi",
      cell: ({ row }) => {
        return (
          <div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Download Invoice</Button>
              </DialogTrigger>
              <DialogContent className="w-fit flex justify-center items-center">
                <PaymentInvoice payment={row.original} />
              </DialogContent>
            </Dialog>
          </div>
        );
      },
    },
  ];

  return columns;
};
