import CategorySelector from "@/components/admin/athlete/external/CategorySelector";
import { countMatchByPaymentType } from "@/lib/athlete/external/athleteActions";
import { fetchData } from "@/lib/functions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getChampionship } from "@/lib/event/eventFunctions";
import { notFound } from "next/navigation";

type Props = {
  params: {
    championshipId: string;
  };
  searchParams: {
    schema: string;
    level: string;
    gender: string;
  };
};

const page = async ({ params, searchParams }: Props) => {
  const { schema, level, gender } = searchParams;

  const championship = getChampionship(params.championshipId);

  if (!championship) return notFound();

  const getCategories = (): string[] => {
    const categories = championship.matchCategory.find(
      (item) => item.level == level
    )?.category;

    if (!categories) return [];

    console.log({ schema, level, gender });
    console.log({ categories });

    return [...categories.fight, ...categories.art];
  };

  const categories = getCategories();

  let data: {
    category: string;
    paid: number;
    unpaid: number;
  }[] = [];

  if (schema && level && gender)
    data = await fetchData(() =>
      countMatchByPaymentType(
        params.championshipId,
        schema,
        level,
        gender,
        categories
      )
    );

  return (
    <div>
      <h1 className="font-semibold text-3xl">Jumlah Pertandingan Terbayar</h1>
      <CategorySelector
        championshipId={params.championshipId}
        url="count"
        hide={{ type: true, category: true, page: true }}
      />
      <p>
        Hasil Pencarian:{" "}
        <b>
          {schema} {level} {gender}
        </b>
      </p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Belum dibayar</TableHead>
            <TableHead>Dibayar</TableHead>
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, i) => (
            <TableRow key={item.category}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>{item.unpaid}</TableCell>
              <TableCell>{item.paid}</TableCell>
              <TableCell>{item.unpaid + item.paid}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
export default page;
