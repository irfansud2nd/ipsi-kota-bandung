import EventForm from "@/components/admin/event/EventForm";
import Container from "@/components/ui/Container";

const page = () => {
  return (
    <Container className="w-full h-full p-2 px-5 md:px-10">
      <h1 className="font-bold text-2xl border-b-2 mb-1 pb-1 w-full">
        Unggah Event
      </h1>
      <p className="border p-1 text-center bg-gradient-to-br from-yellow-400 to-yellow-100 font-bold rounded-md mb-2">
        Bukan untuk menambahkan event kejuaraan
      </p>
      <EventForm />
    </Container>
  );
};
export default page;
