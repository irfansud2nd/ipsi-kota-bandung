import CountDisplay from "@/components/ui/CountDisplay";
import { countMatchByChampionshipId } from "@/lib/athlete/external/athleteActions";
import { fetchData } from "@/lib/functions";

const page = async ({ params }: { params: { championshipId: string } }) => {
  const matchCount = await fetchData(() =>
    countMatchByChampionshipId(params.championshipId)
  );

  return (
    <div className="grid md:grid-cols-3 justify-center items-center">
      <CountDisplay
        title="Jumlah Pertandingan"
        count={matchCount.total}
        className="w-[250px]"
      />
      <CountDisplay
        title="Jumlah Pertandingan Pemula"
        count={matchCount.rookie}
        className="w-[250px]"
      />
      <CountDisplay
        title="Jumlah Pertandingan Prestasi"
        count={matchCount.pro}
        className="w-[250px]"
      />
    </div>
  );
};
export default page;
