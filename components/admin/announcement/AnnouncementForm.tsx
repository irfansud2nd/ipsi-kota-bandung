"use client";
import InputRichText from "@/components/inputs/InputRichText";
import InputText from "@/components/inputs/InputText";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { updateAnnouncement } from "@/lib/announcement/announcementActions";
import {
  Announcement,
  announcementSchema,
} from "@/lib/announcement/announcementConstants";
import { toastError } from "@/lib/form/formFunctions";
import { Form, Formik, FormikProps } from "formik";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const AnnouncementForm = ({ announcement }: { announcement: Announcement }) => {
  const [open, setOpen] = useState(false);
  const session = useSession();
  const router = useRouter();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Ubah</Button>
      </DialogTrigger>
      <DialogContent>
        <h2 className="text-xl font-semibold">Ubah Pengumuman</h2>
        <Formik
          initialValues={announcement}
          onSubmit={async (values, { setSubmitting }) => {
            const toastId = toast.loading("Memperbaharui pengumuman");
            try {
              const { error } = await updateAnnouncement(values);
              if (error) throw error;

              setOpen(false);
              router.refresh();
              toast.success("Pengumuman berhasil diperbaharui", {
                id: toastId,
              });
            } catch (error) {
              toastError(error, toastId);
              setSubmitting(false);
            }
          }}
          validationSchema={announcementSchema}
        >
          {(props: FormikProps<Announcement>) => {
            return (
              <Form className="flex flex-col">
                <InputRichText
                  label="Teks Announcement"
                  name="text"
                  formik={props}
                />
                <InputText
                  label="Email Penulis"
                  name="updater_email"
                  formik={props}
                  forceDisabled
                  forceValue={session.data?.user?.email as string}
                />
                <Button
                  type="submit"
                  disabled={props.isSubmitting}
                  className="w-fit ml-auto"
                >
                  Simpan
                </Button>
              </Form>
            );
          }}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};
export default AnnouncementForm;
