"use client";

import PagePagination from "@/components/ui/PagePagination";
import SelectComponent from "@/components/ui/SelectComponent";
import { Button } from "@/components/ui/button";
import {
  athleteGender,
  matchSchema,
  matchType,
} from "@/lib/athlete/external/athleteConstants";
import { getMatchCategory } from "@/lib/athlete/external/athleteFunctions";
import { Championship } from "@/lib/event/eventConstants";
import { getChampionship } from "@/lib/event/eventFunctions";
import { toastError } from "@/lib/form/formFunctions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = { championshipId: string };
const CategorySelector = ({ championshipId }: Props) => {
  const championship = getChampionship(championshipId) as Championship;
  const { matchCategory } = championship;

  const levels = matchCategory.map((item) => item.level);

  const [schema, setSchema] = useState(matchSchema[0]);
  const [type, setType] = useState(matchType[0]);
  const [level, setLevel] = useState(levels[0]);
  const [category, setCategory] = useState("");
  const [gender, setGender] = useState(athleteGender[0]);

  const router = useRouter();

  const handleSubmit = () => {
    if (!category) {
      toastError("Tolong pilih kategori");
      return;
    }

    const url = `categorized?schema=${schema}&type=${type}&level=${level}&category=${category}&gender=${gender}&page=1`;

    router.push(url);
  };

  useEffect(() => {
    const categories = getMatchCategory(level, type, matchCategory);
    if (!categories.includes(category)) setCategory(categories[0]);
  }, [level, type]);

  return (
    <div className="flex gap-2 items-end flex-wrap">
      <SelectComponent
        label="Skema Pertandingan"
        options={matchSchema}
        value={schema}
        onChange={(value) => setSchema(value)}
      />
      <SelectComponent
        label="Jenis Pertandingan"
        options={matchType}
        value={type}
        onChange={(value) => setType(value)}
      />
      <SelectComponent
        label="Kelompok Usia"
        options={levels}
        value={level}
        onChange={(value) => setLevel(value)}
      />
      <SelectComponent
        label="Kategori"
        options={getMatchCategory(level, type, matchCategory)}
        value={category}
        onChange={(value) => setCategory(value)}
      />
      <SelectComponent
        label="Jenis Kelamin"
        options={athleteGender}
        value={gender}
        onChange={(value) => setGender(value)}
      />
      <Button onClick={handleSubmit} className="mb-1">
        Cari
      </Button>
    </div>
  );
};
export default CategorySelector;
