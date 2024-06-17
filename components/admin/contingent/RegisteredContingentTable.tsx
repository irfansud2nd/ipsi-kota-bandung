import { RegisteredContingent } from "@/lib/contingent/contingentConstants";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatToRupiah } from "@/lib/functions";

const RegisteredContingentTable = ({
  registeredContingents,
}: {
  registeredContingents: RegisteredContingent[];
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No</TableHead>
          <TableHead>Nama Kontingen</TableHead>
          <TableHead>Atlet</TableHead>
          <TableHead>Official</TableHead>
          <TableHead>Nomor Pertandingan</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Pembayaran</TableHead>
          <TableHead>Tagihan</TableHead>
          <TableHead>Waktu dibuat</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {registeredContingents.map((registeredContingent, i) => (
          <TableRow key={registeredContingent.id}>
            <TableCell>{i + 1}</TableCell>
            <TableCell>{registeredContingent.name}</TableCell>
            <TableCell>{registeredContingent.registered_athletes}</TableCell>
            <TableCell>{registeredContingent.registered_officials}</TableCell>
            <TableCell>{registeredContingent.match_count}</TableCell>
            <TableCell>
              {registeredContingent.payment_total >=
              registeredContingent.payment_bill
                ? "Lunas"
                : "Belum Lunas"}
            </TableCell>
            <TableCell className="whitespace-nowrap">
              {formatToRupiah(registeredContingent.payment_total)}
            </TableCell>
            <TableCell className="whitespace-nowrap">
              {formatToRupiah(registeredContingent.payment_bill)}
            </TableCell>
            <TableCell>{registeredContingent.created_by}</TableCell>
            <TableCell>{formatDate(registeredContingent.created_at)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
export default RegisteredContingentTable;
