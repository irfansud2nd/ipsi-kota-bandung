import MatchBasedTable from "@/components/admin/athlete/external/MatchBasedTable";
import RegisteredContingentAdminTable from "@/components/admin/contingent/RegisteredContingentAdminTable";
import OfficialTable from "@/components/admin/official/OfficialTable";
import PaymentTable from "@/components/admin/payment/PaymentTable";
import RefreshButton from "@/components/ui/RefreshButton";
import { getMatchBasedsByContingentRegistrationId } from "@/lib/athlete/external/athleteActions";
import { getRegisteredContingentAdminByContingentId } from "@/lib/contingent/contingentActions";
import { getChampionship } from "@/lib/event/eventFunctions";
import { fetchData } from "@/lib/functions";
import { getOfficialsByContingentId } from "@/lib/official/officialFunctions";
import { getPaymentsByContingentRegistrationId } from "@/lib/payment/paymentActions";
import { notFound } from "next/navigation";

type Props = {
  params: {
    contingentId: string;
    championshipId: string;
  };
};

const page = async ({ params }: Props) => {
  const { contingentId, championshipId } = params;
  const championship = getChampionship(championshipId);

  if (!championship) return notFound();

  const registeredContingent = await fetchData(() =>
    getRegisteredContingentAdminByContingentId(contingentId, championshipId)
  );

  if (!registeredContingent) return notFound;

  const officials = await getOfficialsByContingentId(contingentId);
  const matchBaseds = await fetchData(() =>
    getMatchBasedsByContingentRegistrationId(
      registeredContingent.registration_id
    )
  );
  const payments = await fetchData(() =>
    getPaymentsByContingentRegistrationId(registeredContingent.registration_id)
  );

  return (
    <div>
      <div className="flex items-center border-b-2 border-black pb-1 mb-1 justify-between flex-wrap">
        <h1 className="font-semibold text-2xl w-fit">
          {registeredContingent.name} - {championship.title}
        </h1>
        <RefreshButton />
      </div>
      <div className="border-2 p-1 rounded mb-1">
        <h2 className="font-medium text-lg border-b-2 w-fit">Info Kontingen</h2>
        <RegisteredContingentAdminTable
          registeredContingentAdmins={[registeredContingent]}
          noDetail
        />
      </div>
      <div className="border-2 p-1 rounded mb-1">
        <h2 className="font-medium text-lg border-b-2 w-fit">
          Daftar Official
        </h2>
        <OfficialTable officials={officials} />
      </div>
      <div className="border-2 p-1 rounded mb-1">
        <h2 className="font-medium text-lg border-b-2 w-fit">Daftar Atlet</h2>
        <MatchBasedTable matchBaseds={matchBaseds} />
      </div>
      <div className="border-2 p-1 rounded mb-1">
        <h2 className="font-medium text-lg border-b-2 w-fit">
          Daftar Pembayaran
        </h2>
        <PaymentTable payments={payments} />
      </div>
    </div>
  );
};
export default page;
