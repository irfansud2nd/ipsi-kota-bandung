import { DataTable } from "@/components/ui/DataTable";
import PagePagination from "@/components/ui/PagePagination";
import { Event } from "@/lib/event/eventConstants";
import { SearchPageParams } from "@/lib/constants";
import { EventColumns } from "@/components/admin/event/EventColumns";
import { getEvents } from "@/lib/serverFunctions";

const page = async ({ searchParams }: { searchParams: SearchPageParams }) => {
  const page = Number(searchParams.page) || 1;
  const limit = 3;
  const events: Event[] = await getEvents(page, limit);
  return (
    <div className="p-2">
      <div className="flex w-full">
        <h1 className="font-bold text-2xl mb-2">Kelola Event</h1>
        <PagePagination
          page={page}
          limit={limit}
          dataLength={events.length}
          className="mr-0 w-fit"
          link="/admin/event?"
        />
      </div>
      <DataTable columns={EventColumns} data={events} />
    </div>
  );
};
export default page;
