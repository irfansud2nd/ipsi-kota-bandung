import PagePagination from "@/components/ui/PagePagination";
import { Event } from "@/lib/event/eventConstants";
import { SearchPageParams } from "@/lib/constants";
import { getEvents } from "@/lib/event/eventFunctions";
import EventTable from "@/components/admin/event/EventTable";

const page = async ({ searchParams }: { searchParams: SearchPageParams }) => {
  const page = Number(searchParams.page) || 1;
  const limit = 10;

  const events: Event[] = await getEvents(page, limit);
  return (
    <div className="p-2">
      <h1 className="font-bold text-2xl mb-2">Kelola Event</h1>
      <EventTable events={events} />
      <PagePagination
        page={page}
        limit={limit}
        dataLength={events.length}
        link="event?"
        className="w-fit mr-0"
      />
    </div>
  );
};
export default page;
