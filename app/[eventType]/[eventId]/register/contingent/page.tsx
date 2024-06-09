import ContingentInfo from "@/components/contingent/ContingentInfo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontingen",
};

const page = ({ params }: { params: { eventId: string } }) => {
  return <ContingentInfo championshipId={params.eventId} />;
};
export default page;
