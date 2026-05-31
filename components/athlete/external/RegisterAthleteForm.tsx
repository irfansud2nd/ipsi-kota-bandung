"use client";
import DisplayText from "@/components/inputs/DisplayText";
import InputSelect from "@/components/inputs/InputSelect";
import InputText from "@/components/inputs/InputText";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import useConfirmation from "@/hooks/useConfirmation";
import {
  Athlete,
  AthleteAtEvent,
  athleteAtEventSchema,
  athleteAtEventInitialValue,
  matchSchema,
  matchType,
  MatchBased,
} from "@/lib/athlete/external/athleteConstants";
import {
  addAthleteAtEvent,
  checkMatchBasedLimited,
  getLevel,
  getMatchCategory,
  getMatchCost,
  isMatchSame,
  updateAthleteAtEvent,
} from "@/lib/athlete/external/athleteFunctions";
import { RegisteredContingent } from "@/lib/contingent/contingentConstants";
import { checkContingentMatchLimit } from "@/lib/contingent/contingentFunctions";
import { Championship } from "@/lib/event/eventConstants";
import { getChampionship, isLevelRookieOnly } from "@/lib/event/eventFunctions";
import { toastError } from "@/lib/form/formFunctions";
import {
  addAthletesAtEventsRedux,
  setAthleteAtEventToEditRedux,
  setAthleteToEditRedux,
} from "@/lib/redux/championship/register/athleteSlice";
import { RootState } from "@/lib/redux/store";
import { Form, Formik, FormikProps } from "formik";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

type Props = {
  championshipId: string;
  art?: boolean;
};

