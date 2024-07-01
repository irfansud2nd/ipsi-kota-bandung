import OfficialPage from "@/components/admin/official/OfficalPage";

const page = ({
  searchParams,
}: {
  searchParams: { page: string; showAll: string };
}) => {
  const page = Number(searchParams.page) || 1;
  const limit = 10;
  const showAll = searchParams.showAll == "true";

  return <OfficialPage page={page} limit={limit} showAll={showAll} />;
};
export default page;
