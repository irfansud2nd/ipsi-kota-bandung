"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { getChampionship } from "@/lib/event/eventFunctions";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import ContingentInfoTable from "./ContingentInfoTable";

const ContingentHistoriesInfo = ({
  championshipId,
}: {
  championshipId: string;
}) => {
  const contingentAtEvents = useSelector(
    (state: RootState) => state.contingent.contingentAtEvents
  );
  const data = contingentAtEvents.filter(
    (item) => item.championship_id !== championshipId
  );

  if (!data.length) return null;

  let histories = data.map((item) => ({
    championshipId: item.championship_id,
    data: [
      {
        key: "Atlet",
        value: item.registered_athletes,
      },
      {
        key: "Official",
        value: item.registered_officials,
      },
      {
        key: "Nomor pertandingan",
        value: item.match_count,
      },
    ],
  }));

  return (
    <>
      <h2 className="font-medium text-xl">Event yang pernah diikuti</h2>
      <Accordion type="single" collapsible>
        {histories.map((history) => (
          <AccordionItem
            value={history.championshipId}
            key={history.championshipId}
          >
            <AccordionTrigger>
              {getChampionship(history.championshipId)?.title}
            </AccordionTrigger>
            <AccordionContent className="pb-0">
              <ContingentInfoTable data={history.data} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
};
export default ContingentHistoriesInfo;
