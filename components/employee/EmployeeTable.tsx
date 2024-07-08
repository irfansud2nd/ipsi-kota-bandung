import { Employee } from "@/lib/employee/employeeConstants";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import ShowFileButton from "../showFile/ShowFileButton";
import ManageEmployee from "./ManageEmployee";

type Props = {
  employees: Employee[];
};

const EmployeeTable = ({ employees }: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No</TableHead>
          <TableHead>Nama</TableHead>
          <TableHead>Posisi</TableHead>
          <TableHead>Pas Foto</TableHead>
          <TableHead>Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {employees.map((employee, i) => (
          <TableRow key={employee.id}>
            <TableCell>{i + 1}</TableCell>
            <TableCell>{employee.name}</TableCell>
            <TableCell>{employee.position}</TableCell>
            <TableCell>
              {employee.image?.downloadUrl ? (
                <ShowFileButton
                  title={`Pas Foto ${employee.name}`}
                  src={employee.image.downloadUrl}
                />
              ) : (
                "-"
              )}
            </TableCell>
            <TableCell>
              <ManageEmployee
                employee={employee}
                aboveEmployee={employees[i - 1]}
                belowEmployee={employees[i + 1]}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
export default EmployeeTable;
