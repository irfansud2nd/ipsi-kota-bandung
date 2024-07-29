import CategorySelector from "@/components/admin/athlete/external/CategorySelector";
import MatchBasedTable from "@/components/admin/athlete/external/MatchBasedTable";
import PagePagination from "@/components/ui/PagePagination";
import { Button } from "@/components/ui/button";
import { getMatchBasedsByCategory } from "@/lib/athlete/external/athleteActions";
import { MatchBased } from "@/lib/athlete/external/athleteConstants";
import { fetchData } from "@/lib/functions";
import Link from "next/link";

type Props = {
  params: {
    championshipId: string;
  };
  searchParams: {
    schema: string;
    type: string;
    level: string;
    category: string;
    gender: string;
    page: string;
    showAll: string;
  };
};
const page = async ({ params, searchParams }: Props) => {
  const { schema, type, level, category, gender } = searchParams;
  const page = Number(searchParams.page) || 1;
  const limit = 10;
  // const showAll = searchParams.showAll == "true";
  const showAll = true;
  const url = `categorized?schema=${schema}&type=${type}&level=${level}&category=${category}&gender=${gender}`;

  let matchBaseds: MatchBased[] = [];

  if (schema && type && level && category && gender)
    matchBaseds = await fetchData(() =>
      getMatchBasedsByCategory(
        params.championshipId,
        schema,
        type,
        level,
        category,
        gender,
        page,
        limit,
        showAll
      )
    );

  return (
    <div>
      <h1 className="font-semibold text-3xl">Filter Kategori</h1>
      <CategorySelector
        championshipId={params.championshipId}
        url={"categorized"}
      />
      <p>
        Hasil Pencarian:{" "}
        <b>
          {schema} {type} {level} {category} {gender}
        </b>
      </p>
      <MatchBasedTable matchBaseds={matchBaseds} />
      <div className="flex gap-1 flex-col sm:flex-row sm:justify-between items-center mt-1">
        <p>Menampilkan per {matchBaseds.length} Atlet</p>
        <Button asChild>
          <Link href={`${url}&showAll=true`}>Tampilkan Semua Atlet</Link>
        </Button>
        <PagePagination
          page={page}
          limit={limit}
          dataLength={matchBaseds.length}
          link={`${url}&`}
          className="w-fit mx-0"
          disabled={showAll}
        />
      </div>
    </div>
  );
};
export default page;
