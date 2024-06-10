import { Contingent } from "@/lib/contingent/contingentConstants";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/functions";

const ContingentTable = ({ contingents }: { contingents: Contingent[] }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No</TableHead>
          <TableHead>Nama Kontingen</TableHead>
          <TableHead>Atlet</TableHead>
          <TableHead>Official</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Waktu dibuat</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contingents.map((contingent, i) => (
          <TableRow key={contingent.id}>
            <TableCell>{i + 1}</TableCell>
            <TableCell>{contingent.name}</TableCell>
            <TableCell>{contingent.athletes}</TableCell>
            <TableCell>{contingent.officials}</TableCell>
            <TableCell>{contingent.created_by}</TableCell>
            <TableCell>{formatDate(contingent.created_at)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
export default ContingentTable;
