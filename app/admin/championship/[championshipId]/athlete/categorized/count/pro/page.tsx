import { Championship } from "@/lib/event/eventConstants";
import { getChampionship } from "@/lib/event/eventFunctions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  athleteGender,
  matchSchema,
  matchType,
} from "@/lib/athlete/external/athleteConstants";
import { countProfessionalMatches } from "@/lib/athlete/external/athleteActions";

import CategorizedCountTable, {
  CategorizedCount,
} from "@/components/admin/athlete/external/CategorizedCountTable";

const page = async ({ params }: { params: { championshipId: string } }) => {
  const championship = getChampionship(params.championshipId) as Championship;
  const { matchCategory } = championship;

  const getProfessionalMatchIds = () => {
    let result: {
      championshipId: string;
      schema: string;
      type: string;
      level: string;
      category: string;
      gender: string;
      paid: boolean;
    }[] = [];

    matchType.map((type) =>
      matchCategory
        .filter((item) => item.schema != "ROOKIE")
        .map((matchCategory) =>
          matchCategory.category[type == matchType[0] ? "fight" : "art"].map(
            (category) => {
              athleteGender.map((gender) => {
                result.push({
                  championshipId: championship.id,
                  schema: matchSchema[1],
                  type,
                  level: matchCategory.level,
                  category,
                  gender,
                  paid: true,
                });
              });
            }
          )
        )
    );
    return result;
  };

  const professionalMatchIds = getProfessionalMatchIds();

  const fetchRawData = async () => {
    try {
      const { result, error } = await countProfessionalMatches(
        professionalMatchIds
      );
      if (error) throw error;

      return result;
    } catch (error) {
      throw error;
    }
  };

  const rawData = await fetchRawData();

  const reduceData = (data: typeof rawData) => {
    let result: CategorizedCount[] = [];

    data.map((item) => {
      if (item.gender == athleteGender[0]) {
        result.push({
          type: item.type,
          level: item.level,
          category: item.category,
          count: {
            putra: item.count,
            putri: 0,
            total: item.count,
          },
        });
      } else {
        result[result.length - 1].count.putri = item.count;
        result[result.length - 1].count.total += item.count;
      }
    });

    return result;
  };

  const categorizedCounts = reduceData(rawData);

  return (
    <div>
      <h1 className="font-semibold text-3xl">Kuota Pertandingan Prestasi</h1>
      <CategorizedCountTable
        championshipId={championship.id}
        categorizedCounts={categorizedCounts}
      />
    </div>
  );
};
export default page;
