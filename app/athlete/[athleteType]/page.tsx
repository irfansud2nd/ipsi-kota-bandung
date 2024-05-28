import MemberCard from "@/components/member/MemberCard";
import MemberList from "@/components/member/MemberList";
import Container from "@/components/ui/Container";
import PageBanner from "@/components/ui/PageBanner";
import PagePagination from "@/components/ui/PagePagination";
import { Button } from "@/components/ui/button";
import { getSpecialUsers } from "@/lib/admin/adminActions";
import { InternalAthleteRole } from "@/lib/athlete/internal/internalAthleteConstants";
import { isInternalAthleteRole } from "@/lib/athlete/internal/internalAthleteFunctions";
import { getSpecialUserLabel } from "@/lib/functions";
import { Member } from "@/lib/member/memberConstants";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: { athleteType: InternalAthleteRole };
  searchParams: { page: string };
};

export function generateMetadata({ params }: Props): Metadata {
  const label = getSpecialUserLabel(params.athleteType);
  return {
    title: label.replace("Atlet ", ""),
    description: `Informasi tentang ${label} IPSI Kota Bandung`,
  };
}

const page = async ({ params, searchParams }: Props) => {
  const { athleteType } = params;
  if (!isInternalAthleteRole(athleteType)) return notFound();

  const athleteLabel = getSpecialUserLabel(athleteType);

  let limit = 6;
  const page = Number(searchParams.page) || 1;

  const data = await getSpecialUsers(athleteType, page, limit, true);
  const athletes = data.map((data, i) => {
    const athlete: Member = {
      id: data.email,
      name: data.name,
      image: data.image,
      position: athleteLabel,
      order: i,
    };
    return athlete;
  });

  return (
    <>
      <PageBanner
        imgUrl="/images/home-banner-people.jpg"
        title={athleteLabel}
        className="text-white"
        text="IPSI Kota Bandung"
      />
      <div className="bg-white rounded-t-[50px] -mt-10 pt-10 pb-5  w-full">
        <Container className="px-5 md:px-10 h-full ">
          <MemberList members={athletes} />
          <PagePagination
            page={page}
            limit={limit}
            dataLength={athletes.length}
            link={`/${athleteType}?`}
            className="mt-5 md:justify-end md:px-10"
          />
          <div className="flex flex-col items-center gap-2 mt-2 pt-2 border-t">
            <p className="font-medium text-lg">Bagian dari {athleteLabel}?</p>
            <Button asChild>
              <Link href={athleteType + "/restricted"}>Klik di sini</Link>
            </Button>
          </div>
        </Container>
      </div>
    </>
  );
};
export default page;
