"use client";
import InputDate from "@/components/inputs/InputDate";
import InputFile from "@/components/inputs/InputFile";
import InputSelect from "@/components/inputs/InputSelect";
import InputText from "@/components/inputs/InputText";
import InputTextarea from "@/components/inputs/InputTextarea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Athlete,
  athleteGender,
  athleteInitialValue,
  athleteSchema,
  getDummyAthletes,
} from "@/lib/athlete/external/athleteConstants";
import {
  addAthlete,
  updateAthlete,
} from "@/lib/athlete/external/athleteFunctions";
import { toastError } from "@/lib/form/formFunctions";
import {
  addAthletesRedux,
  setAthleteToEditRedux,
} from "@/lib/redux/championship/register/athleteSlice";

import { RootState } from "@/lib/redux/store";
import { Form, Formik, FormikProps } from "formik";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const AthleteForm = () => {
  const [open, setOpen] = useState(false);
  const [fileChanging, setFileChanging] = useState({
    image: false,
    ktp: false,
    kk: false,
  });

  const athleteToEdit = useSelector(
    (state: RootState) => state.athlete.athleteToEdit
  );
  const contingent = useSelector(
    (state: RootState) => state.contingent.unregistered
  );

  const dispatch = useDispatch();
  const session = useSession();

  const useDummyAthlete = 1;
  const initialData = useDummyAthlete
    ? getDummyAthletes(useDummyAthlete)[useDummyAthlete - 1]
    : athleteInitialValue;

  const initialValue: Athlete = {
    ...initialData,
    created_by: session.data?.user?.email || "",
    contingent_id: contingent?.id || "",
    contingent_name: contingent?.name || "",
  };

  const toggleDialog = (state: boolean) => {
    setOpen(state);
    if (athleteToEdit && !state) dispatch(setAthleteToEditRedux());
  };

  useEffect(() => {
    if (athleteToEdit) setOpen(true);
  }, [athleteToEdit]);

  return (
    <Dialog open={open} onOpenChange={toggleDialog}>
      <DialogTrigger asChild>
        <Button>Tambah Atlet</Button>
      </DialogTrigger>
      <DialogContent>
        <Formik
          initialValues={athleteToEdit ?? initialValue}
          onSubmit={async (values, { resetForm }) => {
            if (!contingent) {
              toastError("Daftarkan kontingen terlebih dahulu");
              return;
            }
            try {
              let athlete = values;
              if (athleteToEdit) {
                athlete = await updateAthlete(values);
              } else {
                athlete = await addAthlete(values);
              }
              dispatch(addAthletesRedux([athlete]));
              resetForm();
            } catch (error) {
            } finally {
            }
          }}
          validationSchema={athleteSchema(
            athleteToEdit ? fileChanging : undefined
          )}
        >
          {(props: FormikProps<Athlete>) => {
            return (
              <Form className="flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2">
                  <div>
                    <InputText
                      label="Nama Lengkap"
                      name="name"
                      formik={props}
                    />
                    <InputText label="NIK" name="nik" formik={props} />
                    <InputText
                      label="Tempat Lahir"
                      name="birth_place"
                      formik={props}
                    />
                    <InputDate
                      label="Tanggal Lahir"
                      name="birth_date"
                      formik={props}
                    />
                    <InputSelect
                      label="Jenis Kelamin"
                      name="gender"
                      formik={props}
                      options={athleteGender}
                    />
                    <InputText
                      label="Tinggi Badan"
                      helperText="(CM)"
                      name="height"
                      formik={props}
                    />
                    <InputText
                      label="Berat Badan"
                      helperText="(KG)"
                      name="weight"
                      formik={props}
                    />
                  </div>
                  <div>
                    <InputText
                      label="Nomor Telepon"
                      name="phone_number"
                      formik={props}
                      // under17
                    />
                    <InputText
                      label="Email"
                      name="email"
                      formik={props}
                      // under17
                    />
                    <InputText
                      label="Nama Kontingen"
                      name="contingent_name"
                      formik={props}
                      forceDisabled
                    />
                    <InputTextarea
                      label="Alamat"
                      name="address"
                      formik={props}
                    />
                    <InputFile
                      label="Pas Foto"
                      name="image"
                      formik={props}
                      isFileChanging={(value) => {
                        setFileChanging((prev) => ({ ...prev, image: !value }));
                      }}
                    />
                    <InputFile
                      label="Kartu Keluarga"
                      name="kk"
                      formik={props}
                      isFileChanging={(value) => {
                        setFileChanging((prev) => ({ ...prev, kk: !value }));
                      }}
                      landscape
                    />
                  </div>
                </div>
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
export default AthleteForm;
