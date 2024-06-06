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
import { addContingent } from "@/lib/contingent/contingentFunctions";
import { useDispatch } from "react-redux";
import { useState } from "react";
import {
  addContingentAtEventsRedux,
  setUnregisteredContingent,
} from "@/lib/redux/championship/register/contingentSlice";

type Props = {
  contingentToEdit?: Contingent;
  championshipId: string;
};

const ContingentForm = ({ contingentToEdit, championshipId }: Props) => {
  const [open, setOpen] = useState(false);

  const session = useSession();
  const dispatch = useDispatch();

  const initialValue: Contingent = {
    ...contingentInitialValue,
    createdBy: session.data?.user?.email || "",
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Tambah Kontingen</Button>
      </DialogTrigger>
      <DialogContent className="w-fit">
        <Formik
          onSubmit={(values, { resetForm, setSubmitting }) => {
            if (contingentToEdit?.id) {
            } else {
              addContingent(values, championshipId)
                .then(({ contingent, contingentAtEvent }) => {
                  dispatch(
                    setUnregisteredContingent(contingent),
                    contingentAtEvent &&
                      addContingentAtEventsRedux({
                        contingentAtEvents: [contingentAtEvent],
                        championshipId,
                      })
                  );
                  setOpen(false);
                })
                .finally(() => {
                  resetForm();
                  setSubmitting(false);
                });
            }
          }}
          initialValues={contingentToEdit ?? initialValue}
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
