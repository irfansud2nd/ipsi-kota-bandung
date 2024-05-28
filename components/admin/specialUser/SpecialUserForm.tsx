"use client";
import InputText from "@/components/inputs/InputText";
import { Button } from "@/components/ui/button";
import {
  SpecialUser,
  SpecialUserRole,
  specialUserIntitialValue,
  specialUserSchema,
} from "@/lib/admin/adminConstants";
import { addSepecialUser } from "@/lib/admin/adminFunctions";
import { Form, Formik, FormikProps } from "formik";
import { useRouter } from "next/navigation";

type Props = {
  role: SpecialUserRole;
  userToEdit?: SpecialUser;
};

const SpecialUserForm = ({ role, userToEdit }: Props) => {
  const router = useRouter();
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Tambah Atlet</h2>
      <Formik
        initialValues={userToEdit ?? specialUserIntitialValue(role)}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          if (userToEdit) {
          } else {
            addSepecialUser(values)
              .then((res) => {
                resetForm();
                router.refresh();
              })
              .finally(() => setSubmitting(false));
          }
        }}
        validationSchema={specialUserSchema}
      >
        {(props: FormikProps<SpecialUser>) => {
          if (!props.values.roles.length) props.setFieldValue("roles", [role]);
          return (
            <Form className="flex flex-col w-[250px]">
              <InputText label="Email" name="email" formik={props} />
              <InputText label="Nama" name="name" formik={props} />
              <Button
                type="submit"
                disabled={props.isSubmitting}
                className="w-fit ml-auto mt-1"
              >
                Tambah
              </Button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
export default SpecialUserForm;
