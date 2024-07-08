import { Contingent } from "@/lib/contingent/contingentConstants";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/functions";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MdMoreHoriz } from "react-icons/md";
import DetailButton from "@/components/ui/DetailButton";

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
          <TableHead>Detail</TableHead>
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
            <TableCell>
              <DetailButton href={`/admin/contingent/${contingent.id}`} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
export default ContingentTable;
