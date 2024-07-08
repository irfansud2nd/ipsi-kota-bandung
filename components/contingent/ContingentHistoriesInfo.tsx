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
import HorizontalTable from "./HorizontalTable";

const ContingentHistoriesInfo = ({
  championshipId,
}: {
  championshipId: string;
}) => {
  const contingentAtEvents = useSelector(
    (state: RootState) => state.contingent.contingentAtEvents
  ).filter((item) => item.championship_id !== championshipId);

  if (!contingentAtEvents.length) return null;

  return (
    <>
      <h2 className="font-medium text-xl">Kejuaraan yang pernah diikuti</h2>
      <Accordion type="single" collapsible>
        {contingentAtEvents.map((contingentAtEvent) => (
          <AccordionItem
            value={contingentAtEvent.championship_id}
            key={contingentAtEvent.championship_id}
          >
            <AccordionTrigger>
              {getChampionship(contingentAtEvent.championship_id)?.title}
            </AccordionTrigger>
            <AccordionContent className="pb-0">
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
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
};
export default ContingentHistoriesInfo;
