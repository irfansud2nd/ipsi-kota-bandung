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
import {
  addPayment,
  getUniquePaymentTotal,
} from "@/lib/payment/paymentFunctions";
import { addPaymentsRedux } from "@/lib/redux/championship/register/paymentSlice";
import {
  checkAthleteAtEventsLimited,
  getTotalMatchCost,
  matchBasedToAthleteAtEvent,
  updateAthleteAtEvents,
} from "@/lib/athlete/external/athleteFunctions";
import InputText from "../inputs/InputText";
import { formatDate, formatToRupiah } from "@/lib/functions";
import CopyButton from "../ui/CopyButton";
import InputFile from "../inputs/InputFile";
import { addAthletesAtEventsRedux } from "@/lib/redux/championship/register/athleteSlice";
import BankLogo from "../ui/BankLogo";
import { getChampionship } from "@/lib/event/eventFunctions";
import { Championship } from "@/lib/event/eventConstants";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa6";
import { toastError } from "@/lib/form/formFunctions";
import DisplayText from "../inputs/DisplayText";

const PaymentForm = ({
  selectedMatchBaseds,
}: {
  selectedMatchBaseds: MatchBased[];
}) => {
  const [open, setOpen] = useState(false);
  const [isSent, setIsSent] = useState<Payment | undefined>();

  const dispatch = useDispatch();

  const registeredContingent = useSelector(
    (state: RootState) => state.contingent.registered
  ) as RegisteredContingent;
  const matchBaseds = useSelector(
    (state: RootState) => state.athlete.matchBased
  );

  const championship = getChampionship(
    registeredContingent.championship_id
  ) as Championship;

  let initialValue: Payment = {
    ...paymentInitialValue,
    total: getTotalMatchCost(selectedMatchBaseds),
    contingent_id: registeredContingent.id,
    contingent_name: registeredContingent.name,
    contingent_registration_id: registeredContingent.registration_id,
    championship_id: championship.id,
  };

  const fillAthleteAtEventsPaymentId = (paymentId: string) => {
    const result: AthleteAtEvent[] = selectedMatchBaseds.map((matchBased) => ({
      ...matchBasedToAthleteAtEvent(matchBased),
      payment_id: paymentId,
    }));
    return result;
  };

  const toggleDialog = (state: boolean) => {
    setOpen(state);
    if (!state && isSent) {
      setIsSent(undefined);
    }
  };

  const genereteText = (payment: Payment) => {
    let result = {
      text: `Halo Admin,
Saya perwakilan dari kontingen ${payment.contingent_name},
ingin melakukan konfirmasi pembayaran atlet untuk pendaftaran ${
        championship.title
      }, 
berikut adalah Informasi tentang pembayaran saya:
ID: ${payment.id}
Total Pembayaran: ${formatToRupiah(payment.total)}
Waktu Pembayaran: ${formatDate(payment.created_at)}
Bukti Pembayaran: ${payment.image.downloadUrl}
Terimakasih.`,
      message: "",
    };

    let message = result.text.trim();
    message = encodeURIComponent(message);
    message = `https://wa.me/${championship.payment.contact.phoneNumber}?text=${message}`;
    result.message = message;

    return result;
  };

  const getMatchBasedRegistrationId = (regId: number) => {
    return selectedMatchBaseds.find(
      (item) => item.registration_id == regId
    ) as MatchBased;
  };

  return (
    <Dialog open={open} onOpenChange={toggleDialog}>
      <DialogTrigger asChild disabled={!selectedMatchBaseds.length}>
        <Button>Bayar</Button>
      </DialogTrigger>
      <DialogContent>
        {isSent ? (
          <div className="w-fit mx-auto">
            <p>Konfirmasi pembayaran ke</p>
            <div className="flex flex-col md:flex-row gap-x-3 gap-y-1">
              <div className="flex flex-col gap-1 items-center ">
                <div className="border rounded p-2 flex flex-col gap-2 items-center">
                  <p className="font-semibold">
                    {championship.payment.contact.name}
                  </p>
                  <div className="flex gap-1 items-center">
                    <p>{championship.payment.contact.phoneNumber}</p>
                    <CopyButton
                      text={championship.payment.contact.phoneNumber}
                    />
                  </div>
                  <p className="text-center ">
                    Ikuti format pesan atau klik tombol dibawah ini
                  </p>
                  <Button asChild>
                    <Link
                      href={genereteText(isSent).message}
                      target="_blank"
                      className="flex items-center gap-2"
                    >
                      <FaWhatsapp className="size-6" />
                      Konfirmasi
                    </Link>
                  </Button>
                </div>
                <div className="w-full h-full flex flex-col justify-around items-center border rounded">
                  <p className="font-semibold">Grup Official</p>
                  <Button asChild>
                    <Link
                      href={championship.officialGroupLink}
                      target="_blank"
                      className="flex items-center gap-2"
                    >
                      <FaWhatsapp className="size-6" />
                      Grup Official
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="border rounded p-2">
                <div className="flex items-center gap-2">
                  <p className="font-semibold">Format Pesan</p>
                  <CopyButton text={genereteText(isSent).text} />
                </div>
                <p className="break-words max-w-[75vw]">
                  Halo Admin,
                  <br />
                  Saya perwakilan dari kontingen {isSent.contingent_name}, ingin
                  melakukan konfirmasi pembayaran atlet untuk pendaftaran{" "}
                  {championship.title}, berikut adalah Informasi tentang
                  pembayaran saya pembayaran saya:
                  <br />
                  ID : {isSent.id}
                  <br />
                  Total Pembayaran : {formatToRupiah(isSent.total)}
                  <br />
                  Waktu Pembayaran : {formatDate(isSent.created_at)}
                  <br />
                  Bukti Pembayaran : {isSent.image.downloadUrl}
                  <br />
                  Terimakasih.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <Formik
            initialValues={initialValue}
            onSubmit={async (values, { resetForm }) => {
              try {
                const isLimit = await checkAthleteAtEventsLimited(
                  selectedMatchBaseds,
                  matchBaseds,
                  championship
                );

                if (isLimit) {
                  const matchBased = getMatchBasedRegistrationId(isLimit);
                  console.log("toast error");

                  toastError(
                    `Kategori yang dipilih oleh ${matchBased.name} yaitu ${matchBased.type} ${matchBased.schema} ${matchBased.category} ${matchBased.gender} telah penuh, silahkan pilih kategori lain atau keluarkan pertandingan tersebut dari pembayaran`
                  );

                  return;
                }

                const payment = await addPayment(values);
                const updatedAthleteAtEvents = fillAthleteAtEventsPaymentId(
                  payment.id
                );
                await updateAthleteAtEvents(updatedAthleteAtEvents);
                dispatch(addPaymentsRedux([payment]));
                dispatch(addAthletesAtEventsRedux(updatedAthleteAtEvents));
                resetForm();
                setIsSent(payment);
              } catch (error) {
              } finally {
              }
            }}
            validationSchema={paymentSchema}
          >
            {(props: FormikProps<Payment>) => {
              return (
                <Form className="flex flex-col">
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    <div>
                      <InputText
                        label="Nomor Telepon"
                        name="phone_number"
                        formik={props}
                      />
                      <div className="flex gap-1 items-end">
                        <DisplayText
                          label="Total pembayaran"
                          value={formatToRupiah(
                            getUniquePaymentTotal(
                              props.values.total,
                              props.values.phone_number
                            )
                          )}
                        />
                        <CopyButton
                          text={getUniquePaymentTotal(
                            getTotalMatchCost(selectedMatchBaseds),
                            props.values.phone_number
                          )}
                          className="mb-1"
                        />
                      </div>
                      <InputFile
                        label="Bukti pembayaran"
                        name="image"
                        formik={props}
                      />
                    </div>
                    <div className="p-2 border rounded md:mt-4 md:mx-2 flex flex-col">
                      <p>Pembayaran dilakukan melalui</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 place-items-center flex-1">
                        <BankLogo
                          bank={championship.payment.target.bank}
                          className="max-md:w-[70%]"
                        />
                        <div className="col-span-2 flex flex-col justify-around text-xl font-semibold  h-full text-center">
                          <p>{championship.payment.target.name}</p>
                          <div className="flex items-center gap-1 justify-center">
                            <p>{championship.payment.target.number}</p>
                            <CopyButton
                              text={championship.payment.target.number}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button type="submit" className="ml-auto">
                    Simpan
                  </Button>
                </Form>
              );
            }}
          </Formik>
        )}
      </DialogContent>
    </Dialog>
  );
};
export default PaymentForm;
