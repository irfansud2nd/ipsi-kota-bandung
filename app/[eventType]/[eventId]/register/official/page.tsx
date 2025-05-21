import ChampionshipMenuButton from "@/components/championship/register/menu/ChampionshipMenuButton";
import OfficialForm from "@/components/official/OfficialForm";
import OfficialTable from "@/components/official/OfficialTable";
import { Button } from "@/components/ui/button";
import { getChampionship } from "@/lib/event/eventFunctions";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Official",
};

const page = ({ params }: { params: { eventId: string } }) => {
  const groupLink = getChampionship(params.eventId)?.officialGroupLink;
  return (
    <div>
      <div className="flex sm:items-center flex-col sm:flex-row  gap-y-1 flex-wrap">
        <div className="flex items-center">
          <ChampionshipMenuButton />
          <h1 className="font-semibold text-3xl flex-1 text-center">
            Daftar Official
          </h1>
        </div>
        {groupLink && (
          <Button className="sm:ml-2 sm:mr-auto" asChild>
            <Link href={groupLink} target="_blank">
              Grup Official
            </Link>
          </Button>
        )}
        <OfficialForm championshipId={params.eventId} />
      </div>
      <div className="registration_content">
        <OfficialTable championshipId={params.eventId} />
      </div>
    </div>
  );
};
export default page;
