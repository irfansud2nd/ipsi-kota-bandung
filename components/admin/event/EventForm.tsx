"use client";
import InputDate from "@/components/inputs/InputDate";
import InputFile from "@/components/inputs/InputFile";
import InputText from "@/components/inputs/InputText";
import InputTextarea from "@/components/inputs/InputTextarea";
import { Button } from "@/components/ui/button";
import {
  Event,
  eventInitialValue,
  eventSchema,
} from "@/lib/event/eventConstants";
import { Form, Formik, FormikProps } from "formik";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import EventDisplay from "@/components/Event/EventDisplay";
import { sendEvent, updateEvent } from "@/lib/event/eventFunctions";
import InputRichText from "@/components/inputs/InputRichText";

const EventForm = ({ eventToEdit }: { eventToEdit?: Event }) => {
  const [changeImage, setChangeImage] = useState(false);
  const session = useSession();
  return (
    <Formik
      initialValues={eventToEdit ? eventToEdit : eventInitialValue}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        if (eventToEdit) {
          updateEvent(values).finally(() => setSubmitting(false));
        } else {
          sendEvent(values)
            .then((res) => {
              resetForm();
            })
            .finally(() => setSubmitting(false));
        }
      }}
      validationSchema={eventSchema(eventToEdit && !changeImage)}
    >
      {(props: FormikProps<Event>) => {
        return (
          <Form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <InputText label="Judul Event" name="title" formik={props} />
                <InputFile
                  label="Gambar"
                  name="image"
                  formik={props}
                  isFileChanging={setChangeImage}
                />
                <InputText
                  label="Nama Lokasi"
                  name="location_name"
                  formik={props}
                />
                <InputText
                  label="Link Google Maps Lokasi"
                  name="location_url"
                  helperText="(opsional)"
                  formik={props}
                />
                <InputText
                  label="Penyelenggara"
                  name="organizer"
                  formik={props}
                />
                <InputText
                  label="Email Pembuat"
                  name="created_by"
                  formik={props}
                  forceDisabled
                  forceValue={session.data?.user?.email as string}
                />
              </div>
              <div>
                <InputDate
                  label="Tanggal Mulai"
                  name="date_start"
                  formik={props}
                />
                <InputDate
                  label="Tanggal Selesai"
                  name="date_end"
                  formik={props}
                  helperText="(untuk event >1 hari)"
                />
                <InputDate
                  label="Jam Mulai"
                  name="time_start"
                  formik={props}
                  time
                />
                <InputDate
                  label="Jam Selesai"
                  name="time_end"
                  formik={props}
                  time
                  helperText="(opsional)"
                />
                <InputRichText
                  label="Deskripsi"
                  name="description"
                  formik={props}
                />
                {/* <InputTextarea
                  label="Deskripsi"
                  name="description"
                  formik={props}
                /> */}
              </div>
            </div>
            <div className="ml-auto w-fit flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button type="button">Lihat Preview</Button>
                </DialogTrigger>
                <DialogContent>
                  <EventDisplay event={props.values} preview />
                </DialogContent>
              </Dialog>
              <Button type="submit">Simpan</Button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};
export default EventForm;
