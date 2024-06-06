"use client";
import InputSelect from "@/components/inputs/InputSelect";
import InputText from "@/components/inputs/InputText";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Athlete,
  AthleteAtEvent,
  athleteAtEventSchema,
  athleteAtEventInitialValue,
  getMatchCategory,
  matchSchema,
  matchType,
} from "@/lib/athlete/external/athleteConstants";
import {
  addAthleteAtEvent,
  updateAthleteAtEvent,
} from "@/lib/athlete/external/athleteFunctions";
import {
  ContingentAtEvent,
  RegisteredContingent,
} from "@/lib/contingent/contingentConstants";
import { getContingentAtEventByChampionshipId } from "@/lib/contingent/contingentFunctions";
import { Championship } from "@/lib/event/eventConstants";
import { getChampionship } from "@/lib/event/eventFunctions";
import { toastError } from "@/lib/form/formFunctions";
import { reduceData } from "@/lib/functions";
import {
  addAthletesAtEventsRedux,
  setAthleteAtEventToEditRedux,
} from "@/lib/redux/championship/register/athleteSlice";
import { addContingentAtEventsRedux } from "@/lib/redux/championship/register/contingentSlice";
import { RootState } from "@/lib/redux/store";
import { Form, Formik, FormikProps } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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
    athletAtEventToEdit,
  } = useSelector((state: RootState) => state.athlete);
  const { contingentAtEvents } = useSelector(
    (state: RootState) => state.contingent
  );

  const dispatch = useDispatch();

  const getAthleteById = (athleteId: string) => {
    return athletes.find((athlete) => athlete.id == athleteId) as Athlete;
  };

  const championship = getChampionship(eventId) as Championship;
  const levels = championship.matchCategory.map((item) => item.level);

  const initialValues: AthleteAtEvent = {
    ...athleteAtEventInitialValue,
    level: levels[0],
    championshipId: championship.id,
  };

  const isRookeOnly = (level: string) => {
    if (
      championship.matchCategory.find((item) => item.level == level)?.rookieOnly
    )
      return true;
    return false;
  };

  const isMatchDuplicate = (athleteAtEvent: AthleteAtEvent) => {
    const registeredMathces = athleteAtEvents.filter(
      (item) => item.athleteId == athleteAtEvent.athleteId
    );
    if (!registeredMathces.length) return false;

    if (
      registeredMathces.some(
        (registered) =>
          registered.schema == athleteAtEvent.schema &&
          registered.type == athleteAtEvent.type &&
          registered.level == athleteAtEvent.level &&
          registered.category == athleteAtEvent.category &&
          registered.team == athleteAtEvent.team
      )
    )
      return true;
  };

  const toggleDialog = (state: boolean) => {
    setOpen(state);
    if (athletAtEventToEdit && !state) dispatch(setAthleteAtEventToEditRedux());
  };

  useEffect(() => {
    if (athletAtEventToEdit) setOpen(true);
  }, [athletAtEventToEdit]);

  return (
    <Dialog open={open} onOpenChange={toggleDialog}>
      <DialogTrigger asChild disabled={!athletes.length}>
        <Button>Tambah Atlet</Button>
      </DialogTrigger>
      <DialogContent>
        <Formik
          initialValues={athletAtEventToEdit ?? initialValues}
          onSubmit={async (values, { resetForm }) => {
            if (isMatchDuplicate(values)) {
              toastError("Atlet telah mendaftar di kelas yang sama");
              return;
            }
            try {
              const contingentAtEvent = getContingentAtEventByChampionshipId(
                contingentAtEvents,
                championship.id
              ) as ContingentAtEvent;

              const {
                athleteAtEvent,
                contingentAtEvent: updatedContingentAtEvent,
              } = athletAtEventToEdit
                ? await updateAthleteAtEvent(
                    athletAtEventToEdit,
                    values,
                    contingentAtEvent
                  )
                : await addAthleteAtEvent(values, contingentAtEvent);

              dispatch(addAthletesAtEventsRedux([athleteAtEvent]));
              dispatch(
                addContingentAtEventsRedux({
                  contingentAtEvents: [contingentAtEvent],
                  championshipId: championship.id,
                })
              );
            } catch (error) {
              console.log(error);
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
                      name="athleteId"
                      formik={props}
                      options={athletes.map((item) => item.id)}
                      customOptionLabel={(id) => getAthleteById(id).name}
                    />
                    <InputText
                      label="Tinggi Badan"
                      name="height"
                      helperText="(CM)"
                      formik={props}
                      forceValue={
                        props.values.athleteId
                          ? getAthleteById(props.values.athleteId).height
                          : ""
                      }
                      forceDisabled
                      showOnEditOnly
                    />
                    <InputText
                      label="Tinggi Badan"
                      name="weight"
                      helperText="(CM)"
                      formik={props}
                      forceValue={
                        props.values.athleteId
                          ? getAthleteById(props.values.athleteId).weight
                          : ""
                      }
                      forceDisabled
                      showOnEditOnly
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
                        isRookeOnly(props.values.level)
                          ? matchSchema[0]
                          : undefined
                      }
                      forceDisabled={isRookeOnly(props.values.level)}
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
                  </div>
                </div>
                <Button type="submit" className="ml-auto">
                  Simpan
                </Button>
                <Button
                  type="button"
                  className="w-fit ml-auto mt-2"
                  onClick={() => {
                    console.log({ athleteAtEvents });
                    console.log(
                      reduceData(
                        [...athleteAtEvents, ...[props.values]],
                        "registrationId"
                      )
                    );
                  }}
                >
                  Test
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
