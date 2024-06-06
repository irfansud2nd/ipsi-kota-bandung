import EventList from "@/components/Event/EventList";
import Container from "@/components/ui/Container";
import PageBanner from "@/components/ui/PageBanner";
import PagePagination from "@/components/ui/PagePagination";
import { getChampionships } from "@/lib/event/eventFunctions";
import { getEvents } from "@/lib/serverFunctions";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  searchParams: { page: string };
  params: { eventType: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const title =
    params.eventType == "event"
      ? "Event"
      : params.eventType == "championship"
      ? "Kejuaraan"
      : "Tidak ditemukan";
  return {
    title,
    description:
      title == "Tidak ditemukan"
        ? undefined
        : `Kumpulan ${title} IPSI Kota Bandung`,
  };
}

const page = async ({ searchParams, params }: Props) => {
  const { eventType } = params;
  if (!["event", "championship"].includes(eventType)) return notFound();

  const limit = 6;
  const page = Number(searchParams.page) || 1;
  const events =
    eventType == "event"
      ? await getEvents(page, limit)
      : getChampionships(page, limit);
  return (
    <div>
      <PageBanner
        imgUrl="/images/home-banner-people.jpg"
        title={eventType == "championship" ? "Kejuaraan" : "Event"}
        className="text-white"
        text="IPSI Kota Bandung"
      />
      <div className="bg-white rounded-t-[50px] -mt-10 pt-10 pb-5 w-full">
        <Container className="px-5 md:px-10 h-full">
          <EventList
            events={events}
            championship={eventType == "championship"}
          />
          <PagePagination
            page={page}
            limit={limit}
            dataLength={events.length}
            link={`/${eventType}?`}
            className="mt-5 md:justify-end md:px-10"
          />
        </Container>
      </div>
    </div>
  );
};
export default page;
