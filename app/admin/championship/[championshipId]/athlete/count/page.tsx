import CountDisplay from "@/components/ui/CountDisplay";
import { countAthleteByChampionshipId } from "@/lib/athlete/external/athleteActions";
import { fetchData } from "@/lib/functions";

const page = async ({ params }: { params: { championshipId: string } }) => {
  const matchCount = await fetchData(() =>
    countAthleteByChampionshipId(params.championshipId)
  );

  return <CountDisplay title="Jumlah Atlet" count={matchCount} />;
};
export default page;
