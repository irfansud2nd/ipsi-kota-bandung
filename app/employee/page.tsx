import MemberCard from "@/components/member/MemberCard";
import EmployeeCard from "@/components/member/MemberCard";
import MemberList from "@/components/member/MemberList";
import Container from "@/components/ui/Container";
import PageBanner from "@/components/ui/PageBanner";
import PagePagination from "@/components/ui/PagePagination";
import { Member } from "@/lib/member/memberConstants";
import { getEmployees } from "@/lib/serverFunctions";
import { Metadata } from "next";

type Props = {
  searchParams: { page: string };
};

export const metadata: Metadata = {
  title: "Pengurus",
  description: "Daftar Pengurus IPSI Kota Bandung",
};

const page = async ({ searchParams }: Props) => {
  const limit = 8;
  const page = Number(searchParams.page) || 1;

  const employees = await getEmployees(page, limit);

  return (
    <div>
      <PageBanner
        imgUrl="/images/home-banner-people.png"
        title="Pengurus"
        className="text-white"
        text="IPSI Kota Bandung"
      />
      <div className="bg-white rounded-t-[50px] -mt-10 pt-10 pb-5 w-full">
        <Container className="px-5 md:px-10 h-full ">
          <MemberList members={employees} />
          <PagePagination
            page={page}
            limit={limit}
            dataLength={employees.length}
            link={`/employee?`}
            className="mt-5 md:justify-end md:px-10"
          />
        </Container>
      </div>
    </div>
  );
};
export default page;
