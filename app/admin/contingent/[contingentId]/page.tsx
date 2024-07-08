import AthleteTable from "@/components/admin/athlete/external/AthleteTable";
import OfficialTable from "@/components/admin/official/OfficialTable";
import HorizontalTable from "@/components/contingent/HorizontalTable";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { getAthletesByContingentId } from "@/lib/athlete/external/athleteFunctions";
import {
  getContingenAtEventsByContingentId,
  getContingentById,
} from "@/lib/contingent/contingentActions";
import { getChampionship } from "@/lib/event/eventFunctions";
import { fetchData, formatDate } from "@/lib/functions";
import { getOfficialsByContingentId } from "@/lib/official/officialFunctions";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: {
    contingentId: string;
  };
};

const page = async ({ params }: Props) => {
  const { contingentId } = params;

  const contingent = await fetchData(() => getContingentById(contingentId));
  if (!contingent) return notFound;

  const contingentAtEvents = await fetchData(() =>
    getContingenAtEventsByContingentId(contingentId)
  );

  const athletes = await getAthletesByContingentId(contingentId);
  const officials = await getOfficialsByContingentId(contingentId);

  return (
    <div>
      <h1 className="font-semibold text-2xl mb-2">
        Kontingen {contingent.name}
      </h1>
      <div className="border-2 p-1 rounded mb-1">
        <h2 className="font-medium text-lg border-b-2 w-fit">Info Kontingen</h2>
        <HorizontalTable
          data={[
            {
              key: "Atlet",
              value: contingent.athletes,
            },
            {
              key: "Official",
              value: contingent.officials,
            },
            {
              key: "Waktu Pendaftaran",
              value: formatDate(contingent.created_at, {
                withoutHour: true,
              }),
            },
            {
              key: "Kejuaraan diikuti",
              value: contingentAtEvents.length,
            },
          ]}
        />
      </div>

      <div className="border-2 p-1 rounded mb-1">
        <h2 className="font-medium text-lg border-b-2 w-fit">
          Kejuaraan yang pernah diikuti
        </h2>
        <Accordion type="single" collapsible>
          {contingentAtEvents.map((contingentAtEvent) => (
            <AccordionItem
              value={contingentAtEvent.championship_id}
              key={contingentAtEvent.championship_id}
            >
              <AccordionTrigger>
                {getChampionship(contingentAtEvent.championship_id)?.title}
              </AccordionTrigger>
              <AccordionContent className="pb-1">
                <HorizontalTable
                  data={[
                    {
                      key: "Atlet",
                      value: contingentAtEvent.registered_athletes,
                    },
                    {
                      key: "Official",
                      value: contingentAtEvent.registered_officials,
                    },
                    {
                      key: "Nomor pertandingan",
                      value: contingentAtEvent.match_count,
                    },
                  ]}
                />
                <div className="flex w-full justify-center">
                  <Button size={"sm"} asChild>
                    <Link
                      href={`${contingent.id}/${contingentAtEvent.championship_id}`}
                    >
                      Info selengkapnya
                    </Link>
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="border-2 p-1 rounded mb-1">
        <h2 className="font-medium text-lg border-b-2 w-fit">
          Daftar Official
        </h2>
        <OfficialTable officials={officials} />
      </div>

      <div className="border-2 p-1 rounded mb-1">
        <h2 className="font-medium text-lg border-b-2 w-fit">Daftar Atlet</h2>
        <AthleteTable athletes={athletes} />
      </div>
    </div>
  );
};
export default page;
