import { Championship } from "@/lib/event/eventConstants";
import { getChampionship } from "@/lib/event/eventFunctions";
import {
  Table,
  TableBody,
  TableCaption,
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
        .filter((item) => !item.rookieOnly)
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
    let result: {
      type: string;
      level: string;
      category: string;
      count: {
        putra: number;
        putri: number;
        total: number;
      };
    }[] = [];

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

  const reducedData = reduceData(rawData);

  return (
    <div>
      <h1 className="font-semibold text-3xl">Kuota Pertandingan Prestasi</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Jenis</TableHead>
            <TableHead>Tingkatan</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Putra</TableHead>
            <TableHead>Putri</TableHead>
            <TableHead>Total</TableHead>
            {/* <TableHead>Kuota</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {reducedData.map((item) => {
            const key = `Prestasi ${item.type} ${item.level} ${item.category}`;
            return (
              <TableRow key={key}>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.level}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.count.putra}</TableCell>
                <TableCell>{item.count.putri}</TableCell>
                <TableCell>{item.count.total}</TableCell>
                {/* <TableCell>-</TableCell> */}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
export default page;
