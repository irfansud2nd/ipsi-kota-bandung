"use client";

import { RootState } from "@/lib/redux/store";
import { useSelector } from "react-redux";
import { getChampionship } from "@/lib/event/eventFunctions";
import ChampionshipMenuButton from "../championship/register/menu/ChampionshipMenuButton";
import ContingentNotFound from "./ContingenNotFound";
import { Championship } from "@/lib/event/eventConstants";
import UnregisteredContingentInfo from "./UnregisteredContingentInfo";
import RegisteredContingentInfo from "./RegisteredContingentInfo";
import ContingentHistoriesInfo from "./ContingentHistoriesInfo";

const ContingentInfo = ({ championshipId }: { championshipId: string }) => {
  const unregisteredContingent = useSelector(
    (state: RootState) => state.contingent.unregistered
  );

  const championship = getChampionship(championshipId) as Championship;

  if (!unregisteredContingent)
    return <ContingentNotFound championshipId={championshipId} />;

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center">
        <ChampionshipMenuButton />
        <h1 className="text-3xl font-semibold">Info Kontingen</h1>
      </div>
      <div className="flex justify-center items-center w-full flex-1 registration_content">
        <div className="w-full">
          <UnregisteredContingentInfo championship={championship} />
          <RegisteredContingentInfo championship={championship} />
          <ContingentHistoriesInfo championshipId={championship.id} />
        </div>
      </div>
    </div>
  );
};
export default ContingentInfo;
