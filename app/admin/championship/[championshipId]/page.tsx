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
import { getChampionship, getChampionships } from "@/lib/event/eventFunctions";
import Link from "next/link";
import EventCard from "@/components/Event/EventCard";
import { baseUrl } from "@/lib/constants";

type Props = {
  params: { championshipId: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   const cahampionship = getChampionship(params.championshipId)

//   return {
//     title: cahampionship ? cahampionship.title : "Tidak ditemukan",
//     description: cahampionship
//       ? `Dapatkan informasi tentang ${event.title} dari IPSI Kota Bandung disini`
//       : "Tidak ditemukan",
//     openGraph: event
//       ? {
//           images: [
//             {
//               url:
//                 params.eventType == "championship"
//                   ? baseUrl + event.image.downloadUrl
//                   : event.image.downloadUrl,
//             },
//           ],
//         }
//       : null,
//   };
// }

const page = async ({ params }: Props) => {
  const championship = getChampionship(params.championshipId);

  if (!championship) return notFound();

  return <EventDisplay event={championship} />;
};
export default page;
