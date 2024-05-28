import EventDisplay from "@/components/Event/EventDisplay";
import Container from "@/components/ui/Container";
import { getEvent, getEvents } from "@/lib/serverFunctions";
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
import { getChampionships } from "@/lib/event/eventFunctions";
import Link from "next/link";
import EventCard from "@/components/Event/EventCard";
import { Championship, Event } from "@/lib/event/eventConstants";

type Props = {
  params: { eventId: string; eventType: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = await getEvent(params.eventId);
  return {
    title: event.title,
    description: `Dapatkan informasi tentang ${event.title} disini`,
    openGraph: {
      images: [
        {
          url: event.image.downloadUrl,
        },
      ],
    },
  };
}

const page = async ({ params }: Props) => {
  const event = await getEvent(params.eventId);
  const isChampionship = params.eventType == "championship";
  const events = isChampionship
    ? getChampionships(1, 6, event)
    : await getEvents(1, 6);

  if (!event) return notFound();

  return (
    <Container className="px-5 md:px-10 py-5">
      <EventDisplay event={event} />

      {events.length > 0 && (
        <div className={`py-2 mt-4 border-t-2`}>
          <Link
            className="text-xl font-semibold hover:text-green-500 transition"
            href={isChampionship ? "/championship" : "/event"}
          >
            {isChampionship ? "Kejuaraan" : "Event"} Lainnya
          </Link>
          <Carousel className="mx-5 md:mx-10">
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
