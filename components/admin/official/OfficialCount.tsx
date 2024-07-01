import CountDisplay from "@/components/ui/CountDisplay";
import { countOfficial } from "@/lib/official/officialActions";

const OfficialCount = async () => {
  const officialCount = await countOfficial();
  return <CountDisplay title="Jumlah Official" count={officialCount} />;
};
export default OfficialCount;
