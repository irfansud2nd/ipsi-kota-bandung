import EventList from "@/components/event/EventList";
import Container from "@/components/ui/Container";
import PagePagination from "@/components/ui/PagePagination";
import { getChampionships } from "@/lib/event/eventFunctions";

const page = ({ searchParams }: { searchParams: { page: string } }) => {
  const limit = 6;
  const page = Number(searchParams.page) || 1;
  const events = getChampionships(page, limit);
  return (
    <div className="py-2">
      <EventList events={events} championship onAdmin />
      <PagePagination
        page={page}
        limit={limit}
        dataLength={events.length}
        link={`championship?`}
        className="mt-5 md:justify-end md:px-10"
      />
    </div>
  );
};
export default page;
