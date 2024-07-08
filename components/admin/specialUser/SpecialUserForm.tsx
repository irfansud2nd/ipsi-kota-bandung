"use client";
import InputText from "@/components/inputs/InputText";
import { Button } from "@/components/ui/button";
import {
  SpecialUser,
  SpecialUserRole,
  specialUserIntitialValue,
  specialUserSchema,
} from "@/lib/admin/adminConstants";
import { addSpecialUser } from "@/lib/admin/adminFunctions";
import { getSpecialUserLabel } from "@/lib/functions";
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
      <h2 className="text-xl font-semibold mb-2">
        Tambah {getSpecialUserLabel(role)}
      </h2>
      <Formik
        initialValues={userToEdit ?? specialUserIntitialValue(role)}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            if (userToEdit) {
            } else {
              await addSpecialUser(values);
            }
            router.refresh();
          } catch (error) {
            throw error;
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
