import IsLoggedIn from "@/components/auth/IsLoggedIn";
import ChampionshipRegister from "@/components/championship/register/ChampionshipRegister";
import ChampionshipMenu from "@/components/championship/register/menu/ChampionshipMenu";
import ReduxProvider from "@/components/providers/ReduxProvider";
import { getChampionship } from "@/lib/event/eventFunctions";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: { eventId: string; eventType: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = getChampionship(params.eventId);
  return {
    title: {
      template: event
        ? `%s - Pendaftaran ${event.title} - IPSI Kota Bandung`
        : "Tidak ditemukan - IPSI Kota Bandung",
      default: event
        ? `Pendaftaran ${event.title} - IPSI Kota Bandung`
        : "Tidak ditemukan - IPSI Kota Bandung",
    },
    description: event
      ? `Dapatkan informasi tentang ${event.title} disini`
      : "Tidak ditemukan",
    openGraph: event
      ? {
          images: [
            {
              url: process.env.NEXT_PUBLIC_BASE_URL + event.image.downloadUrl,
            },
          ],
        }
      : null,
  };
}

const layout = ({
  children,
  params,
}: Props & { children: React.ReactNode }) => {
  if (params.eventType != "championship") return notFound();

  const championship = getChampionship(params.eventId);
  if (!championship || Date.now() <= championship?.register.start)
    return notFound();

  return (
    <IsLoggedIn>
      <ReduxProvider>
        <div className="flex h-full">
          <ChampionshipMenu />
          <ChampionshipRegister championshipId={params.eventId}>
            <div className="p-1 py-2 w-full max-w-full grid grid-cols-1">
              {children}
            </div>
          </ChampionshipRegister>
        </div>
      </ReduxProvider>
    </IsLoggedIn>
  );
};
export default layout;
