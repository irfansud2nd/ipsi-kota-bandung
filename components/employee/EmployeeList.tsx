import { Employee } from "@/lib/employee/employeeConstants";
import EmployeeCard from "./EmployeeCard";

const EmployeeList = ({ employees }: { employees: Employee[] }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {employees.length ? (
        employees.map((employee) => <EmployeeCard employee={employee} />)
      ) : (
        <p>Tidak ada.</p>
      )}
    </div>
  );
};
export default EmployeeList;
