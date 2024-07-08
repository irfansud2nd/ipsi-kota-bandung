"use client";

import useConfirmation from "@/hooks/useConfirmation";
import { Event } from "@/lib/event/eventConstants";
import { deleteEvent } from "@/lib/event/eventFunctions";
import { useRouter } from "next/navigation";
import AdminManageButtons from "../AdminManageButtons";

const ManageEvent = ({ event }: { event: Event }) => {
  const router = useRouter();
  const { confirm, ConfirmationDialog } = useConfirmation();

  const handleDelete = async () => {
    const result = await confirm("Hapus event");
    if (result) {
      try {
        await deleteEvent(event);
        router.refresh();
      } catch (error) {
        throw error;
      }
    }
  };

  return (
    <>
      <ConfirmationDialog />
      <AdminManageButtons
        show={{
          label: "Lihat Event",
          url: `/event/${event.id}?title=${event.title}`,
        }}
        edit={{
          url: `/admin/event/edit?id=${event.id}`,
        }}
        handleDelete={handleDelete}
      />
    </>
  );
};
export default ManageEvent;
