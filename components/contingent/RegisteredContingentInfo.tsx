"use client";
import { Button } from "../ui/button";
import { Championship } from "@/lib/event/eventConstants";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import useConfirmation from "@/hooks/useConfirmation";
import {
  deleteContingentAtEvent,
  getContingentConfirmationOption,
  registeredContinentToContingentAtEvent,
} from "@/lib/contingent/contingentFunctions";
import { deleteContingentAtEventRedux } from "@/lib/redux/championship/register/contingentSlice";
import { toast } from "sonner";
import { toastError } from "@/lib/form/formFunctions";
import HorizontalTable from "./HorizontalTable";
import { getTotalMatchCost } from "@/lib/athlete/external/athleteFunctions";
import { formatToRupiah } from "@/lib/functions";
import { deleteAllAthletesRedux } from "@/lib/redux/championship/register/athleteSlice";

const RegisteredContingentInfo = ({
  championship,
}: {
  championship: Championship;
}) => {
  const registeredContingent = useSelector(
    (state: RootState) => state.contingent.registered
  );
  const registeredAthletes = useSelector(
    (state: RootState) => state.athlete.registered
  );
  const athleteAtEvents = useSelector(
    (state: RootState) => state.athlete.athleteAtEvents
  );
  const officials = useSelector((state: RootState) => state.official.all);
  const payments = useSelector((state: RootState) => state.payment.all);

  const { confirm, ConfirmationDialog } = useConfirmation();
  const dispatch = useDispatch();

  if (!registeredContingent) return null;

  const handleUnregister = async () => {
    const result = await confirm(
      "Batalkan pendaftaran kontingen",
      getContingentConfirmationOption(payments.length > 0)
    );
    if (!result) return;
    const toastId = toast.loading("Membatalkan pendaftaran kontingen");
    try {
      const contingentAtEvent =
        registeredContinentToContingentAtEvent(registeredContingent);
      await deleteContingentAtEvent(contingentAtEvent);
      dispatch(deleteContingentAtEventRedux(contingentAtEvent));
      dispatch(deleteAllAthletesRedux());
      toast.success("Pndaftaran Kontingen berhasil dihapus", { id: toastId });
    } catch (error) {
      toastError(error, toastId);
    }
  };

  let data = [
    {
      key: "Athlete",
      value: registeredAthletes.length,
    },
    {
      key: "Official",
      value: officials.length,
    },
    {
      key: "Nomor Pertandingan",
      value: athleteAtEvents.length,
    },
    {
      key: "Tagihan",
      value: formatToRupiah(getTotalMatchCost(athleteAtEvents)),
    },
    {
      key: "Pembayaran",
      value: formatToRupiah(registeredContingent.payment_total),
    },
  ];

  return (
    <div className="flex flex-col gap-1">
      <ConfirmationDialog />
      <h2 className="font-medium text-xl text-center">
        Info {registeredContingent?.name} pada {championship.title}
      </h2>
      <Button
        variant={"destructive"}
        className="w-fit mx-auto"
        onClick={handleUnregister}
      >
        Batalkan Pendaftaran
      </Button>
      <HorizontalTable data={data} />
    </div>
  );
};
export default RegisteredContingentInfo;
