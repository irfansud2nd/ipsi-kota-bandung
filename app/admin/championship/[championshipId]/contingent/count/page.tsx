import CountDisplay from "@/components/ui/CountDisplay";
import { countContingentAtEventByChampionshipId } from "@/lib/contingent/contingentActions";

const page = async ({ params }: { params: { championshipId: string } }) => {
  const contingentAtEventsCount = await countContingentAtEventByChampionshipId(
    params.championshipId
  );
  return (
    <CountDisplay title="Jumlah Kontingen" count={contingentAtEventsCount} />
  );
};
export default page;
