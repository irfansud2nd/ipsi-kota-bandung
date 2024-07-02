import EventForm from "@/components/admin/event/EventForm";
import Container from "@/components/ui/Container";
import PageInfo from "@/components/ui/PageInfo";
import { Event } from "@/lib/event/eventConstants";
import { SearchPageParams } from "@/lib/constants";
import { getEvent } from "@/lib/event/eventFunctions";

const page = async ({ searchParams }: { searchParams: SearchPageParams }) => {
  const id = searchParams.id;
  if (!id) return <PageInfo type="notFound" text="ID event tidak ditemukan" />;
  const event: Event = await getEvent(id);
  if (!event) return <PageInfo type="notFound" text="Event tidak ditemukan" />;
  return (
    <Container className="w-full h-full p-2 px-5 md:px-10">
      <h1 className="font-bold text-2xl border-b-2 mb-1 pb-1 w-full">
        Edit Event
      </h1>
      <EventForm eventToEdit={event} />
    </Container>
  );
};
export default page;
