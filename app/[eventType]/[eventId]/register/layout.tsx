import IsLoggedIn from "@/components/auth/IsLoggedIn";
import ChampionshipRegister from "@/components/championship/register/ChampionshipRegister";
import ChampionshipMenu from "@/components/championship/register/menu/ChampionshipMenu";
import ReduxProvider from "@/components/providers/ReduxProvider";
import PageInfo from "@/components/ui/PageInfo";
import { baseUrl } from "@/lib/constants";
import { getChampionship } from "@/lib/event/eventFunctions";
import { formatDate } from "@/lib/functions";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
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
              url: baseUrl + event.image.downloadUrl,
            },
          ],
        }
      : null,
  };
}

const layout = async ({
  children,
  params,
}: Props & { children: React.ReactNode }) => {
  if (params.eventType != "championship") return notFound();

  const championship = getChampionship(params.eventId);
  if (!championship) return notFound();

  let isTester = false;

  if (championship.testerEmail) {
    const session = await getServerSession();
    if (
      session?.user?.email &&
      championship.testerEmail.includes(session.user.email)
    )
      isTester = true;
  }

  if (
    // Date.now() <= championship.register.start &&
    !isTester
  )
    return (
      <PageInfo
        type="sorry"
        text={`Maaf, pendaftaran baru bisa di lakukan tanggal ${formatDate(
          championship.register.start,
          { withoutHour: true, longMonth: true }
        )}  ya!`}
      />
    );

  return (
    <IsLoggedIn>
      <ReduxProvider>
        <div className="flex h-full">
          <ChampionshipMenu championship={championship} />
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
