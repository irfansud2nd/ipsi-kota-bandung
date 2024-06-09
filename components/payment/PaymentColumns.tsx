import { MatchBased } from "@/lib/athlete/external/athleteConstants";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import TableSortButton from "../ui/TableSortButton";
import { formatToRupiah } from "@/lib/functions";

export const PaymentColumns = (paid: boolean, isClosed?: boolean) => {
  let columns: ColumnDef<MatchBased>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return <TableSortButton column={column} text="Nama" />;
      },
    },
    {
      accessorKey: "type",
      header: "Jenis",
    },
    {
      accessorKey: "schema",
      header: "Skema",
    },
    {
      accessorKey: "level",
      header: "Tingkatan",
    },
    {
      accessorKey: "category",
      header: "Kategori",
    },
    {
      accessorKey: "team",
      header: "Nama Tim",
      cell: ({ row }) => <div>{row.original.team || "-"}</div>,
    },
    {
      id: "cost",
      accessorKey: "payment_bill",
      header: "Biaya",
      cell: ({ row }) => <div>{formatToRupiah(row.original.payment_bill)}</div>,
    },
  ];

  if (paid) {
    columns = columns.filter(
      (item) => item.id != "select" && item.id != "cost"
    );
  }

  if (isClosed) {
    columns = columns.filter((item) => item.id != "select");
  }

  return columns;
};
