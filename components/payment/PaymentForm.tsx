"use client";

import {
  AthleteAtEvent,
  MatchBased,
} from "@/lib/athlete/external/athleteConstants";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Form, Formik, FormikProps } from "formik";
import { useState } from "react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { RegisteredContingent } from "@/lib/contingent/contingentConstants";
import {
  Payment,
  paymentInitialValue,
  paymentSchema,
} from "@/lib/payment/paymentConstants";
import { addPayment } from "@/lib/payment/paymentFunctions";
import { addPaymentsRedux } from "@/lib/redux/championship/register/paymentSlice";
import {
  getTotalMatchCost,
  matchBasedToAthleteAtEvent,
  updateAthleteAtEvents,
} from "@/lib/athlete/external/athleteFunctions";
import InputText from "../inputs/InputText";
import { formatToRupiah } from "@/lib/functions";
import CopyButton from "../ui/CopyButton";
import InputFile from "../inputs/InputFile";
import { addAthletesAtEventsRedux } from "@/lib/redux/championship/register/athleteSlice";

const PaymentForm = ({
  selectedMatchBaseds,
}: {
  selectedMatchBaseds: MatchBased[];
}) => {
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  const registeredContingent = useSelector(
    (state: RootState) => state.contingent.registered
  ) as RegisteredContingent;

  let initialValue: Payment = {
    ...paymentInitialValue,
    total: getTotalMatchCost(selectedMatchBaseds),
    contingent_id: registeredContingent.id,
    contingent_name: registeredContingent.name,
    contingent_registration_id: registeredContingent.registration_id,
    championship_id: registeredContingent.championship_id,
  };

  const getUniqueTotal = (phoneNumber: string) => {
    let last3digit = phoneNumber
      .substring(phoneNumber.length - 3)
      .padStart(3, "0");
    const result =
      (getTotalMatchCost(selectedMatchBaseds) / 1000).toString() + last3digit;
    return Number(result);
  };

  const fillAthleteAtEventsPaymentId = (paymentId: string) => {
    const result: AthleteAtEvent[] = selectedMatchBaseds.map((matchBased) => ({
      ...matchBasedToAthleteAtEvent(matchBased),
      payment_id: paymentId,
    }));
    return result;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild disabled={!selectedMatchBaseds.length}>
        <Button>Bayar</Button>
      </DialogTrigger>
      <DialogContent>
        <Formik
          initialValues={initialValue}
          onSubmit={async (values, { resetForm }) => {
            try {
              const payment = await addPayment(values);
              const updatedAthleteAtEvents = fillAthleteAtEventsPaymentId(
                payment.id
              );
              await updateAthleteAtEvents(updatedAthleteAtEvents);
              dispatch(addPaymentsRedux([payment]));
              dispatch(addAthletesAtEventsRedux(updatedAthleteAtEvents));
              resetForm();
            } catch (error) {
              // console.log("ERRROR", error);
            } finally {
            }
          }}
          validationSchema={paymentSchema}
        >
          {(props: FormikProps<Payment>) => {
            return (
              <Form className="flex flex-col">
                <InputText
                  label="Nomor Telepon"
                  name="phone_number"
                  formik={props}
                />
                <div className="flex gap-1 items-center">
                  <InputText
                    label="Total pembayaran"
                    name="unique_total"
                    formik={props}
                    displayOnly={{
                      state: true,
                      value: formatToRupiah(
                        getUniqueTotal(props.values.phone_number)
                      ),
                    }}
                    className="flex-1"
                  />
                  <CopyButton
                    text={getUniqueTotal(props.values.phone_number)}
                  />
                </div>
                <InputFile
                  label="Bukti pembayaran"
                  name="image"
                  formik={props}
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
export default PaymentForm;
