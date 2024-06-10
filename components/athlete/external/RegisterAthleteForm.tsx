"use client";
import InputSelect from "@/components/inputs/InputSelect";
import InputText from "@/components/inputs/InputText";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { countDuplicateMatch } from "@/lib/athlete/external/athleteActions";
import {
  Athlete,
  AthleteAtEvent,
  athleteAtEventSchema,
  athleteAtEventInitialValue,
  matchSchema,
  matchType,
} from "@/lib/athlete/external/athleteConstants";
import {
  addAthleteAtEvent,
  getMatchCategory,
  getMatchCost,
  updateAthleteAtEvent,
} from "@/lib/athlete/external/athleteFunctions";
import { RegisteredContingent } from "@/lib/contingent/contingentConstants";
import { Championship } from "@/lib/event/eventConstants";
import { getChampionship, isLevelRookieOnly } from "@/lib/event/eventFunctions";
import { toastError } from "@/lib/form/formFunctions";
import {
  addAthletesAtEventsRedux,
  setAthleteAtEventToEditRedux,
} from "@/lib/redux/championship/register/athleteSlice";
import { RootState } from "@/lib/redux/store";
import { Form, Formik, FormikProps } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

type Props = {
  eventId: string;
  art?: boolean;
};

const RegisterAthleteForm = ({ eventId, art }: Props) => {
  const [open, setOpen] = useState(false);
  const [validateTeam, setValidateTeam] = useState(false);

  const {
    all: athletes,
    athleteAtEvents,
    athleteAtEventToEdit,
  } = useSelector((state: RootState) => state.athlete);

  const registeredContingent = useSelector(
    (state: RootState) => state.contingent.registered
  ) as RegisteredContingent;

  const dispatch = useDispatch();

  const getAthleteById = (athleteId: string) => {
    return athletes.find((athlete) => athlete.id == athleteId) as Athlete;
  };

  const championship = getChampionship(eventId) as Championship;
  const levels = championship.matchCategory.map((item) => item.level);

  const initialValues: AthleteAtEvent = {
    ...athleteAtEventInitialValue,
    athlete_id: athletes[0]?.id || "",
    level: levels[0],
    type: matchType[art ? 1 : 0],
    category: championship.matchCategory[0].category[art ? "art" : "fight"][0],
    contingent_registration_id: registeredContingent.registration_id,
    championship_id: registeredContingent.championship_id,
    registered_at: Date.now(),
  };

  const isMatchSame = (item1: AthleteAtEvent, item2: AthleteAtEvent) => {
    return (
      item1.schema == item2.schema &&
      item1.type == item2.type &&
      item1.level == item2.level &&
      item1.category == item2.category &&
      item1.team == item2.team
    );
  };

  const isMatchDuplicate = (athleteAtEvent: AthleteAtEvent) => {
    const registeredMathces = athleteAtEvents.filter(
      (item) => item.athlete_id == athleteAtEvent.athlete_id
    );
    if (!registeredMathces.length) return false;

    if (
      !registeredMathces.some((registered) =>
        isMatchSame(registered, athleteAtEvent)
      )
    )
      return false;

    return true;
  };

  const checkOneAthletePerCategory = (athleteAtEvent: AthleteAtEvent) => {
    if (athleteAtEvent.schema == matchSchema[0]) return false;
    let limit = 1;
    if (athleteAtEvent.category.includes("Ganda")) limit = 2;
    if (athleteAtEvent.category.includes("Regu")) limit = 3;
    if (
      !championship.matchCategory.find(
        (item) => item.level == athleteAtEvent.level
      )?.oneAthletePerCategory
    )
      return false;

    const registered = athleteAtEvents.filter((item) =>
      isMatchSame(item, athleteAtEvent)
    );

    return registered.length >= limit;
  };

  const checkLimited = async (athleteAtEvent: AthleteAtEvent) => {
    if (athleteAtEvent.schema == matchSchema[0]) return;

    const limit = championship.matchCategory.find(
      (item) => item.level == athleteAtEvent.level
    )?.limit;
    if (!limit) return;

    let countLimit = limit.tanding;
    if (athleteAtEvent.category.includes("Ganda")) countLimit = limit.ganda;
    if (athleteAtEvent.category.includes("Regu")) countLimit = limit.regu;
    if (athleteAtEvent.category.includes("Tunggal")) countLimit = limit.tunggal;

    try {
      const count = await countDuplicateMatch(athleteAtEvent, limit.paid);

      // console.log({ count });
      if (count < countLimit) return;
      return `Kuota pertandingan untuk kategori yang anda pilih telah penuh (${countLimit} atlet), silahkan ubah ke kategori Pemula`;
    } catch (error: any) {
      return error.message as string;
    }
  };

  const toggleDialog = (state: boolean) => {
    setOpen(state);
    if (athleteAtEventToEdit && !state)
      dispatch(setAthleteAtEventToEditRedux());
  };

  useEffect(() => {
    if (athleteAtEventToEdit) setOpen(true);
  }, [athleteAtEventToEdit]);

  // useEffect(() => {
  // console.log({ validateTeam });
  // }, [validateTeam]);

  return (
    <Dialog open={open} onOpenChange={toggleDialog}>
      <DialogTrigger asChild disabled={!athletes.length}>
        <Button>Tambah Atlet</Button>
      </DialogTrigger>
      <DialogContent>
        <Formik
          initialValues={athleteAtEventToEdit ?? initialValues}
          onSubmit={async (values, { resetForm }) => {
            const toastId = toast.loading(
              `${
                athleteAtEventToEdit ? "Memperharui" : "Mendaftarkan"
              } pertandingan`
            );
            try {
              if (isMatchDuplicate(values))
                throw { message: "Atlet telah mendaftar di kelas yang sama" };

              if (checkOneAthletePerCategory(values))
                throw {
                  message:
                    "1 Kontingen hanya diperolehkan mendaftarkan 1 Atlet di kategori yang anda pilih",
                };

              if (!values.athlete_id)
                throw { message: "Tolong pilih atlet terlebih dahulu" };

              if (!values.contingent_registration_id)
                throw { message: "ID Pendaftaran kontingen tidak ditemukan" };

              const message = await checkLimited(values);
              if (message) throw { message };

              if (athleteAtEventToEdit) {
                await updateAthleteAtEvent(values);
                dispatch(addAthletesAtEventsRedux([values]));
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2">
                  <div>
                    <InputSelect
                      label="Nama Atlet"
                      name="athlete_id"
                      formik={props}
                      options={athletes.map((item) => item.id)}
                      customOptionLabel={(id) => getAthleteById(id).name}
                    />
                    <InputText
                      label="Tinggi Badan"
                      name="height"
                      helperText="(CM)"
                      formik={props}
                      displayOnly={{
                        state: true,
                        value: props.values.athlete_id
                          ? getAthleteById(props.values.athlete_id).height
                          : "",
                      }}
                    />
                    <InputText
                      label="Tinggi Badan"
                      name="weight"
                      helperText="(CM)"
                      formik={props}
                      displayOnly={{
                        state: true,
                        value: props.values.athlete_id
                          ? getAthleteById(props.values.athlete_id).weight
                          : "",
                      }}
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
                    <InputSelect
                      label="Skema Pertandingan"
                      name="schema"
                      formik={props}
                      forceValue={
                        isLevelRookieOnly(props.values.level, championship)
                          ? matchSchema[0]
                          : undefined
                      }
                      forceDisabled={isLevelRookieOnly(
                        props.values.level,
                        championship
                      )}
                      options={matchSchema}
                    />
                    <InputSelect
                      label="Tingkatan Petandingan"
                      name="level"
                      formik={props}
                      options={levels}
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
                        setValidateTeam(!!art && !value.includes("Tunggal"))
                      }
                      dynamicOptions
                    />
                    {art && !props.values.category.includes("Tunggal") && (
                      <InputText label="Nama Tim" name="team" formik={props} />
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
export default RegisterAthleteForm;
