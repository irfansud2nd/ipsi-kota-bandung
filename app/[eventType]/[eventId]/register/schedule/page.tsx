import PageInfo from "@/components/ui/PageInfo";
import { getChampionship } from "@/lib/event/eventFunctions";
import { notFound } from "next/navigation";

const page = ({ params }: { params: { eventId: string } }) => {
  const championship = getChampionship(params.eventId);
  if (!championship) return notFound();

  if (Date.now() <= championship.date_start)
    return (
      <PageInfo
        type="sorry"
        text="Jadwal pertandingan akan di tampilkan pada saat pertandingan berlangsung"
      />
    );

  return <PageInfo type="underDevelopment" />;
};
export default page;
