import { Member } from "@/lib/member/memberConstants";
import MemberCard from "./MemberCard";

const MemberList = ({ members }: { members: Member[] }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {members.length ? (
        members.map((member) => <MemberCard member={member} />)
      ) : (
        <p>Tidak ada.</p>
      )}
    </div>
  );
};
export default MemberList;
