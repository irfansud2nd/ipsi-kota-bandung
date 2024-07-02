import CountDisplay from "@/components/ui/CountDisplay";
import { fetchData } from "@/lib/functions";
import { countOfficial } from "@/lib/official/officialActions";

const OfficialCount = async () => {
  const officialCount = await fetchData(() => countOfficial());

  return <CountDisplay title="Jumlah Official" count={officialCount} />;
};
export default OfficialCount;
