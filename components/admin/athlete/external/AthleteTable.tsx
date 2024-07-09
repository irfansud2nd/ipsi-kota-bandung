import { Athlete } from "@/lib/athlete/external/athleteConstants";
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

const AthleteTable = ({ athletes }: { athletes: Athlete[] }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No</TableHead>
          <TableHead>Nama</TableHead>
          <TableHead>NIK</TableHead>
          <TableHead>Jenis Kelamin</TableHead>
          <TableHead>Alamat</TableHead>
          <TableHead>Tempat Lahir</TableHead>
          <TableHead>Tanggal Lahir</TableHead>
          <TableHead>Tinggi Badan</TableHead>
          <TableHead>Berat Badan</TableHead>
          <TableHead>Nama Kontingen</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Nomor Telepon</TableHead>
          <TableHead>Waktu Pendaftaran</TableHead>
          <TableHead>Pas Foto</TableHead>
          <TableHead>Kartu Keluarga</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {athletes.map((athlete, i) => (
          <TableRow key={athlete.id}>
            <TableCell>{i + 1}</TableCell>
            <TableCell>{athlete.name}</TableCell>
            <TableCell>{athlete.nik}</TableCell>
            <TableCell>{athlete.gender}</TableCell>
            <TableCell>{athlete.address}</TableCell>
            <TableCell>{athlete.birth_place}</TableCell>
            <TableCell>
              {formatDate(athlete.birth_date, { withoutHour: true })}
            </TableCell>
            <TableCell>{athlete.height} CM</TableCell>
            <TableCell>{athlete.weight} KG</TableCell>
            <TableCell>{athlete.contingent_name}</TableCell>
            <TableCell>{athlete.email}</TableCell>
            <TableCell>{athlete.phone_number}</TableCell>
            <TableCell>{formatDate(athlete.created_at)}</TableCell>
            <TableCell>
              <ShowFileButton
                title={`Pas Foto ${athlete.name}`}
                src={athlete.image.downloadUrl}
              />
            </TableCell>
            <TableCell>
              <ShowFileButton
                title={`Kartu Keluarga ${athlete.name}`}
                src={athlete.kk.downloadUrl}
                landscape
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
export default AthleteTable;
