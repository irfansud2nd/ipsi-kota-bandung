import { getChampionship } from "@/lib/event/eventFunctions";
import ChampionshipMenuButton from "../championship/register/menu/ChampionshipMenuButton";
import ContingentNotFound from "./ContingentNotFound";
import { Championship } from "@/lib/event/eventConstants";
import UnregisteredContingentInfo from "./UnregisteredContingentInfo";
import RegisteredContingentInfo from "./RegisteredContingentInfo";
import ContingentHistoriesInfo from "./ContingentHistoriesInfo";

const ContingentInfo = ({ championshipId }: { championshipId: string }) => {
  const championship = getChampionship(championshipId) as Championship;

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center">
        <ChampionshipMenuButton />
        <h1 className="text-3xl font-semibold">Info Kontingen</h1>
      </div>
      <div className="flex justify-center items-center w-full flex-1 registration_content">
        <div className="w-full">
          <ContingentNotFound championshipId={championshipId} />
          <UnregisteredContingentInfo championship={championship} />
          <RegisteredContingentInfo championship={championship} />
          <ContingentHistoriesInfo championshipId={championship.id} />
        </div>
      </div>
    </div>
  );
};
export default ContingentInfo;
