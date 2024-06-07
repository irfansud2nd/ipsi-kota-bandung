import { News } from "@/lib/news/newsConstants";
import { reduceText } from "@/lib/news/newsFunctions";
import { formatDate } from "@/lib/functions";
import Link from "next/link";

type Props = {
  news: News;
};
const NewsCard = ({ news }: Props) => {
  const previewText = reduceText(news.text.replace(/<[^>]+>/g, " "));
  const link = `/news/${news.id}`;

  return (
    <div className="group rounded-lg bg-muted overflow-hidden hover:drop-shadow-lg hover:-translate-y-1 transition-all grid grid-rows-[auto_1fr]">
      <Link href={link}>
        <img
          src={news.image.downloadUrl}
          className="w-full h-fit my-auto aspect-video col-span-2 rounded-t-xl object-cover object-center border"
        />
      </Link>
      <div className="p-3 h-full flex flex-col">
        <p>
          {news.creatorName} |{" "}
          {formatDate(news.createdAt, {
            withoutHour: true,
            longMonth: true,
          })}
        </p>
        <Link
          href={link}
          className="font-semibold text-xl group-hover:text-yellow-700 transition"
        >
          {news.title}
        </Link>
        <p className="my-3 flex-grow">{previewText}</p>
        <Link href={link} className="font-medium text-yellow-700">
          Baca selengkapnya
        </Link>
      </div>
    </div>
  );
};
export default NewsCard;
