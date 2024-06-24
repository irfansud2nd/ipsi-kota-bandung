"use client";
import { ColumnDef } from "@tanstack/react-table";
import useConfirmation from "@/hooks/useConfirmation";
import { useRouter } from "next/navigation";
import { Employee } from "@/lib/employee/employeeConstants";
import AdminManageButtons from "../admin/AdminManageButtons";
import EmployeeCard from "./EmployeeCard";
import EmployeeForm from "./EmployeeForm";
import { Button } from "../ui/button";

export const EmployeeColumns: ColumnDef<Employee>[] = [
  {
    accessorKey: "name",
    header: "Nama",
  },
  {
    accessorKey: "position",
    header: "Jabatan",
  },
  {
    header: "Aksi",
    cell: ({ row, table }) => {
      const router = useRouter();
      const employee = row.original;
      const rowsLength = table.getRowCount();
      const currentId = row.id;

      const { confirm, ConfirmationDialog } = useConfirmation();

      const handleDelete = async () => {
        const result = await confirm("Hapus event");
        if (result) {
          // DELETE EMPLOYEE
        }
      };
      return (
        <>
          <ConfirmationDialog />
          <Button onClick={() => {}}>ADD BELOW</Button>
          <Button onClick={() => {}}>ADD ABOVE</Button>
          <AdminManageButtons
            show={{
              label: "Preview",
              component: (
                <EmployeeCard employee={employee} className="w-[250px]" />
              ),
            }}
            edit={{
              component: <EmployeeForm employeeToEdit={employee} noDialog />,
            }}
            handleDelete={handleDelete}
          />
        </>
      );
    },
  },
];
