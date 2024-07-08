import { News } from "@/lib/news/newsConstants";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/functions";
import Link from "next/link";
import ManageNews from "./ManageNews";

const NewsTable = ({ newsArr }: { newsArr: News[] }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No</TableHead>
          <TableHead>Judul Berita</TableHead>
          <TableHead>Penulis</TableHead>
          <TableHead>Email Penulis</TableHead>
          <TableHead>Waktu Pembuatan</TableHead>
          <TableHead>Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {newsArr.map((news, i) => (
          <TableRow key={news.id}>
            <TableCell>{i + 1}</TableCell>
            <TableCell>{news.title}</TableCell>
            <TableCell>{news.writer}</TableCell>
            <TableCell>{news.created_by}</TableCell>
            <TableCell>{formatDate(news.created_at)}</TableCell>
            <TableCell>
              <ManageNews news={news} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
export default NewsTable;
