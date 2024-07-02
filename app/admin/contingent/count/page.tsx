import CountDisplay from "@/components/ui/CountDisplay";
import { countContingent } from "@/lib/contingent/contingentActions";
import { fetchData } from "@/lib/functions";

const page = async () => {
  const contingentCount = await fetchData(() => countContingent());

  return <CountDisplay title="Jumlah Kontingen" count={contingentCount} />;
};
export default page;
