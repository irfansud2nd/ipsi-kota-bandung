import { News } from "@/lib/news/newsConstants";
import { formatDate } from "@/lib/functions";
import { FaClock, FaPenFancy } from "react-icons/fa6";
import { imageMaxSize, imageSchema } from "@/lib/form/formConstants";
import RichTextDisplay from "../ui/RichTextDisplay";

type Props = {
  news: News;
  preview?: boolean;
};

const NewsDisplay = ({ news, preview }: Props) => {
  let showImage = false;
  let imageUrl = news.image.downloadUrl;

  if (!preview) {
    showImage = true;
  } else if (
    news.image.file &&
    imageSchema(imageMaxSize.news).isValidSync(news.image.file)
  ) {
    showImage = true;
    imageUrl = URL.createObjectURL(news.image.file);
  }

  return (
    <div className={`${preview ? "w-full" : "col-span-6 lg:col-span-7"}`}>
      <h1 className="text-3xl font-bold">
        {news.title.length ? news.title : "Judul Berita"}
      </h1>
      <p className="mt-1 mb-3 flex items-center gap-2">
        <FaClock />
        {formatDate(Date.now(), { longMonth: true, withoutHour: true })}
        <span>|</span>
        <FaPenFancy />
        {news.writer}
      </p>
      {showImage ? (
        <img
          src={imageUrl}
          className="w-full h-fit my-auto aspect-video col-span-2 rounded-xl object-cover object-center border"
        />
      ) : (
        <div className="w-full h-fit my-auto bg-gray-200 aspect-video flex justify-center items-center text-5xl font-extrabold col-span-2 rounded-xl">
          IMAGE
        </div>
      )}
      <RichTextDisplay
        className="text-justify mt-2"
        text={news.text}
        fallback="Konten"
      />
    </div>
  );
};
export default NewsDisplay;
