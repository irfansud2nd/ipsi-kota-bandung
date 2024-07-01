import CountDisplay from "@/components/ui/CountDisplay";
import { countAthleteByChampionshipId } from "@/lib/athlete/external/athleteActions";

const page = async ({ params }: { params: { championshipId: string } }) => {
  const matchCount = await countAthleteByChampionshipId(params.championshipId);
  return <CountDisplay title="Jumlah Atlet" count={matchCount} />;
};
export default page;
