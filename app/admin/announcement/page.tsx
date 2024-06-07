import AnnouncementForm from "@/components/admin/announcement/AnnouncementForm";
import Container from "@/components/ui/Container";
import RichTextDisplay from "@/components/ui/RichTextDisplay";
import { formatDate } from "@/lib/functions";
import { getAnnouncement } from "@/lib/serverFunctions";

const page = async () => {
  const announcement = await getAnnouncement();
  return (
    <Container className="p-2">
      <h1 className="text-2xl font-bold">Kelola Pengumuman</h1>
      <RichTextDisplay
        text={announcement.text}
        fallback="Tidak ada pengumuman"
        className="border-2 p-2 text-justify rounded"
      />
      <p>
        Terakhir diperbaharui pada <b>{formatDate(announcement.updatedAt)}</b>{" "}
        oleh <b>{announcement.updaterEmail}</b>
      </p>
      <AnnouncementForm announcement={announcement} />
    </Container>
  );
};
export default page;
