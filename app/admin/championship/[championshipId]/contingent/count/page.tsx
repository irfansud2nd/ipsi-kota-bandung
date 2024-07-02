import CountDisplay from "@/components/ui/CountDisplay";
import { countContingentAtEventByChampionshipId } from "@/lib/contingent/contingentActions";
import { fetchData } from "@/lib/functions";

const page = async ({ params }: { params: { championshipId: string } }) => {
  const contingentAtEventsCount = await fetchData(() =>
    countContingentAtEventByChampionshipId(params.championshipId)
  );

  return (
    <CountDisplay title="Jumlah Kontingen" count={contingentAtEventsCount} />
  );
};
export default page;
