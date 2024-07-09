"use client";

import useConfirmation from "@/hooks/useConfirmation";
import {
  Employee,
  employeeInitialValue,
} from "@/lib/employee/employeeConstants";
import { deleteEmployee } from "@/lib/employee/employeeFunctions";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import AdminManageButtons, { EditButton } from "../admin/AdminManageButtons";
import EmployeeCard from "./EmployeeCard";
import EmployeeForm from "./EmployeeForm";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { RiInsertRowBottom, RiInsertRowTop } from "react-icons/ri";

type Props = {
  employee: Employee;
  aboveEmployee?: Employee;
  belowEmployee?: Employee;
};

const AddButton = ({ order, above }: { order: number; above?: boolean }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <EmployeeForm
            employeeToEdit={{
              ...employeeInitialValue,
              order: order,
            }}
          >
            <Button size={"icon"} variant={"outline"}>
              {above ? (
                <RiInsertRowTop className="size-4" />
              ) : (
                <RiInsertRowBottom className="size-4" />
              )}
            </Button>
          </EmployeeForm>
        </TooltipTrigger>
        <TooltipContent>
          <p>Tambahkan di {above ? "atas" : "bawah"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const ManageEmployee = ({ employee, aboveEmployee, belowEmployee }: Props) => {
  const router = useRouter();

  const { confirm, ConfirmationDialog } = useConfirmation();

  const handleDelete = async () => {
    const result = await confirm("Hapus event");
    if (result) {
      // DELETE EMPLOYEE
      try {
        await deleteEmployee(employee);
        router.refresh();
      } catch (error) {
        throw error;
      }
    }
  };

  const getOrder = () => {
    let result = {
      above: employee.order - 1,
      below: employee.order + 1,
    };
    if (belowEmployee) {
      result.below = (employee.order + belowEmployee.order) / 2;
    }
    if (aboveEmployee) {
      result.above = (employee.order + aboveEmployee.order) / 2;
    }
    return result;
  };

  return (
    <div className="flex gap-1">
      <ConfirmationDialog />

      <AddButton order={getOrder().above} above />
      <AddButton order={getOrder().below} />

      <AdminManageButtons
        show={{
          label: "Preview",
          component: <EmployeeCard employee={employee} className="w-[250px]" />,
        }}
        edit={{
          component: (
            <EmployeeForm employeeToEdit={employee} noDialog>
              <EditButton />
            </EmployeeForm>
          ),
        }}
        handleDelete={handleDelete}
      />
    </div>
  );
};
export default ManageEmployee;
