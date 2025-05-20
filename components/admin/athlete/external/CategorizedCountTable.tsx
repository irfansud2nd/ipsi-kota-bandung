"use client";

import SelectComponent from "@/components/ui/SelectComponent";
import { Button } from "@/components/ui/button";
import { Championship } from "@/lib/event/eventConstants";
import { getChampionship } from "@/lib/event/eventFunctions";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type CategorizedCount = {
  type: string;
  level: string;
  category: string;
  count: {
    putra: number;
    putri: number;
    total: number;
  };
};

type Props = { championshipId: string; categorizedCounts: CategorizedCount[] };

const CategorizedCountTable = ({
  championshipId,
  categorizedCounts,
}: Props) => {
  const [level, setLevel] = useState("Semua");
  const [dataToDisplay, setDataToDisplay] =
    useState<CategorizedCount[]>(categorizedCounts);

  const championship = getChampionship(championshipId) as Championship;

  const handleClick = () => {
    if (level == "Semua") {
      setDataToDisplay(categorizedCounts);
      return;
    }
    setDataToDisplay(categorizedCounts.filter((item) => item.level == level));
  };
  return (
    <div>
      <div className="flex gap-1 items-end">
        <SelectComponent
          label="Kelompok Usia"
          options={[
            ...championship.matchCategory
              .filter((item) => item.schema != "ROOKIE")
              .map((item) => item.level),
            "Semua",
          ]}
          value={level}
          onChange={(value) => setLevel(value)}
        />
        <Button onClick={handleClick} className="mb-1">
          Cari
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Jenis</TableHead>
            <TableHead>Tingkatan</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Putra</TableHead>
            <TableHead>Putri</TableHead>
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataToDisplay.map((item) => {
            const key = `Prestasi ${item.type} ${item.level} ${item.category}`;
            return (
              <TableRow key={key}>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.level}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.count.putra}</TableCell>
                <TableCell>{item.count.putri}</TableCell>
                <TableCell>{item.count.total}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
export default CategorizedCountTable;
