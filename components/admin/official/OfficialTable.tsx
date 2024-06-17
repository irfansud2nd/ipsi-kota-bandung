import { Official } from "@/lib/official/officialContants";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/functions";

const OfficialTable = ({ officials }: { officials: Official[] }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No</TableHead>
          <TableHead>Nama</TableHead>
          <TableHead>Jenis Kelamin</TableHead>
          <TableHead>Nama kontingen</TableHead>
          <TableHead>Jabatan</TableHead>
          <TableHead>Email Pendaftar</TableHead>
          <TableHead>Waktu Pendaftaran</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {officials.map((official, i) => (
          <TableRow key={official.id}>
            <TableCell>{i + 1}</TableCell>
            <TableCell>{official.name}</TableCell>
            <TableCell>{official.gender}</TableCell>
            <TableCell>{official.contingent_name}</TableCell>
            <TableCell>{official.created_by}</TableCell>
            <TableCell>{formatDate(official.created_at)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
export default OfficialTable;
