"use client";
import { News, newsInitialValue, newsSchema } from "@/lib/news/newsConstants";
import { Button } from "@/components/ui/button";
import { Form, Formik, FormikProps } from "formik";
import InputText from "@/components/inputs/InputText";
import { useSession } from "next-auth/react";
import InputRichText from "@/components/inputs/InputRichText";
import { sendNews, updateNews } from "@/lib/news/newsFunctions";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import NewsDisplay from "@/components/news/NewsDisplay";
import InputFile from "@/components/inputs/InputFile";

const NewsForm = ({ newsToEdit }: { newsToEdit?: News }) => {
  const [changeImage, setChangeImage] = useState(false);
  const session = useSession();

  return (
    <Formik
      initialValues={newsToEdit ? newsToEdit : newsInitialValue}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        if (newsToEdit) {
          updateNews(values).finally(() => setSubmitting(false));
        } else {
          sendNews(values)
            .then((res) => {
              resetForm();
            })
            .finally(() => setSubmitting(false));
        }
      }}
      validationSchema={newsSchema(newsToEdit && !changeImage)}
    >
      {(props: FormikProps<News>) => {
        return (
          <Form>
            <InputText label="Judul Berita" name="title" formik={props} />
            <InputText label="Penulis" name="creatorName" formik={props} />
            <InputFile
              label="Gambar"
              name="image"
              formik={props}
              landscape
              isFileChanging={(value) => setChangeImage(value)}
            />
            <InputRichText label="Konten" name="text" formik={props} />
            <InputText
              label="Email Penulis"
              name="creatorEmail"
              formik={props}
              forceDisabled
              forceValue={
                newsToEdit?.creatorEmail ??
                (session.data?.user?.email as string)
              }
              className={`${!newsToEdit?.id && "hidden"}`}
            />
            <div className="flex gap-2 my-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button type="button">Lihat Preview</Button>
                </DialogTrigger>
                <DialogContent>
                  <NewsDisplay news={props.values} preview />
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
export default NewsForm;
