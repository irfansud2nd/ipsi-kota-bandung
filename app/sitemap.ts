import { championships } from "@/lib/event/eventConstants";
import { getEvents } from "@/lib/serverFunctions";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL as string;

  const events = await getEvents();
  const eventEntries: MetadataRoute.Sitemap = events.map((event) => ({
    url: `${baseUrl}/event/${event.id}`,
  }));
  const championshipEntries: MetadataRoute.Sitemap = championships.map(
    (championship) => ({
      url: `${baseUrl}/championship/${championship.id}`,
    })
  );

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: baseUrl + "/event",
    },
    ...eventEntries,
    {
      url: baseUrl + "/championship",
    },
    ...championshipEntries,
    {
      url: baseUrl + "/news",
    },
    {
      url: baseUrl + "/profile",
    },
  ];
}
