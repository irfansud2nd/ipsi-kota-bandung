"use client";
import {
  Member,
  memberInitialValue,
  memberSchema,
} from "@/lib/member/memberConstants";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { EditButton } from "../admin/AdminManageButtons";
import { Button } from "../ui/button";
import { SpecialUser, SpecialUserRole } from "@/lib/admin/adminConstants";
import { Form, Formik, FormikProps } from "formik";
import InputText from "../inputs/InputText";
import InputFile from "../inputs/InputFile";
import MemberCard from "./MemberCard";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { decode } from "jsonwebtoken";
import { updateSpecialUser } from "@/lib/admin/adminFunctions";
import { sendMember, updateMember } from "@/lib/member/memberFunctions";
import { useRouter } from "next/navigation";

type Props = {
  memberToEdit?: Member;
  athlete?: boolean;
  noDialog?: boolean;
};

const FormComponent = ({ memberToEdit, athlete }: Props) => {
  const [changeImage, setChangeImage] = useState(false);
  const session = useSession();

  const athletToEdit: Member | undefined = athlete
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
      initialValues={memberToEdit ?? athletToEdit ?? memberInitialValue}
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
          } else if (memberToEdit) {
            // UPDATE MEMBER
            await updateMember(values);
          } else {
            // SEND MEMBER
            await sendMember(values);
          }
          router.refresh();
          resetForm();
        } finally {
          setSubmitting(false);
        }
      }}
      validationSchema={memberSchema(changeImage)}
    >
      {(props: FormikProps<Member>) => {
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
                  <MemberCard member={props.values} />
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

const MemberForm = ({ memberToEdit, athlete, noDialog }: Props) => {
  if (noDialog)
    return <FormComponent memberToEdit={memberToEdit} athlete={athlete} />;
  return (
    <Dialog>
      <DialogTrigger asChild={!memberToEdit}>
        {memberToEdit ? (
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
export default MemberForm;
