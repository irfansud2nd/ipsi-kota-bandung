"use client";

import { RootState } from "@/lib/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { toast } from "sonner";
import {
  addContingentAtEvent,
  deleteContingent,
  getContingentConfirmationOption,
} from "@/lib/contingent/contingentFunctions";
import {
  addContingentAtEventsRedux,
  deleteContingentRedux,
} from "@/lib/redux/championship/register/contingentSlice";
import { toastError } from "@/lib/form/formFunctions";
import { Championship } from "@/lib/event/eventConstants";
import ContingentForm from "./ContingentForm";
import { deleteFiles } from "@/lib/actions";
import { deleteAllAthletesRedux } from "@/lib/redux/championship/register/athleteSlice";
import { deleteAllOficialsRedux } from "@/lib/redux/championship/register/officialSlice";
import useConfirmation from "@/hooks/useConfirmation";
import HorizontalTable from "./HorizontalTable";
import { formatDate, getFileUrl } from "@/lib/functions";

const UnregisteredContingentInfo = ({
  championship,
}: {
  championship: Championship;
}) => {
  const unregisteredContingent = useSelector(
    (state: RootState) => state.contingent.unregistered
  );
  const registeredContingent = useSelector(
    (state: RootState) => state.contingent.registered
  );
  const athletes = useSelector((state: RootState) => state.athlete.all);
  const officials = useSelector((state: RootState) => state.official.all);
  const payments = useSelector((state: RootState) => state.payment.all);

  const dispatch = useDispatch();
  const { confirm, ConfirmationDialog } = useConfirmation();

  if (!unregisteredContingent) return null;

  const handleRegister = async () => {
    const toastId = toast.loading("Mendaftarkan kontingen ke kejuaraan");
    try {
      const contingentAtEvents = await addContingentAtEvent(
        unregisteredContingent,
        championship.id
      );
      dispatch(
        addContingentAtEventsRedux({
          contingentAtEvents,
          championshipId: championship.id,
        })
      );
      toast.success("Kontingen berhasil didaftarkan ke kejuaraan", {
        id: toastId,
      });
    } catch (error) {
      toastError(error, toastId);
    }
  };

  const handleDelete = async () => {
    const result = await confirm(
      "Hapus kontingen",
      getContingentConfirmationOption(payments.length > 0)
    );
    if (!result) return;
    const toastId = toast.loading("Menghapus kontingen");
    try {
      await deleteContingent(unregisteredContingent);
      const athleteFileUrls = athletes.map((athlete) =>
        getFileUrl("athlete", athlete.id)
      );
      const officialFileUrls = officials.map(
        (official) => getFileUrl("official", official.id).imageUrl
      );

      const { error: athleteImagesError } = await deleteFiles(
        athleteFileUrls.map((item) => item.imageUrl)
      );
      if (athleteImagesError) throw athleteImagesError;

      const { error: athleteKksError } = await deleteFiles(
        athleteFileUrls.map((item) => item.kkUrl)
      );
      if (athleteKksError) throw athleteKksError;

      const { error: officialImagesError } = await deleteFiles(
        officialFileUrls
      );
      if (officialImagesError) throw officialImagesError;

      dispatch(deleteContingentRedux());
      dispatch(deleteAllAthletesRedux());
      dispatch(deleteAllOficialsRedux());
      toast.success("Kontingen berhasil dihapus", { id: toastId });
    } catch (error) {
      toastError(error, toastId);
    }
  };

  let data = [
    {
      key: "Atlet",
      value: registeredContingent
        ? athletes.length
        : unregisteredContingent.athletes,
    },
    {
      key: "Official",
      value: registeredContingent
        ? officials.length
        : unregisteredContingent.officials,
    },
    {
      key: "Waktu Pendaftaran",
      value: formatDate(unregisteredContingent.created_at, {
        withoutHour: true,
      }),
    },
  ];

  return (
    <>
      <ConfirmationDialog />
      <h1 className="font-semibold text-center text-2xl flex-1">
        Selamat Datang Kontingen
        <span className="font-semibold"> {unregisteredContingent.name} </span>!
      </h1>
      <div className="flex gap-2 justify-center mt-2">
        <ContingentForm
          championshipId={championship.id}
          contingentToEdit={unregisteredContingent}
        />
        <Button variant={"destructive"} onClick={handleDelete}>
          Hapus Kontingen
        </Button>
      </div>
      <HorizontalTable data={data} />
      {!registeredContingent && (
        <div className="w-full flex flex-col bg-yellow-200 items-center rounded p-2 gap-2 my-2">
          <p className="font-medium text-center">
            Anda belum mendaftarkan kontingen {unregisteredContingent.name} pada
            kejuaraan
            {" " + championship.title}
          </p>
          <Button variant={"secondary"} onClick={handleRegister}>
            Daftarkan Kontingen
          </Button>
        </div>
      )}
    </>
  );
};
export default UnregisteredContingentInfo;
