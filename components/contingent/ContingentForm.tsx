"use client";
import { Form, Formik, FormikProps } from "formik";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "../ui/dialog";
import {
  Contingent,
  contingentInitialValue,
  contingentSchema,
} from "@/lib/contingent/contingentConstants";
import InputText from "../inputs/InputText";
import { useSession } from "next-auth/react";
import {
  addContingentAndRegister,
  updateContingent,
} from "@/lib/contingent/contingentFunctions";
import { useDispatch } from "react-redux";
import { useState } from "react";
import {
  addContingentAtEventsRedux,
  setUnregisteredContingent,
  updateContingentRedux,
} from "@/lib/redux/championship/register/contingentSlice";
import { toast } from "sonner";
import { toastError } from "@/lib/form/formFunctions";
import { changeAthleteContingentNameRedux } from "@/lib/redux/championship/register/athleteSlice";
import { changeOfficialContingentNameRedux } from "@/lib/redux/championship/register/officialSlice";

type Props = {
  contingentToEdit?: Contingent;
  championshipId: string;
  locked: boolean;
};

const ContingentForm = ({
  contingentToEdit,
  championshipId,
  locked,
}: Props) => {
  const [open, setOpen] = useState(false);

  const session = useSession();
  const dispatch = useDispatch();

  const initialValue: Contingent = {
    ...contingentInitialValue,
    created_by: session.data?.user?.email || "",
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {!locked && (
          <Button className="w-fit" disabled={locked}>
            {contingentToEdit ? "Edit" : "Tambah"} Kontingen
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-fit">
        <Formik
          onSubmit={async (values, { resetForm, setSubmitting }) => {
            if (locked) return;
            const toastId = toast.loading(
              `${contingentToEdit ? "Memperbaharui" : "Mendaftarkan"} Kontingen`
            );
            try {
              if (contingentToEdit) {
                const contingent = await updateContingent(values);
                dispatch(updateContingentRedux(contingent));
                dispatch(changeAthleteContingentNameRedux(contingent.name));
                dispatch(changeOfficialContingentNameRedux(contingent.name));
              } else {
                const { contingent, contingentAtEvents } =
                  await addContingentAndRegister(values, championshipId);
                dispatch(setUnregisteredContingent(contingent));
                dispatch(
                  addContingentAtEventsRedux({
                    contingentAtEvents,
                    championshipId,
                  })
                );
              }
              toast.success(
                `Kontingent berhasil di ${
                  contingentToEdit ? "perbaharui" : "daftarkan"
                }`,
                { id: toastId }
              );
              resetForm();
              setOpen(false);
            } catch (error) {
              toastError(error, toastId);
            }
          }}
          initialValues={contingentToEdit ? contingentToEdit : initialValue}
          validationSchema={contingentSchema}
        >
          {(props: FormikProps<Contingent>) => (
            <Form className="flex flex-col gap-2 ">
              <InputText name="name" label="Nama Kontingen" formik={props} />
              <DialogFooter>
                <Button
                  type="submit"
                  variant="default"
                  disabled={props.isSubmitting}
                >
                  Simpan
                </Button>
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={props.isSubmitting}
                    //   onClick={() => handleCancel(props.resetForm)}
                  >
                    Batal
                  </Button>
                </DialogClose>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};
export default ContingentForm;
