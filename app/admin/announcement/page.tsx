import AnnouncementForm from "@/components/admin/announcement/AnnouncementForm";
import Container from "@/components/ui/Container";
import RichTextDisplay from "@/components/ui/RichTextDisplay";
import { getAnnouncement } from "@/lib/announcement/announcementActions";
import { fetchData, formatDate } from "@/lib/functions";

const page = async () => {
  const announcement = await fetchData(() => getAnnouncement());

  return (
    <Container className="p-2">
      <h1 className="text-2xl font-bold">Kelola Pengumuman</h1>
      <RichTextDisplay
        text={announcement.text}
        fallback="Tidak ada pengumuman"
        className="border-2 p-2 text-justify rounded"
      />
      <p>
        Terakhir diperbaharui pada <b>{formatDate(announcement.updated_at)}</b>{" "}
        oleh <b>{announcement.updater_email}</b>
      </p>
      <AnnouncementForm announcement={announcement} />
    </Container>
  );
};
export default page;
