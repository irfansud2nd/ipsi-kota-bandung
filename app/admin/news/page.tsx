import PagePagination from "@/components/ui/PagePagination";
import { News } from "@/lib/news/newsConstants";
import { SearchPageParams } from "@/lib/constants";
import { getNewsArr } from "@/lib/news/newsFunctions";
import NewsTable from "@/components/admin/news/NewsTable";

const page = async ({ searchParams }: { searchParams: SearchPageParams }) => {
  const page = Number(searchParams.page) || 1;
  const limit = 10;
  const newsArr: News[] = await getNewsArr(page, limit);
  return (
    <div className="p-2">
      <h1 className="font-bold text-2xl mb-2">Kelola Berita</h1>
      <NewsTable newsArr={newsArr} />
      <PagePagination
        page={page}
        limit={limit}
        dataLength={newsArr.length}
        className="mr-0 w-fit"
        link="/admin/news?"
      />
    </div>
  );
};
export default page;
