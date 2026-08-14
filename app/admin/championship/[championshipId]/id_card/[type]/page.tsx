import IdCards from "@/components/admin/IdCards";
import { getPaidAthletesByChampionshipId } from "@/lib/athlete/external/athleteFunctions";
import { getRegisteredOfficials } from "@/lib/official/officialFunctions";
import { notFound } from "next/navigation";

export default async function page({
  searchParams,
  params,
}: {
  searchParams: { page: string; showAll: string; download_all: string };
  params: { type: string; championshipId: string };
}) {
  if (params.type != "athlete" && params.type != "official") {
    return notFound();
  }

  const page = Number(searchParams.page) || 1;
  const downloadAll = searchParams.download_all == "TRUE";
  const limit = 300;
  const showAll = searchParams.showAll == "true";
  // const showAll = true;

  const data =
    params.type == "athlete"
      ? await getPaidAthletesByChampionshipId(
          params.championshipId,
          page,
          limit,
          showAll,
          !downloadAll
        )
      : await getRegisteredOfficials(
          page,
          limit,
          params.championshipId,
          showAll,
          !downloadAll
        );

  return (
    <IdCards
      champId={params.championshipId}
      data={data
        .filter(
          (item) =>
            !["MTs YPPA Cipulus", "GARDHA SAKTI"].includes(item.contingent_name)
        )
        .map((item) => ({
          id: item.id,
          name: item.name,
          contingent_name: item.contingent_name,
          image: item.image.downloadUrl,
        }))}
      isAthlete={params.type == "athlete"}
      downloadAll={downloadAll}
    />
  );
}
