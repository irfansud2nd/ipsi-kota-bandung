import EventDisplay from "@/components/Event/EventDisplay";
import Container from "@/components/ui/Container";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  getChampionship,
  getChampionships,
  getEvent,
  getEvents,
} from "@/lib/event/eventFunctions";
import Link from "next/link";
import EventCard from "@/components/Event/EventCard";
import { baseUrl } from "@/lib/constants";

type Props = {
  params: { eventId: string; eventType: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event =
    params.eventType == "championship"
      ? getChampionship(params.eventId)
      : await getEvent(params.eventId);

  return {
    title: event ? event.title : "Tidak ditemukan",
    description: event
      ? `Dapatkan informasi tentang ${event.title} dari IPSI Kota Bandung disini`
      : "Tidak ditemukan",
    openGraph: event
      ? {
          images: [
            {
              url:
                params.eventType == "championship"
                  ? baseUrl + event.image.downloadUrl
                  : event.image.downloadUrl,
            },
          ],
        }
      : null,
  };
}

const page = async ({ params }: Props) => {
  const isChampionship = params.eventType == "championship";
  const event = isChampionship
    ? getChampionship(params.eventId)
    : await getEvent(params.eventId);
  const events = isChampionship
    ? getChampionships(1, 6, event)
    : await getEvents(1, 6, event);

  if (!event) return notFound();

  return (
    <Container className="px-5 md:px-10 py-5">
      <EventDisplay event={event} />
      {events.length > 0 && (
        <div className={`mt-4 bg-muted rounded p-2`}>
          <Link
            className="text-xl font-semibold hover:text-green-500 transition ml-14"
            href={isChampionship ? "/championship" : "/event"}
          >
            {isChampionship ? "Kejuaraan" : "Event"} Lainnya
          </Link>
          <Carousel className="mx-12 mt-4 px-2">
            <CarouselContent>
              {events.map((event) => (
                <CarouselItem className="basis-full md:basis-1/2 lg:basis-1/3">
                  <EventCard event={event} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      )}
    </Container>
  );
};
export default page;
