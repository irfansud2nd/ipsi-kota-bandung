import Link from "next/link";
import NewsCard from "./NewsCard";
import Container from "../ui/Container";
import { Button } from "../ui/button";
import { News } from "@/lib/news/newsConstants";

type Props = {
  newsArr: News[];
  onHome?: boolean;
};

const NewsList = ({ onHome, newsArr }: Props) => {
  return (
    <Container
      className={`h-fit px-5 md:px-10 transition
      ${
        onHome &&
        "-mb-5 pt-10 mt-10 bg-blue-200 rounded-t-[50px] md:rounded-t-[80px]"
      }`}
    >
      {onHome && <h2 className="font-semibold text-3xl mb-3">Berita</h2>}
      {newsArr?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {newsArr.map((news) => (
            <NewsCard news={news} key={news.id} />
          ))}
        </div>
      ) : (
        <p>tidak ada Berita.</p>
      )}
      {onHome && (
        <Button
          className="mt-5 mb-24 rounded-full tracking-wide bg-gradient-to-br from-blue-900 to-blue-500 text-white font-semibold text-base hover:drop-shadow-xl hover:-translate-y-2 hover:brightness-110 transition-all"
          asChild
        >
          <Link href={"/news"}>Lihat Semua Berita</Link>
        </Button>
      )}
    </Container>
  );
};
export default NewsList;
