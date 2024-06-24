import { imageMaxSize, imageSchema } from "@/lib/form/formConstants";
import { Employee } from "@/lib/employee/employeeConstants";

type Props = {
  employee: Employee;
  className?: string;
};

const EmployeeCard = ({ employee, className }: Props) => {
  let imageSource = "/images/profile-fallback.png";

  if (employee.image?.file) {
    imageSchema(imageMaxSize.employee).isValidSync(employee.image.file) &&
      (imageSource = URL.createObjectURL(employee.image.file));
  }

  if (employee.image?.downloadUrl) imageSource = employee.image.downloadUrl;

  return (
    <div
      className={`rounded-lg bg-muted overflow-hidden hover:drop-shadow-lg hover:-translate-y-1 transition-all ${className}`}
    >
      <img
        src={imageSource}
        alt={`Foto ${employee.name}`}
        className="bg-gray-200 w-full aspect-square object-cover object-center"
      />
      <div className="p-2">
        <h3 className="text-lg font-medium">{employee.name}</h3>
        <p>{employee.position}</p>
      </div>
    </div>
  );
};
export default EmployeeCard;
