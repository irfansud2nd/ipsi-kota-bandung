import { baseUrl } from "@/lib/constants";
import { championships } from "@/lib/event/eventConstants";
import { getEvents, getNewsArr } from "@/lib/serverFunctions";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const events = await getEvents();
  const newsArr = await getNewsArr();

  const eventEntries: MetadataRoute.Sitemap = events.map((event) => ({
    url: `${baseUrl}/event/${event.id}`,
  }));
  const newsEntries: MetadataRoute.Sitemap = newsArr.map((news) => ({
    url: `${baseUrl}/news/${news.id}`,
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
      ...newsEntries,
    },
    {
      url: baseUrl + "/profile",
    },
  ];
}