const RegisterAthleteForm = ({ championshipId, art }: Props) => {
  const [open, setOpen] = useState(false);
  const [validateTeam, setValidateTeam] = useState(false);

  const {
    all: athletes,
    athleteAtEventToEdit,
    matchBased: matchBaseds,
  } = useSelector((state: RootState) => state.athlete);

  const { confirm, ConfirmationDialog } = useConfirmation();

  const registeredContingent = useSelector(
    (state: RootState) => state.contingent.registered
  ) as RegisteredContingent;

  const dispatch = useDispatch();

  const router = useRouter();

  const getAthleteById = (athleteId: string) => {
    return athletes.find((athlete) => athlete.id == athleteId) as Athlete;
  };

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

  const initialValues: AthleteAtEvent = {
    ...athleteAtEventInitialValue,
    athlete_id: "",
    type: matchType[art ? 1 : 0],
    contingent_registration_id: registeredContingent.registration_id,
    championship_id: registeredContingent.championship_id,
    registered_at: Date.now(),
  };

  const isMatchDuplicate = (matchBased: MatchBased) => {
    const registeredMathces = matchBaseds.filter(
      (item) => item.athlete_id == matchBased.athlete_id
    );
    if (!registeredMathces.length) return false;

    if (
      !registeredMathces.some((registered) =>
        isMatchSame(registered, matchBased)
      )
    )
      return false;

    return true;
  };

  const checkOneAthletePerCategory = (matchBased: MatchBased) => {
    if (matchBased.schema == matchSchema[0]) return false;
    if (
      !championship.matchCategory.find((item) => item.level == matchBased.level)
        ?.oneAthletePerCategory
    )
      return false;
    let limit = 1;
    if (matchBased.category.includes("Ganda")) limit = 2;
    if (matchBased.category.includes("Regu")) limit = 3;

    const registered = matchBaseds.filter((item) =>
      isMatchSame(item, matchBased)
    );

    return registered.length >= limit;
  };

  const toggleDialog = (state: boolean) => {
    setOpen(state);
    if (athleteAtEventToEdit && !state)
      dispatch(setAthleteAtEventToEditRedux());
  };

  useEffect(() => {
    if (athleteAtEventToEdit) setOpen(true);
  }, [athleteAtEventToEdit]);

  const checkAthleteFiles = async (
    athleteId: string,
    props: FormikProps<AthleteAtEvent>
  ) => {
    const athlete = getAthleteById(athleteId);

    if (!athlete) {
      toastError("Atlet tidak ditemukan");
      props.setFieldValue("athlete_id", "");
    }
    if (!athlete.image || !athlete.kk || !athlete.id_card) {
      const isConfirmed = await confirm("Lengkapi data atlet", {
        message: `Berkas wajib ${athlete.name} tidak lengkap, Tolong lengkapi terlebih dahulu`,
        confirmLabel: "Lengkapi",
        cancelLabel: `Batalkan pilihan atlet`,
      });
      props.setFieldValue("athlete_id", "");
      if (isConfirmed) {
        dispatch(setAthleteToEditRedux(athlete));
        router.push(`/championship/${championshipId}/register/athlete`);
      }
    } else {
      props.setFieldValue("athlete_id", athleteId);
    }
  };

  return (
    <>
      <ConfirmationDialog />
      <Dialog open={open} onOpenChange={toggleDialog}>
        {!disableEdit && (
          <DialogTrigger asChild disabled={!athletes.length}>
            <Button>Tambah Atlet</Button>
          </DialogTrigger>
        )}
        <DialogContent>
          <Formik
            initialValues={athleteAtEventToEdit ?? initialValues}
            onSubmit={async (values, { resetForm }) => {
              if (athleteAtEventToEdit) {
                if (disableEdit) {
                  toastError(
                    "Pengguna sudah tidak dapat merubah data pertandingan"
                  );
                  return;
                }
              } else {
                if (disableEdit) {
                  toastError("Pendaftaran telah ditutup");
                  return;
                }
              }

              const toastId = toast.loading(
                `${
                  athleteAtEventToEdit ? "Memperharui" : "Mendaftarkan"
                } pertandingan`
              );
              try {
                let matchBased: MatchBased = {
                  ...getAthleteById(values.athlete_id),
                  ...values,
                };

                if (
                  art &&
                  matchBased.type.includes("Tunggal") &&
                  matchBased.team
                )
                  matchBased.team = undefined;

                if (isMatchDuplicate(matchBased))
                  throw { message: "Atlet telah mendaftar di kelas yang sama" };

                if (checkOneAthletePerCategory(matchBased))
                  throw {
                    message:
                      "1 Kontingen hanya diperolehkan mendaftarkan 1 Atlet di kategori yang anda pilih",
                  };

                if (!values.athlete_id)
                  throw { message: "Tolong pilih atlet terlebih dahulu" };

                if (!values.contingent_registration_id)
                  throw { message: "ID Pendaftaran kontingen tidak ditemukan" };

                const message = await checkMatchBasedLimited(
                  matchBaseds,
                  matchBased,
                  championship
                );
                if (message) throw { message };

                const matchLimitMessage = await checkContingentMatchLimit(
                  registeredContingent.registration_id,
                  championship
                );
                if (matchLimitMessage) throw { message: matchLimitMessage };

                if (athleteAtEventToEdit) {
                  await updateAthleteAtEvent(values);
                  dispatch(addAthletesAtEventsRedux([values]));
                  toggleDialog(false);
                } else {
                  const athleteAtEvent = await addAthleteAtEvent(values);
                  dispatch(addAthletesAtEventsRedux([athleteAtEvent]));
                }
                toast.success(
                  `Pertandingan berhasil di${
                    athleteAtEventToEdit ? "perbaharui" : "daftarkan"
                  }`,
                  { id: toastId }
                );
              } catch (error) {
                toastError(error, toastId);
              } finally {
              }
            }}
            validationSchema={athleteAtEventSchema(validateTeam)}
          >
            {(props: FormikProps<AthleteAtEvent>) => {
              return (
                <Form className="flex flex-col">
                  {props.values.schema ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2">
                        <div>
                          <InputSelect
                            label="Nama Atlet"
                            name="athlete_id"
                            formik={props}
                            options={athletes.map((item) => item.id)}
                            customOptionLabel={(id) => getAthleteById(id).name}
                            forceDisabled={!!athleteAtEventToEdit}
                            onChange={(value) =>
                              checkAthleteFiles(value, props)
                            }
                          />
                          <DisplayText
                            label="Tinggi Badan"
                            helperText="(CM)"
                            value={
                              getAthleteById(props.values.athlete_id)?.height ||
                              ""
                            }
                          />
                          <DisplayText
                            label="Berat Badan"
                            helperText="(KG)"
                            value={
                              getAthleteById(props.values.athlete_id)?.weight ||
                              ""
                            }
                          />
                          <InputSelect
                            label="Jenis Pertandingan"
                            name="type"
                            options={matchType}
                            formik={props}
                            forceValue={matchType[art ? 1 : 0]}
                            forceDisabled
                          />
                        </div>
                        <div>
                          <DisplayText
                            label="Skema Pertandingan"
                            value={props.values.schema}
                          />
                          <InputSelect
                            label="Kelompok Usia"
                            name="level"
                            formik={props}
                            options={getLevel(
                              props.values.schema == matchSchema[0],
                              championship.matchCategory
                            )}
                          />
                          <InputSelect
                            label="Kategori Pertandingan"
                            name="category"
                            formik={props}
                            options={getMatchCategory(
                              props.values.level,
                              props.values.type,
                              championship.matchCategory
                            )}
                            onChange={(value) =>
                              setValidateTeam(
                                !!art && !value.includes("Tunggal")
                              )
                            }
                            dynamicOptions
                          />
                          {art &&
                            !props.values.category.includes("Tunggal") && (
                              <InputText
                                label="Nama Tim"
                                helperText='Bukan nama kontingen, (contoh:"Tim 1, Tim A")'
                                name="team"
                                formik={props}
                              />
                            )}
                          <InputText
                            label="Biaya"
                            name="payment_bill"
                            formik={props}
                            forceValue={getMatchCost(props.values)}
                            forceDisabled
                          />
                        </div>
                      </div>
                      <div className="flex gap-1 items-center justify-end">
                        <Button
                          type="button"
                          onClick={() => props.setFieldValue("schema", "")}
                        >
                          Ganti Skema
                        </Button>
                        <Button type="submit">Simpan</Button>
                      </div>
                    </>
                  ) : (
                    <div className="flex gap-5 justify-center">
                      {matchSchema.map((schema) => (
                        <Button
                          onClick={() => props.setFieldValue("schema", schema)}
                          key={schema}
                        >
                          {schema}
                        </Button>
                      ))}
                    </div>
                  )}
                </Form>
              );
            }}
          </Formik>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default RegisterAthleteForm;
