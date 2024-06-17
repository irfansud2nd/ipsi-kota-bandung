import CountDisplay from "@/components/ui/CountDisplay";
import { countContingent } from "@/lib/contingent/contingentActions";

const page = async () => {
  const contingentCount = await countContingent();
  return <CountDisplay title="Jumlah Kontingen" count={contingentCount} />;
};
export default page;
