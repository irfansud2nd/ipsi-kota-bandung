import { NewsColumns } from "@/components/admin/news/NewsColumns";
import { DataTable } from "@/components/ui/DataTable";
import PagePagination from "@/components/ui/PagePagination";
import { News } from "@/lib/news/newsConstants";
import { SearchPageParams } from "@/lib/constants";
import { getNewsArr } from "@/lib/news/newsFunctions";

const page = async ({ searchParams }: { searchParams: SearchPageParams }) => {
  const page = Number(searchParams.page) || 1;
  const limit = 10;
  const newsArr: News[] = await getNewsArr(page, limit);
  return (
    <div className="p-2">
      <div className="flex w-full">
        <h1 className="font-bold text-2xl mb-2">Kelola Berita</h1>
        <PagePagination
          page={page}
          limit={limit}
          dataLength={newsArr.length}
          className="mr-0 w-fit"
          link="/admin/news?"
        />
      </div>
      <DataTable columns={NewsColumns} data={newsArr} />
    </div>
  );
};
export default page;
