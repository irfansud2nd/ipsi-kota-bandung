import {
  RegisteredContingent,
  RegisteredContingentAdmin,
} from "@/lib/contingent/contingentConstants";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatToRupiah } from "@/lib/functions";

const RegisteredContingentAdminTable = ({
  registeredContingentAdmins,
}: {
  registeredContingentAdmins: RegisteredContingentAdmin[];
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
          <TableHead>Pemula Tanding</TableHead>
          <TableHead>Pemula Seni</TableHead>
          <TableHead>Prestasi Tanding</TableHead>
          <TableHead>Prestasi Seni</TableHead>
          <TableHead>Tanding</TableHead>
          <TableHead>Seni</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Pembayaran</TableHead>
          <TableHead>Tagihan</TableHead>
          <TableHead>Waktu dibuat</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {registeredContingentAdmins.map((registeredContingentAdmin, i) => (
          <TableRow key={registeredContingentAdmin.id}>
            <TableCell>{i + 1}</TableCell>
            <TableCell>{registeredContingentAdmin.name}</TableCell>
            <TableCell>
              {registeredContingentAdmin.registered_athletes}
            </TableCell>
            <TableCell>
              {registeredContingentAdmin.registered_officials}
            </TableCell>
            <TableCell>{registeredContingentAdmin.match_count}</TableCell>
            <TableCell>{registeredContingentAdmin.rookie_fight}</TableCell>
            <TableCell>{registeredContingentAdmin.rookie_art}</TableCell>
            <TableCell>
              {registeredContingentAdmin.professional_fight}
            </TableCell>
            <TableCell>{registeredContingentAdmin.professional_art}</TableCell>
            <TableCell
              className={`${
                registeredContingentAdmin.payment_total >=
                registeredContingentAdmin.payment_bill
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {registeredContingentAdmin.payment_total >=
              registeredContingentAdmin.payment_bill
                ? "Lunas"
                : "Belum Lunas"}
            </TableCell>
            <TableCell className="whitespace-nowrap">
              {formatToRupiah(registeredContingentAdmin.payment_total)}
            </TableCell>
            <TableCell className="whitespace-nowrap">
              {formatToRupiah(registeredContingentAdmin.payment_bill)}
            </TableCell>
            <TableCell>{registeredContingentAdmin.created_by}</TableCell>
            <TableCell>
              {formatDate(registeredContingentAdmin.created_at)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
export default RegisteredContingentAdminTable;
