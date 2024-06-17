import CountDisplay from "@/components/ui/CountDisplay";
import { countAthlete } from "@/lib/athlete/external/athleteActions";

const page = async () => {
  const athleteCount = await countAthlete();
  return <CountDisplay title="Jumlah Atlet" count={athleteCount} />;
};
export default page;
