"use client";
import OptionButton from "@/components/ui/OptionButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useConfirmation from "@/hooks/useConfirmation";
import { moveToRookie } from "@/lib/athlete/external/athleteActions";

import { MatchBased } from "@/lib/athlete/external/athleteConstants";
import {
  deleteAthleteAtEvent,
  matchBasedToAthleteAtEvent,
} from "@/lib/athlete/external/athleteFunctions";
import { toastError } from "@/lib/form/formFunctions";
import { toast } from "sonner";

type Props = { matchBased: MatchBased };

const ManageMatchBased = ({ matchBased }: Props) => {
  const { confirm, ConfirmationDialog } = useConfirmation();

  const handleMoveToRookie = async () => {
    const result = await confirm("Pindahkan ke Pemula");
    if (!result) return;

    const toastId = toast.loading("Memperbaharui pertandingan");

    try {
      const { error } = await moveToRookie(matchBased.registration_id);
      if (error) throw error;

      toast.success("Pertandingan berhasil diperbaharui", { id: toastId });
    } catch (error) {
      toastError(error, toastId);
    }
  };

  const handeDelete = async () => {
    const paid = matchBased.payment_id;
    const message = paid
      ? "Pertandingan yang sudah dibayar tidak dapat dihapus."
      : "Apakah anda yakin?";
    const options = paid
      ? { cancelLabel: "Baik", cancelOnly: true }
      : undefined;
    const result = await confirm("Hapus Pertandingan", {
      message,
      ...options,
    });
    if (!result) return;
    const toastId = toast.loading("Menghapus pertandingan");
    try {
      const athleteAtEvent = matchBasedToAthleteAtEvent(matchBased);
      await deleteAthleteAtEvent(athleteAtEvent);

      toast.success("Pertandingan berhasil dihapus", { id: toastId });
    } catch (error) {
      toastError(error, toastId);
    }
  };
  return (
    <>
      <ConfirmationDialog />
      <DropdownMenu>
        <DropdownMenuTrigger>
          <OptionButton />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleMoveToRookie}>
            Pindahkan ke Pemula
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handeDelete} className="text-destructive">
            Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
export default ManageMatchBased;
