import { News } from "@/lib/news/newsConstants";
import { formatDate } from "@/lib/functions";
import Link from "next/link";

const NewsItem = ({ news }: { news: News }) => {
  return (
    <>
      <Link
        href={`/news/${news.id}?title=${news.title}`}
        className="w-full h-fit grid grid-cols-4 gap-2 my-2"
      >
        <img
          src={news.image.downloadUrl}
          className="w-full h-fit my-auto bg-gray-200 aspect-square flex justify-center items-center font-extrabold col-span-1 rounded-xl"
        />
        <div className="col-span-3">
          <h5 className="font-medium">{news.title}</h5>
          <p>
            {formatDate(news.createdAt, {
              longMonth: true,
              withoutHour: true,
            })}
          </p>
        </div>
      </Link>
      <hr />
    </>
  );
};

export default NewsItem;
