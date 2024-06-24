"use client";
import {
  Employee,
  employeeInitialValue,
  employeeSchema,
} from "@/lib/employee/employeeConstants";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { EditButton } from "../admin/AdminManageButtons";
import { Button } from "../ui/button";
import { SpecialUser, SpecialUserRole } from "@/lib/admin/adminConstants";
import { Form, Formik, FormikProps } from "formik";
import InputText from "../inputs/InputText";
import InputFile from "../inputs/InputFile";
import EmployeeCard from "./EmployeeCard";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { decode } from "jsonwebtoken";
import { updateSpecialUser } from "@/lib/admin/adminFunctions";
import { addEmployee, updateEmployee } from "@/lib/employee/employeeFunctions";
import { useRouter } from "next/navigation";

type Props = {
  employeeToEdit?: Employee;
  athlete?: boolean;
  noDialog?: boolean;
};

const FormComponent = ({ employeeToEdit, athlete }: Props) => {
  const [changeImage, setChangeImage] = useState(false);
  const session = useSession();

  const athletToEdit: Employee | undefined = athlete
    ? {
        name: session.data?.user?.name || "",
        image: {
          downloadUrl: session.data?.user?.image?.includes("firebase")
            ? session.data.user.image
            : "",
        },
        position: "",
        id: "",
        order: 0,
      }
    : undefined;

  const router = useRouter();

  return (
    <Formik
      initialValues={employeeToEdit ?? athletToEdit ?? employeeInitialValue}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        try {
          if (athlete) {
            // UPDATE ATHLETE
            const { roles } = decode(
              (session as any).data.user.authorizedToken
            ) as { roles: SpecialUserRole[] };
            let data: SpecialUser = {
              name: values.name,
              image: values.image,
              email: session.data?.user?.email || "",
              roles,
            };
            await updateSpecialUser(data);
          } else if (employeeToEdit) {
            // UPDATE EMPLOYEE
            await updateEmployee(values);
          } else {
            // SEND EMPLOYEE
            await addEmployee(values);
          }
          router.refresh();
          resetForm();
        } finally {
          setSubmitting(false);
        }
      }}
      validationSchema={employeeSchema(changeImage)}
    >
      {(props: FormikProps<Employee>) => {
        return (
          <Form>
            <div className="flex flex-col gap-2">
              <InputText label="Nama" name="name" formik={props} />
              {!athlete && (
                <InputText label="Jabatan" name="position" formik={props} />
              )}
              <InputFile
                label="Gambar"
                name="image"
                formik={props}
                isFileChanging={setChangeImage}
              />
            </div>
            <div className="ml-auto w-fit flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button type="button">Lihat Preview</Button>
                </DialogTrigger>
                <DialogContent className="w-[250px]">
                  <EmployeeCard employee={props.values} />
                </DialogContent>
              </Dialog>
              <Button type="submit" disabled={props.isSubmitting}>
                Simpan
              </Button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

const EmployeeForm = ({ employeeToEdit, athlete, noDialog }: Props) => {
  if (noDialog)
    return <FormComponent employeeToEdit={employeeToEdit} athlete={athlete} />;
  return (
    <Dialog>
      <DialogTrigger asChild={!employeeToEdit}>
        {employeeToEdit ? (
          <EditButton />
        ) : (
          <Button>{athlete ? "Ubah Data" : "Tambah"}</Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-fit">
        <FormComponent />
      </DialogContent>
    </Dialog>
  );
};
export default EmployeeForm;
