"use client";

import useConfirmation from "@/hooks/useConfirmation";
import { News } from "@/lib/news/newsConstants";
import { deleteNews } from "@/lib/news/newsFunctions";
import { useRouter } from "next/navigation";
import AdminManageButtons from "../AdminManageButtons";

const ManageNews = ({ news }: { news: News }) => {
  const router = useRouter();
  const { confirm, ConfirmationDialog } = useConfirmation();

  const handleDelete = async () => {
    const result = await confirm("Hapus Berita");
    if (result) {
      try {
        await deleteNews(news);
        router.refresh();
      } catch (error) {
        throw error;
      }
    }
  };

  return (
    <>
      <ConfirmationDialog />
      <AdminManageButtons
        show={{
          url: `/news/${news.id}?title=${news.title}`,
          label: "Lihat Berita",
        }}
        edit={{ url: `/admin/news/edit?id=${news.id}` }}
        handleDelete={handleDelete}
      />
    </>
  );
};
export default ManageNews;
