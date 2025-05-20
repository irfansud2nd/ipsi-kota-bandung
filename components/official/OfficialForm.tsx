"use client";

import {
  Official,
  officialInitialValue,
  officialPositions,
  officialSchema,
} from "@/lib/official/officialContants";
import {
  addOfficialsRedux,
  setOfficialToEditRedux,
} from "@/lib/redux/championship/register/officialSlice";
import { RootState } from "@/lib/redux/store";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Form, Formik, FormikProps } from "formik";
import { Button } from "../ui/button";
import { toastError } from "@/lib/form/formFunctions";
import InputText from "../inputs/InputText";
import InputFile from "../inputs/InputFile";
import InputSelect from "../inputs/InputSelect";
import { adultGender } from "@/lib/form/formConstants";
import { addOfficial, updateOfficial } from "@/lib/official/officialFunctions";
import { getChampionship } from "@/lib/event/eventFunctions";
import { Championship } from "@/lib/event/eventConstants";

const OfficialForm = ({ championshipId }: { championshipId: string }) => {
  const [open, setOpen] = useState(false);
  const [fileChanging, setFileChanging] = useState({
    image: false,
    certificateFile: false,
  });

  const officialToEdit = useSelector(
    (state: RootState) => state.official.officialToEdit
  );
  const contingent = useSelector(
    (state: RootState) => state.contingent.unregistered
  );

  const dispatch = useDispatch();

  const initialValue: Official = {
    ...officialInitialValue,
    contingent_id: contingent?.id || "",
    contingent_name: contingent?.name || "",
  };

  const toggleDialog = (state: boolean) => {
    setOpen(state);
    if (officialToEdit && !state) dispatch(setOfficialToEditRedux());
  };

  useEffect(() => {
    if (officialToEdit) {
      setOpen(true);
      if (!officialToEdit.certificate_file.downloadUrl) {
        setFileChanging((prev) => ({
          ...prev,
          certificateFile: false,
        }));
      }
    }
  }, [officialToEdit]);

  useEffect(() => {
    console.log(fileChanging);
  }, [fileChanging]);

  const championship = getChampionship(championshipId) as Championship;
  const disableAdd = Date.now() > championship.register.end;
  const disableEdit = disableAdd && Date.now() > championship.editLimit;

  return (
    <Dialog open={open} onOpenChange={toggleDialog}>
      {!disableAdd && (
        <DialogTrigger asChild>
          <Button>Tambah Official</Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <Formik
          initialValues={officialToEdit ?? initialValue}
          onSubmit={async (values, { resetForm }) => {
            if (!contingent) {
              toastError("Daftarkan kontingen terlebih dahulu");
              return;
            }
            try {
              let official = values;
              if (officialToEdit) {
                if (disableEdit) {
                  toastError(
                    "Pengguna sudah tidak dapat merubah data official"
                  );
                  return;
                }
                official = await updateOfficial(values);
                toggleDialog(false);
              } else {
                if (disableAdd) {
                  toastError("Pendaftaran telah ditutup");
                  return;
                }
                official = await addOfficial(values);
              }
              dispatch(addOfficialsRedux([official]));
              resetForm();
            } catch (error) {
              // console.log("ERRROR", error);
            } finally {
            }
          }}
          validationSchema={officialSchema(
            officialToEdit ? fileChanging : undefined
          )}
        >
          {(props: FormikProps<Official>) => {
            return (
              <Form className="flex flex-col">
                <InputText label="Nama Lengkap" name="name" formik={props} />
                <InputText
                  label="Nomor Telepon"
                  name="phone_number"
                  formik={props}
                />
                <InputSelect
                  label="Jenis Kelamin"
                  name="gender"
                  formik={props}
                  options={adultGender}
                />
                <InputSelect
                  label="Jabatan"
                  name="position"
                  formik={props}
                  options={officialPositions}
                />
                <InputText
                  label="Nama Kontingen"
                  name="contingent_name"
                  formik={props}
                  forceDisabled
                />
                <InputFile
                  label="Pas Foto"
                  name="image"
                  formik={props}
                  isFileChanging={(value) =>
                    setFileChanging((prev) => ({ ...prev, image: !value }))
                  }
                />
                <InputFile
                  label="Sertifikat"
                  name="certificate_file"
                  formik={props}
                  isFileChanging={(value) => {
                    if (
                      officialToEdit &&
                      !officialToEdit.certificate_file.downloadUrl
                    ) {
                      setFileChanging((prev) => ({
                        ...prev,
                        certificateFile: false,
                      }));
                    } else {
                      setFileChanging((prev) => ({
                        ...prev,
                        certificateFile: !value,
                      }));
                    }
                  }}
                />
                <Button type="submit" className="ml-auto">
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
export default OfficialForm;
