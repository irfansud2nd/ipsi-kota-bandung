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
import ShowFileButton from "@/components/showFile/ShowFileButton";
import OfficialDeleteButton from "./OfficialDeleteButton";

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
          <TableHead>Waktu Pendaftaran</TableHead>
          <TableHead>Pas Foto</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {officials.map((official, i) => (
          <TableRow key={official.id}>
            <TableCell>{i + 1}</TableCell>
            <TableCell>{official.name}</TableCell>
            <TableCell>{official.gender}</TableCell>
            <TableCell>{official.contingent_name}</TableCell>
            <TableCell>{official.position}</TableCell>
            <TableCell>{formatDate(official.created_at)}</TableCell>
            <TableCell className="flex gap-1 items-center">
              <ShowFileButton
                title={`Pas Foto ${official.name}`}
                src={official.image.downloadUrl}
              />
              <OfficialDeleteButton official={official} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
export default OfficialTable;
