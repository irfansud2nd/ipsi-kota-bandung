"use client";
import { Championship } from "@/lib/event/eventConstants";
import { getChampionship } from "@/lib/event/eventFunctions";
import { useDispatch, useSelector } from "react-redux";
import InputText from "@/components/inputs/InputText";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Form, Formik, FormikProps } from "formik";
import { duplicateAthleteSchema } from "@/lib/athlete/external/athleteConstants";
import { RootState } from "@/lib/redux/store";
import { toastError } from "@/lib/form/formFunctions";
import { addAthletesRedux } from "@/lib/redux/championship/register/athleteSlice";
import { toast } from "sonner";
import { duplicateAthleteSql } from "@/lib/athlete/external/athleteActions";
import { athleteSqlToAthlete } from "@/lib/athlete/external/athleteFunctions";

type FormType = {
  id: string;
};

const DuplicateAthleteForm = ({
  championshipId,
}: {
  championshipId: string;
}) => {
  const dispatch = useDispatch();

  const contingent = useSelector(
    (state: RootState) => state.contingent.unregistered
  );

  const initialValue = { id: "" };

  const championship = getChampionship(championshipId) as Championship;

  let disableAdd = Date.now() > championship.register.end;

  if (disableAdd) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Muat Atlet</Button>
      </DialogTrigger>
      <DialogContent>
        <Formik
          initialValues={initialValue}
          onSubmit={async (values, { resetForm }) => {
            if (!contingent) {
              toastError("Daftarkan kontingen terlebih dahulu");
              return;
            }
            const toastId = toast.loading("Menduplikasi atlet");
            try {
              const { result: athleteSql, error } = await duplicateAthleteSql(
                values.id,
                contingent.id,
                contingent.name
              );

              if (error) throw error;
              resetForm();

              toast.success("Atlet berhasil di duplikasi", { id: toastId });

              dispatch(addAthletesRedux([athleteSqlToAthlete(athleteSql)]));
            } catch (error) {
              toastError(error, toastId);
            } finally {
            }
          }}
          validationSchema={duplicateAthleteSchema}
        >
          {(props: FormikProps<FormType>) => {
            return (
              <Form className="flex flex-col">
                <InputText
                  label="ID Atlet"
                  name="id"
                  formik={props}
                  championshipId={championshipId}
                  showOnEditOnly
                />
                <Button type="submit" className="ml-auto">
                  Muat
                </Button>
              </Form>
            );
          }}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};
export default DuplicateAthleteForm;
