import NewsForm from "@/components/admin/news/NewsForm";
import Container from "@/components/ui/Container";
import PageInfo from "@/components/ui/PageInfo";
import { News } from "@/lib/news/newsConstants";
import { SearchPageParams } from "@/lib/constants";
import { getNews } from "@/lib/actions";

const page = async ({ searchParams }: { searchParams: SearchPageParams }) => {
  const id = searchParams.id;
  if (!id) return <PageInfo type="notFound" text="ID berita tidak ditemukan" />;
  const news: News = await getNews(id);
  if (!news) return <PageInfo type="notFound" text="Berita tidak ditemukan" />;
  return (
    <Container className="w-full h-full p-2 px-5 md:px-10">
      <h1 className="font-bold text-2xl border-b-2 mb-1 pb-1 w-full">
        Edit Berita
      </h1>
      <NewsForm newsToEdit={news} />
    </Container>
  );
};
export default page;
