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
import { Championship } from "@/lib/event/eventConstants";
import { getChampionship } from "@/lib/event/eventFunctions";
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

const AthleteForm = ({ championshipId }: { championshipId: string }) => {
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

  const useDummyAthlete = 0;
  const initialData = useDummyAthlete
    ? getDummyAthletes(useDummyAthlete)[useDummyAthlete - 1]
    : athleteInitialValue;

  const initialValue: Athlete = {
    ...initialData,
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

  const championship = getChampionship(championshipId) as Championship;

  let disableAdd = Date.now() > championship.register.end;
  let disableEdit = disableAdd && Date.now() > championship.editLimit;

  if ((disableAdd || disableEdit) && championship.privilegedEmail?.length) {
    const session = useSession();
    if (
      championship.privilegedEmail.includes(session.data?.user?.email as string)
    ) {
      if (disableAdd) disableAdd = false;
      if (disableEdit) disableEdit = false;
    }
  }

  return (
    <Dialog open={open} onOpenChange={toggleDialog}>
      {!disableAdd && (
        <DialogTrigger asChild>
          <Button>Tambah Atlet</Button>
        </DialogTrigger>
      )}
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
                if (disableEdit) {
                  toastError("Pengguna sudah tidak dapat merubah data atlet");
                  return;
                }
                athlete = await updateAthlete(values);
                toggleDialog(false);
              } else {
                if (disableAdd) {
                  toastError("Pendaftaran telah ditutup");
                  return;
                }
                athlete = await addAthlete(values);
                resetForm();
              }

              dispatch(addAthletesRedux([athlete]));
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
                      championshipId={championshipId}
                      showOnEditOnly
                    />
                    <InputText
                      label="NIK"
                      name="nik"
                      formik={props}
                      championshipId={championshipId}
                      showOnEditOnly
                    />
                    <InputText
                      label="Tempat Lahir"
                      name="birth_place"
                      formik={props}
                      championshipId={championshipId}
                    />
                    <InputDate
                      label="Tanggal Lahir"
                      name="birth_date"
                      formik={props}
                      championshipId={championshipId}
                    />
                    <InputSelect
                      label="Jenis Kelamin"
                      name="gender"
                      formik={props}
                      options={athleteGender}
                      championshipId={championshipId}
                      showOnEditOnly
                    />
                    <InputText
                      label="Tinggi Badan"
                      helperText="(CM)"
                      name="height"
                      formik={props}
                      championshipId={championshipId}
                    />
                    <InputText
                      label="Berat Badan"
                      helperText="(KG)"
                      name="weight"
                      formik={props}
                      championshipId={championshipId}
                    />
                  </div>
                  <div>
                    <InputText
                      label="Nomor Telepon"
                      name="phone_number"
                      formik={props}
                      // under17
                      championshipId={championshipId}
                    />
                    <InputText
                      label="Email"
                      name="email"
                      formik={props}
                      // under17
                      championshipId={championshipId}
                    />
                    <InputText
                      label="Nama Kontingen"
                      name="contingent_name"
                      formik={props}
                      forceDisabled
                      championshipId={championshipId}
                    />
                    <InputTextarea
                      label="Alamat"
                      name="address"
                      formik={props}
                      championshipId={championshipId}
                    />
                    <InputFile
                      label="Pas Foto"
                      name="image"
                      formik={props}
                      isFileChanging={(value) => {
                        setFileChanging((prev) => ({ ...prev, image: !value }));
                      }}
                      championshipId={championshipId}
                    />
                    <InputFile
                      label="Kartu Keluarga"
                      name="kk"
                      formik={props}
                      isFileChanging={(value) => {
                        setFileChanging((prev) => ({ ...prev, kk: !value }));
                      }}
                      landscape
                      championshipId={championshipId}
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
