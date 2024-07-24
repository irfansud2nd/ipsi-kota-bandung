import AthleteForm from "@/components/athlete/external/AthleteForm";
import ChampionshipMenuButton from "@/components/championship/register/menu/ChampionshipMenuButton";
import { Metadata } from "next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AthleteTable from "@/components/athlete/external/AthleteTable";

export const metadata: Metadata = {
  title: "Atlet",
};

const page = ({ params }: { params: { eventId: string } }) => {
  return (
    <Tabs defaultValue="all" className="flex flex-col">
      <div className="flex sm:items-center flex-col sm:flex-row sm:justify-between gap-y-1 flex-wrap">
        <div className="flex items-center">
          <ChampionshipMenuButton />
          <h1 className="font-semibold text-3xl flex-1 text-center">
            Daftar Atlet
          </h1>
        </div>
        <TabsList>
          <TabsTrigger value="registered">Atlet terdaftar</TabsTrigger>
          <TabsTrigger value="all">Semua Atlet</TabsTrigger>
        </TabsList>
        <AthleteForm championshipId={params.eventId} />
      </div>
      <div className="registration_content flex-1">
        <TabsContent value="registered" className="registration_content">
          <AthleteTable registered championshipId={params.eventId} />
        </TabsContent>
        <TabsContent value="all">
          <AthleteTable championshipId={params.eventId} />
        </TabsContent>
      </div>
    </Tabs>
  );
};
export default page;
