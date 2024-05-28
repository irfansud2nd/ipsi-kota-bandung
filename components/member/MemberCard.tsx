import { imageMaxSize, imageSchema } from "@/lib/form/formConstants";
import { Member } from "@/lib/member/memberConstants";

type Props = {
  member: Member;
  className?: string;
};

const MemberCard = ({ member, className }: Props) => {
  let imageSource = "/images/profile-fallback.png";

  if (member.image?.file) {
    imageSchema(imageMaxSize.member).isValidSync(member.image.file) &&
      (imageSource = URL.createObjectURL(member.image.file));
  }

  if (member.image?.downloadUrl) imageSource = member.image.downloadUrl;

  return (
    <div
      className={`rounded-lg bg-muted overflow-hidden hover:drop-shadow-lg hover:-translate-y-1 transition-all ${className}`}
    >
      <img
        src={imageSource}
        alt={`Foto ${member.name}`}
        className="bg-gray-200 aspect-square object-cover object-center"
      />
      <div className="p-2">
        <h3 className="text-lg font-medium">{member.name}</h3>
        <p>{member.position}</p>
      </div>
    </div>
  );
};
export default MemberCard;
