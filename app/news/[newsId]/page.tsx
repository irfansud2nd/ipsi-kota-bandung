import { Metadata } from "next";
import { News } from "@/lib/news/newsConstants";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import NewsItem from "@/components/news/NewsItem";
import NewsDisplay from "@/components/news/NewsDisplay";
import { getNews, getNewsArr } from "@/lib/news/newsActions";

type Props = {
  params: { newsId: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const news = await getNews(params.newsId);
  return {
    title: news.title,
    description: `Berita tentang ${news.title} dari IPSI Kota Bandung`,
    openGraph: {
      images: [
        {
          url: news.image.downloadUrl,
        },
      ],
    },
  };
}

const page = async ({ params }: Props) => {
  const { newsId } = params;
  const news: News = await getNews(newsId);
  const otherNews: News[] = await getNewsArr(1, 4, news);
  if (!news) return notFound();
  return (
    <Container className="px-5 md:px-10 py-5 md:grid md:grid-cols-10 flex flex-col">
      <NewsDisplay news={news} />
      <div className="col-span-4 lg:col-span-3 max-md:mt-5 md:ml-5 bg-muted rounded-md h-fit p-3 md:sticky md:top-[90px]">
        <h3 className="font-semibold text-xl border-b-2 pb-2 mb-2">
          Berita Lainnya
        </h3>
        {otherNews.map((news) => (
          <NewsItem news={news} key={news.id} />
        ))}
      </div>
    </Container>
  );
};
export default page;
