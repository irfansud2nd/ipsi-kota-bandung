import ChampionshipMenuButton from "@/components/championship/register/menu/ChampionshipMenuButton";
import OfficialForm from "@/components/official/OfficialForm";
import OfficialTable from "@/components/official/OfficialTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Official",
};

const page = ({ params }: { params: { eventId: string } }) => {
  return (
    <div>
      <div className="flex sm:items-center flex-col sm:flex-row sm:justify-between gap-y-1 flex-wrap">
        <div className="flex items-center">
          <ChampionshipMenuButton />
          <h1 className="font-semibold text-3xl flex-1 text-center">
            Daftar Official
          </h1>
        </div>
        <OfficialForm />
      </div>
      <div className="registration_content">
        <OfficialTable championshipId={params.eventId} />
      </div>
    </div>
  );
};
export default page;
