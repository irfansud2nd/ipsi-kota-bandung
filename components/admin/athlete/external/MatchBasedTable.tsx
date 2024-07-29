import ShowFileButton from "@/components/showFile/ShowFileButton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MatchBased } from "@/lib/athlete/external/athleteConstants";
import { formatDate } from "@/lib/functions";
import ManageMatchBased from "./ManageMatchBased";

const MatchBasedTable = ({ matchBaseds }: { matchBaseds: MatchBased[] }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No</TableHead>
          <TableHead>ID</TableHead>
          <TableHead>Nama</TableHead>
          <TableHead>NIK</TableHead>
          <TableHead>Jenis Kelamin</TableHead>
          <TableHead>Alamat</TableHead>
          <TableHead>Tempat Lahir</TableHead>
          <TableHead>Tanggal Lahir</TableHead>
          <TableHead>Tinggi Badan</TableHead>
          <TableHead>Berat Badan</TableHead>
          <TableHead>Jenis</TableHead>
          <TableHead>Skema</TableHead>
          <TableHead>Tingkatan</TableHead>
          <TableHead>Kategori</TableHead>
          <TableHead>Nama Tim</TableHead>
          <TableHead>Pembayaran</TableHead>
          <TableHead>Nama Kontingen</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Nomor Telepon</TableHead>
          <TableHead>Waktu Pendaftaran</TableHead>
          <TableHead>Pas Foto</TableHead>
          <TableHead>Kartu Keluarga</TableHead>
          <TableHead>Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {matchBaseds.map((matchBased, i) => (
          <TableRow key={matchBased.registration_id}>
            <TableCell>{i + 1}</TableCell>
            <TableCell>{matchBased.registration_id}</TableCell>
            <TableCell>{matchBased.name}</TableCell>
            <TableCell>
              <span className="hidden">'</span>
              {matchBased.nik}
              <span className="hidden">'</span>
            </TableCell>
            <TableCell>{matchBased.gender}</TableCell>
            <TableCell>{matchBased.address}</TableCell>
            <TableCell>{matchBased.birth_place}</TableCell>
            <TableCell>
              {formatDate(matchBased.birth_date, { withoutHour: true })}
            </TableCell>
            <TableCell>{matchBased.height} CM</TableCell>
            <TableCell>{matchBased.weight} KG</TableCell>
            <TableCell>{matchBased.type}</TableCell>
            <TableCell>{matchBased.schema}</TableCell>
            <TableCell>{matchBased.level}</TableCell>
            <TableCell>{matchBased.category}</TableCell>
            <TableCell>
              {matchBased.team?.length ? matchBased.team : "-"}
            </TableCell>
            <TableCell
              className={`${
                matchBased.payment_id ? "text-green-500" : "text-red-500"
              }`}
            >
              {matchBased.payment_id ? "Dibayar" : "Belum dibayar"}
            </TableCell>
            <TableCell>{matchBased.contingent_name}</TableCell>
            <TableCell>{matchBased.email}</TableCell>
            <TableCell>{matchBased.phone_number}</TableCell>
            <TableCell>{formatDate(matchBased.created_at)}</TableCell>
            <TableCell>
              <ShowFileButton
                title={`Pas Foto ${matchBased.name}`}
                src={matchBased.image.downloadUrl}
              />
            </TableCell>
            <TableCell>
              <ShowFileButton
                title={`Kartu Keluarga ${matchBased.name}`}
                src={matchBased.kk.downloadUrl}
                landscape
              />
            </TableCell>
            <TableCell>
              <ManageMatchBased matchBased={matchBased} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
export default MatchBasedTable;
