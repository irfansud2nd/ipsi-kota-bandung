import NewsForm from "@/components/admin/news/NewsForm";
import Container from "@/components/ui/Container";

const page = () => {
  return (
    <Container className="w-full h-full p-2 px-5 md:px-10">
      <h1 className="font-bold text-2xl border-b-2 mb-1 pb-1 w-full">
        Unggah Berita
      </h1>
      <NewsForm />
    </Container>
  );
};
export default page;
