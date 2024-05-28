import { Member } from "@/lib/member/memberConstants";
import MemberCard from "./MemberCard";

const MemberList = ({ members }: { members: Member[] }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {members.map((member) => (
        <MemberCard member={member} />
      ))}
    </div>
  );
};
export default MemberList;
