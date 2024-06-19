"use server";
import EventList from "@/components/Event/EventList";
import NewsList from "@/components/news/NewsList";
import HomeBanner from "@/components/home/HomeBanner";
import HomeMenu from "@/components/home/HomeMenu";
import Announcement from "@/components/home/Announcement";
import { championships } from "@/lib/event/eventConstants";
import { getEvents, getNewsArr } from "@/lib/actions";
import OngoingChampionships from "@/components/championship/OngoingChampionships";
import HomeDialog from "@/components/home/HomeDialog";

export default async function Home() {
  const events = await getEvents(1, 3);
  const newsArr = await getNewsArr(1, 6);
  return (
    <div className="w-full h-full">
      <HomeBanner />
      {/* <HomeDialog /> */}
      <OngoingChampionships />
      <HomeMenu />
      <Announcement />
      <NewsList newsArr={newsArr} onHome />
      <EventList events={championships} onHome championship />
      <EventList events={events} onHome />
    </div>
  );
}
