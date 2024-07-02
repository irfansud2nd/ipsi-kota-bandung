import NewsList from "@/components/news/NewsList";
import { Metadata } from "next";
import { News } from "@/lib/news/newsConstants";
import PagePagination from "@/components/ui/PagePagination";
import PageBanner from "@/components/ui/PageBanner";
import Container from "@/components/ui/Container";
import { getNewsArr } from "@/lib/news/newsFunctions";

export const metadata: Metadata = {
  title: "Berita",
  description: "Kumpulan Berita IPSI Kota Bandung",
};

const page = async ({ searchParams }: { searchParams: { page: string } }) => {
  let limit = 6;
  const page = Number(searchParams.page) || 1;
  const newsArr = await getNewsArr(page, limit);

  return (
    <div>
      <PageBanner
        imgUrl="/images/home-banner-people.png"
        title="Berita"
        className="text-white"
        text="IPSI Kota Bandung"
      />
      <div className="bg-white rounded-t-[50px] -mt-10 pt-10 pb-5  w-full">
        <Container className="px-5 md:px-10 h-full">
          <NewsList newsArr={newsArr} />
          <PagePagination
            page={page}
            limit={limit}
            dataLength={newsArr.length}
            link="/news?"
            className="mt-5 md:justify-end md:px-10"
          />
        </Container>
      </div>
    </div>
  );
};
export default page;
