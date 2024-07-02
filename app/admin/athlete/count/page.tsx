import CountDisplay from "@/components/ui/CountDisplay";
import { countAthlete } from "@/lib/athlete/external/athleteActions";
import { fetchData } from "@/lib/functions";

const page = async () => {
  const athleteCount = await fetchData(() => countAthlete());

  return <CountDisplay title="Jumlah Atlet" count={athleteCount} />;
};
export default page;
