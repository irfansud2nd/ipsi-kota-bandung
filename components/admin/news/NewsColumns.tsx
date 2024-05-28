"use client";
import { News } from "@/lib/news/newsConstants";
import { formatDate } from "@/lib/functions";
import { ColumnDef } from "@tanstack/react-table";
import useConfirmation from "@/hooks/useConfirmation";
import { deleteNews } from "@/lib/news/newsFunctions";
import { useRouter } from "next/navigation";
import AdminManageButtons from "../AdminManageButtons";
import { Label } from "@radix-ui/react-dropdown-menu";

export const NewsColumns: ColumnDef<News>[] = [
  {
    accessorKey: "title",
    header: "Judul Berita",
  },
  {
    accessorKey: "creator.name",
    header: "Penulis",
  },
  {
    accessorKey: "creator.email",
    header: "Email Penulis",
  },
  {
    accessorKey: "createdAt",
    header: "Waktu Pembuatan",
    cell: ({ row }) => <div>{formatDate(row.original.createdAt)}</div>,
  },
  {
    header: "Aksi",
    cell: ({ row }) => {
      const router = useRouter();
      const { confirm, ConfirmationDialog } = useConfirmation();

      const handleDelete = async () => {
        const result = await confirm("Hapus Berita");
        if (result) {
          deleteNews(row.original).then((res) => router.refresh());
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
