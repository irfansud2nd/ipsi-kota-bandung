import ChampionshipMenuButton from "@/components/championship/register/menu/ChampionshipMenuButton";
import { notFound, redirect } from "next/navigation";

type Props = {
  params: {
    eventType: string;
    eventId: string;
  };
};

const page = ({ params }: Props) => {
  const { eventType, eventId } = params;
  if (eventType != "championship") return notFound();

  redirect("register/contingent");

  return (
    <div className="h-[3000px] bg-green-200">
      <div className="flex items-center ">
        <ChampionshipMenuButton />
        <p>{eventType}</p>
        <p>{eventId}</p>
      </div>
    </div>
  );
};
export default page;
