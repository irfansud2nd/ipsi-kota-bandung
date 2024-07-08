import { SpecialUser, SpecialUserRole } from "@/lib/admin/adminConstants";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ShowFileButton from "@/components/showFile/ShowFileButton";
import ManageSpecialUser from "./ManageSpecialUser";

type Props = { specialUsers: SpecialUser[]; role: SpecialUserRole };

const SpecialUserTable = ({ specialUsers, role }: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No</TableHead>
          <TableHead>Nama</TableHead>
          <TableHead>Email</TableHead>
          {role.includes("Athlete") && <TableHead>Pas Foto</TableHead>}
          <TableHead>Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {specialUsers.map((specialUser, i) => (
          <TableRow key={specialUser.email}>
            <TableCell>{i + 1}</TableCell>
            <TableCell>{specialUser.name}</TableCell>
            <TableCell>{specialUser.email}</TableCell>
            <TableCell>
              {specialUser.image?.downloadUrl ? (
                <ShowFileButton
                  title={`Pas Foto ${specialUser.name}`}
                  src={specialUser.image.downloadUrl}
                />
              ) : (
                "-"
              )}
            </TableCell>
            <TableCell>
              <ManageSpecialUser specialUser={specialUser} role={role} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
export default SpecialUserTable;
