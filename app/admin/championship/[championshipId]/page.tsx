import EventDisplay from "@/components/event/EventDisplay";
import { notFound } from "next/navigation";
import React from "react";
import { getChampionship } from "@/lib/event/eventFunctions";
import ChampionshipMenuAdmin from "@/components/admin/ChampionshipMenuAdmin";

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

  return (
    <div>
      <EventDisplay event={championship} />
      <ChampionshipMenuAdmin onPage />
    </div>
  );
};
export default page;
