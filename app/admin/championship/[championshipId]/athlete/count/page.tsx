import CountDisplay from "@/components/ui/CountDisplay";
import { countAthleteByChampionshipId } from "@/lib/athlete/external/athleteActions";
import { fetchData } from "@/lib/functions";

const page = async ({ params }: { params: { championshipId: string } }) => {
  const matchCount = await fetchData(() =>
    countAthleteByChampionshipId(params.championshipId)
  );

  return (
    <div className="grid md:grid-cols-3 justify-center items-center">
      <CountDisplay
        title="Jumlah Atlet"
        count={matchCount.total}
        className="w-[200px]"
      />
      <CountDisplay
        title="Jumlah Atlet Pemula"
        count={matchCount.rookie}
        className="w-[200px]"
      />
      <CountDisplay
        title="Jumlah Atlet Prestasi"
        count={matchCount.pro}
        className="w-[200px]"
      />
    </div>
  );
};
export default page;
