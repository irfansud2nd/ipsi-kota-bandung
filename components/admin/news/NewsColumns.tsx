"use client";
import { News } from "@/lib/news/newsConstants";
import { formatDate } from "@/lib/functions";
import { ColumnDef } from "@tanstack/react-table";
import useConfirmation from "@/hooks/useConfirmation";
import { deleteNews } from "@/lib/news/newsFunctions";
import { useRouter } from "next/navigation";
import AdminManageButtons from "../AdminManageButtons";

export const NewsColumns: ColumnDef<News>[] = [
  {
    accessorKey: "title",
    header: "Judul Berita",
  },
  {
    accessorKey: "writer",
    header: "Penulis",
  },
  {
    accessorKey: "created_by",
    header: "Email Penulis",
  },
  {
    accessorKey: "created_at",
    header: "Waktu Pembuatan",
    cell: ({ row }) => <div>{formatDate(row.original.created_at)}</div>,
  },
  {
    header: "Aksi",
    cell: ({ row }) => {
      const router = useRouter();
      const { confirm, ConfirmationDialog } = useConfirmation();

      const handleDelete = async () => {
        const result = await confirm("Hapus Berita");
        if (result) {
          deleteNews(row.original).then(() => router.refresh());
        }
      };
      return (
        <>
          <ConfirmationDialog />
          <AdminManageButtons
            show={{
              url: `/news/${row.original.id}?title=${row.original.title}`,
              label: "Lihat Berita",
            }}
            edit={{ url: `/admin/news/edit?id=${row.original.id}` }}
            handleDelete={handleDelete}
          />
        </>
      );
    },
  },
];
