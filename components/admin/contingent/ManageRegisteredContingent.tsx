"use client";

import { Button } from "@/components/ui/button";
import { RegisteredContingentAdmin } from "@/lib/contingent/contingentConstants";
import AdminManageButtons from "../AdminManageButtons";
import useConfirmation from "@/hooks/useConfirmation";
import { toast } from "sonner";
import {
  deleteContingent,
  deleteContingentAtEvent,
  registeredContinentToContingentAtEvent,
} from "@/lib/contingent/contingentFunctions";
import { toastError } from "@/lib/form/formFunctions";
import { apiProtect } from "@/lib/admin/adminActions";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { getChampionship } from "@/lib/event/eventFunctions";
import { isContingentEverPaid } from "@/lib/contingent/contingentActions";
import { getAthleteIdsByContingentId } from "@/lib/athlete/external/athleteActions";
import { fetchData, getFileUrl } from "@/lib/functions";
import { getOfficialIdsByContingentId } from "@/lib/official/officialActions";
import { deleteFiles } from "@/lib/actions";

type Props = {
  registeredContingentAdmin: RegisteredContingentAdmin;
};

const ManageRegisteredContingent = ({ registeredContingentAdmin }: Props) => {
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const { confirm, ConfirmationDialog } = useConfirmation();

  const handleDelete = () => {
    setOpen(true);
  };

  const deleteWholeContingent = async () => {
    let isPaid = registeredContingentAdmin.payment_total > 0;
    if (!isPaid) {
      // CHECK PAID ON ANOTHER CONTINGENT AT EVENT
      const { result, error } = await isContingentEverPaid(
        registeredContingentAdmin.id
      );

      if (error) {
        toastError(error);
        return;
      }

      isPaid = result;
    }

    let options = undefined;

    if (isPaid) {
      options = {
        message:
          "Kontingen yang sudah melakukan pembarayan tidak dapat dihapus",
        cancelLabel: "Baik",
        cancelOnly: true,
      };
    }

    const result = await confirm("Hapus Kontingen", options);

    if (!result) return;
    const toastId = toast.loading("Menghapus kontingen");
    try {
      toast.loading("Mengumpulkan informasi file atlet", { id: toastId });
      const athleteIds = await fetchData(() =>
        getAthleteIdsByContingentId(registeredContingentAdmin.id)
      );

      toast.loading("Mengumpulkan informasi file atlet", { id: toastId });
      const officialIds = await fetchData(() =>
        getOfficialIdsByContingentId(registeredContingentAdmin.id)
      );

      const athleteFileUrls = athleteIds.map((id) => getFileUrl("athlete", id));
      const officialImageUrls = officialIds.map(
        (id) => getFileUrl("official", id).imageUrl
      );

      toast.loading("Menghapus foto atlet", { id: toastId });
      const { error: athleteImageError } = await deleteFiles(
        athleteFileUrls.map((item) => item.imageUrl)
      );
      if (athleteImageError) throw athleteImageError;

      toast.loading("Menghapus KK atlet", { id: toastId });
      const { error: athleteKkError } = await deleteFiles(
        athleteFileUrls.map((item) => item.kkUrl)
      );
      if (athleteKkError) throw athleteKkError;

      toast.loading("Menghapus foto official", { id: toastId });
      const { error: officialFileError } = await deleteFiles(officialImageUrls);
      if (officialFileError) throw officialFileError;

      toast.loading("Menghapus kontingen", { id: toastId });
      await deleteContingent(registeredContingentAdmin);

      toast.success("Kontingen berhasil dihapus", { id: toastId });

      router.refresh();
    } catch (error) {
      toastError(error, toastId);
    }
  };

  const unregisterContingent = async () => {
    const isPaid = registeredContingentAdmin.payment_total > 0;
    let options = undefined;

    if (isPaid) {
      options = {
        message:
          "Kontingen yang sudah melakukan pembarayan tidak dapat dihapus",
        cancelLabel: "Baik",
        cancelOnly: true,
      };
    }

    const result = await confirm("Hapus Kontingen", options);
    if (!result) return;

    const toastId = toast.loading("Menghapus Kontingen");
    try {
      const response = await apiProtect({
        permittedEmail: registeredContingentAdmin.created_by,
      });
      if (response) throw response;

      await deleteContingentAtEvent(
        registeredContinentToContingentAtEvent(registeredContingentAdmin)
      );

      toast.success("Pendaftaran Kontingen berhasil dihapus", {
        id: toastId,
      });
      router.refresh();
    } catch (error) {
      toastError(toast);
    }
  };

  return (
    <>
      <ConfirmationDialog />
      <AdminManageButtons handleDelete={handleDelete} />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex gap-1 justify-center flex-wrap">
          <Button
            className="w-fit"
            variant={"destructive"}
            onClick={deleteWholeContingent}
          >
            Hapus Kontingen
          </Button>
          <Button
            className="w-fit"
            variant={"destructive"}
            onClick={unregisterContingent}
          >
            Hapus Kontingen dari{" "}
            {getChampionship(registeredContingentAdmin.championship_id)?.title}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default ManageRegisteredContingent;
