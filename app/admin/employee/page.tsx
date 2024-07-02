import { DataTable } from "@/components/ui/DataTable";
import PagePagination from "@/components/ui/PagePagination";
import { SearchPageParams } from "@/lib/constants";
import { EmployeeColumns } from "@/components/employee/EmployeeColumns";
import EmployeeForm from "@/components/employee/EmployeeForm";
import { getEmployees } from "@/lib/employee/employeeFunctions";

const page = async ({ searchParams }: { searchParams: SearchPageParams }) => {
  const page = Number(searchParams.page) || 1;
  const limit = 10;
  const employees = await getEmployees(page, limit);
  return (
    <div className="p-2">
      <div className="flex w-full items-center justify-between mb-2">
        <h1 className="font-bold text-2xl mb-2 mr-2">Kelola Pengurus</h1>
        <EmployeeForm />
      </div>
      <DataTable columns={EmployeeColumns} data={employees} />
      <PagePagination
        page={page}
        limit={limit}
        dataLength={employees.length}
        className="mr-0 my-2 w-fit"
        link="/admin/event?"
      />
    </div>
  );
};
export default page;
