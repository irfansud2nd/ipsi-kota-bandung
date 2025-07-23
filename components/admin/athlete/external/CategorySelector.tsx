"use client";

import PagePagination from "@/components/ui/PagePagination";
import RefreshButton from "@/components/ui/RefreshButton";
import SelectComponent from "@/components/ui/SelectComponent";
import { Button } from "@/components/ui/button";
import {
  athleteGender,
  matchSchema,
  matchType,
} from "@/lib/athlete/external/athleteConstants";
import {
  getLevel,
  getMatchCategory,
} from "@/lib/athlete/external/athleteFunctions";
import { Championship } from "@/lib/event/eventConstants";
import { getChampionship } from "@/lib/event/eventFunctions";
import { toastError } from "@/lib/form/formFunctions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TableDownloadButton from "../internal/attendance/TableDownloadButton";

type Props = {
  championshipId: string;
  url: string;
  hide?: {
    type?: boolean;
    category?: boolean;
    page?: boolean;
  };
};
const CategorySelector = ({ championshipId, url, hide }: Props) => {
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

    let params = [
      {
        key: "schema",
        value: schema,
      },
      {
        key: "type",
        value: type,
      },
      {
        key: "level",
        value: level,
      },
      {
        key: "category",
        value: category,
      },
      {
        key: "gender",
        value: gender,
      },
      {
        key: "page",
        value: 1,
      },
    ];

    if (hide) {
      for (const key in hide) {
        params = params.filter((item) => item.key != key);
      }
    }

    const searchParams = new URLSearchParams({
      schema,
      type,
      level,
      category,
      gender,
    }).toString();

    let targetUrl = `${url}?${searchParams}`;

    // const targetUrl = `${url}?schema=${schema}&type=${type}&level=${level}&category=${category}&gender=${gender}&page=1`;
    // let targetUrl = `${url}?`;
    // params.map((item, i) => {
    //   targetUrl += encodeURIComponent(`${item.key}=${item.value}`);
    //   if (i < params.length - 1) targetUrl += "&";
    // });

    router.push(targetUrl);
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
      {!hide?.type && (
        <SelectComponent
          label="Jenis Pertandingan"
          options={matchType}
          value={type}
          onChange={(value) => setType(value)}
        />
      )}
      <SelectComponent
        label="Kelompok Usia"
        options={getLevel(schema == matchSchema[0], championship.matchCategory)}
        value={level}
        onChange={(value) => setLevel(value)}
      />
      {!hide?.category && (
        <SelectComponent
          label="Kategori"
          options={getMatchCategory(level, type, matchCategory)}
          value={category}
          onChange={(value) => setCategory(value)}
        />
      )}
      <SelectComponent
        label="Jenis Kelamin"
        options={athleteGender}
        value={gender}
        onChange={(value) => setGender(value)}
      />
      <Button onClick={handleSubmit} className="mb-1">
        Cari
      </Button>
      <RefreshButton className="mb-1" />
      <TableDownloadButton
        fileName={`${schema} ${type} ${level} ${category} ${gender} - ${championship.title}`}
        className="mb-1"
        disabled={!category}
      />
    </div>
  );
};
export default CategorySelector;
