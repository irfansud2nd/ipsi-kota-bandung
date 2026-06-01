import MatchBasedTable from "@/components/athlete/external/MatchBasedTable";
import RegisterAthleteForm from "@/components/athlete/external/RegisterAthleteForm";
import ChampionshipMenuButton from "@/components/championship/register/menu/ChampionshipMenuButton";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: { eventId: string; matchType: "fight" | "art" };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Kategori ${params.matchType == "fight" ? "Tanding" : "Jurus"}`,
  };
}

const page = ({ params }: Props) => {
  if (!["fight", "art"].includes(params.matchType)) return notFound();

  const isArt = params.matchType == "art";

  return (
    <div>
      <div className="flex items-center">
        <ChampionshipMenuButton />
        <h1 className="font-semibold text-3xl flex-1 max-md:text-center">
          Kategori {isArt ? "Jurus" : "Tanding"}
        </h1>
        <RegisterAthleteForm championshipId={params.eventId} art={isArt} />
      </div>
      <div className="registration_content">
        <MatchBasedTable championshipId={params.eventId} art={isArt} />
      </div>
    </div>
  );
};
export default page;
