import CountDisplay from "@/components/ui/CountDisplay";
import { countMatchByChampionshipId } from "@/lib/athlete/external/athleteActions";
import { fetchData } from "@/lib/functions";

const page = async ({ params }: { params: { championshipId: string } }) => {
  const matchCount = await fetchData(() =>
    countMatchByChampionshipId(params.championshipId)
  );

  return <CountDisplay title="Jumlah Pertandingan" count={matchCount} />;
};
export default page;
