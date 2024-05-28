import { getAnnouncement } from "@/lib/serverFunctions";
import Container from "../ui/Container";
import RichTextDisplay from "../ui/RichTextDisplay";

const Announcement = async () => {
  const announcement = await getAnnouncement();
  return (
    <Container className="h-fit px-5 md:px-10">
      <div className="p-5 rounded-3xl bg-gradient-to-br from-yellow-400 to-yellow-100">
        <h3 className="font-semibold text-2xl border-b-2 border-black pb-1 mb-1">
          Pengumuman
        </h3>
        <RichTextDisplay
          text={announcement.text}
          fallback="Tidak ada pengumuman."
        />
      </div>
    </Container>
  );
};
export default Announcement;
