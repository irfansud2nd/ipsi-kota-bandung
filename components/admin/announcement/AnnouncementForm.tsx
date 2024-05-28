"use client";
import InputRichText from "@/components/inputs/InputRichText";
import InputText from "@/components/inputs/InputText";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Announcement,
  announcementSchema,
} from "@/lib/announcement/announcementConstants";
import { updateAnnouncement } from "@/lib/announcement/announcementFunctions";
import { Form, Formik, FormikProps } from "formik";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
          onSubmit={(values, { setSubmitting }) => {
            updateAnnouncement(values)
              .then(() => {
                setOpen(false);
                router.refresh();
              })
              .catch(() => setSubmitting(false));
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
                  name="updaterEmail"
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
