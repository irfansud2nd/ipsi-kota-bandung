import EmployeeForm from "@/components/employee/EmployeeForm";
import PageInfo from "@/components/ui/PageInfo";
import { Button } from "@/components/ui/button";
import { InternalAthleteRole } from "@/lib/athlete/internal/internalAthleteConstants";
import { isInternalAthleteRole } from "@/lib/athlete/internal/internalAthleteFunctions";
import { authOptions } from "@/lib/auth/authOptions";
import { getSpecialUserLabel } from "@/lib/functions";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: { athleteType: InternalAthleteRole };
};

export function generateMetadata({ params }: Props): Metadata {
  const label = getSpecialUserLabel(params.athleteType);
  return {
    title: label,
    description: `Informasi tentang ${label} IPSI Kota Bandung`,
  };
}

const page = async ({ params }: Props) => {
  const { athleteType } = params;
  if (!isInternalAthleteRole(athleteType)) return notFound();

  const session = await getServerSession(authOptions);
  if (!session) return <PageInfo type="notAuthorized" />;

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <h1 className="font-bold text-3xl mb-2">Hai {session?.user?.name}!</h1>
      <div className="flex gap-2">
        <EmployeeForm athlete />
        <Button asChild>
          <Link href={athleteType + "/restricted"}>Absen</Link>
        </Button>
      </div>
    </div>
  );
};
export default page;
